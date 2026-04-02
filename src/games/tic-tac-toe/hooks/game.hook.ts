// ── React Native ──────────────────────────────────────

// ============================================================
// game.hook.ts
// Bridge between game logic and the UI.
// Holds all live game state, turn timer, and exposes actions.
// Timer starts when a turn begins, not when a cell is tapped.
// Angular equivalent: component class logic + injected services.
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react'; // Added useRef for timer interval.
import { AppState, AppStateStatus } from 'react-native';           // For pausing timer when app backgrounds.
import { GameState, TurnState } from '../types/game.types';        // Game and turn state types.
import { Player } from '../../../core/types/player.types';         // Player type.
import { AppSettings } from '../../../core/types/settings.types';  // Settings type.
import { TTT_CONFIG } from '../config/game.config';                // Timer duration config.
import {
  createInitialGameState,
  createInitialTurnState,
  getQuestion,
  validateAnswer,
  checkWinner,
  checkBoardFull,
  getCellCountWinner,
  countCells,
  claimCell,
  switchPlayer,
  getBotMove,
  getBotAnswer,
} from '../logic/game.service';

export const useGame = (
  player1: Player,
  player2: Player,
  settings: AppSettings,
) => {

  // gameState holds the full game state — board, scores, winner, etc.
  // Angular equivalent: a game state observable from GameService.
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState(player1, player2)
  );

  // turnState holds what is happening in the current turn only.
  // Angular equivalent: a turn state observable from GameService.
  const [turnState, setTurnState] = useState<TurnState>(
    createInitialTurnState()
  );

  // totalTurns tracks how many turns have been played.
  const [totalTurns, setTotalTurns] = useState<number>(0);

  // ── TURN TIMER STATE ─────────────────────────────────
  // timeLeft counts down from turnTimeLimitSeconds to 0.
  // Displayed on the turn indicator next to the active player.
  // When it hits 0, the turn is automatically skipped.
  const [timeLeft, setTimeLeft] = useState<number>(TTT_CONFIG.turnTimeLimitSeconds);

  // Ref to hold the interval ID so we can clear it from anywhere.
  // Angular equivalent: a private intervalId property on the component class.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Ref to track app foreground/background state for pausing the timer.
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // ── START/STOP TIMER HELPERS ─────────────────────────

  // Clears the running interval — called on turn end, game over, cleanup.
  const clearTimer = () => {
    if (timerRef.current) {                                         // Only clear if an interval exists.
      clearInterval(timerRef.current);                               // Stop the interval.
      timerRef.current = null;                                       // Reset the ref.
    }
  };

  // Starts a fresh countdown from the configured duration.
  // Called at the beginning of every turn (including the first turn).
  const startTimer = () => {
    clearTimer();                                                    // Clear any existing timer first.
    setTimeLeft(TTT_CONFIG.turnTimeLimitSeconds);                    // Reset to full duration.
    timerRef.current = setInterval(() => {                           // Start counting down every second.
      setTimeLeft((prev) => {
        if (prev <= 1) {                                             // Time's up — return 0.
          clearTimer();
          return 0;
        }
        return prev - 1;                                             // Decrement by 1 second.
      });
    }, 1000);
  };

  // ── TIMER: START ON TURN BEGIN ───────────────────────
  // Watches currentPlayer and isGameOver.
  // Starts a fresh timer every time the turn switches to a human player.
  // Does NOT start for bot turns — bot doesn't need a timer.
  // Stops the timer when the game ends.
  // Angular equivalent: a subscription to currentPlayer$ that resets the timer.
  useEffect(() => {
    if (gameState.isGameOver) {                                      // Game ended — stop the timer.
      clearTimer();
      return;
    }

    if (!settings.gameRules.timeLimitEnabled) {                      // Timer disabled in settings — do nothing.
      clearTimer();
      return;
    }

    if (gameState.currentPlayer.type === 'bot') {                    // Bot's turn — no timer needed.
      clearTimer();
      return;
    }

    // Human player's turn and timer is enabled — start countdown.
    startTimer();

    // Cleanup function — clears timer when this effect re-runs or component unmounts.
    return () => clearTimer();
  }, [gameState.currentPlayer, gameState.isGameOver, settings.gameRules.timeLimitEnabled]);

  // ── TIMER: AUTO-SKIP ON TIMEOUT ──────────────────────
  // When timeLeft hits 0, automatically skip the current player's turn.
  // If the modal is open, close it first.
  // Angular equivalent: a timer$.pipe(filter(t => t === 0)).subscribe(() => skipTurn()).
  useEffect(() => {
    if (timeLeft === 0 && settings.gameRules.timeLimitEnabled && !gameState.isGameOver) {
      // Close the modal if it's open — player ran out of time mid-answer.
      setTurnState(createInitialTurnState());

      // Switch to the other player.
      setGameState((prev) => ({
        ...prev,
        currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
      }));
    }
  }, [timeLeft]);

  // ── TIMER: PAUSE WHEN APP BACKGROUNDS ────────────────
  // Pauses the countdown when the app goes to background.
  // Resumes when the app comes back to foreground.
  // Angular equivalent: document.addEventListener('visibilitychange', ...).
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App went to background — pause by clearing the interval.
        clearTimer();
      } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came back to foreground — resume if conditions are met.
        if (
          settings.gameRules.timeLimitEnabled &&
          !gameState.isGameOver &&
          gameState.currentPlayer.type !== 'bot' &&
          timeLeft > 0
        ) {
          // Restart the interval from the current timeLeft (not from full duration).
          timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
              if (prev <= 1) {
                clearTimer();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      }
      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, [settings.gameRules.timeLimitEnabled, gameState.isGameOver, gameState.currentPlayer, timeLeft]);

  // ── BOT TURN ─────────────────────────────────────────
  // Trigger bot move when it becomes the bot's turn.
  // useEffect watches currentPlayer — fires whenever it changes.
  useEffect(() => {
    if (gameState.currentPlayer.type === 'bot' && !gameState.isGameOver) {
      const botTimer = setTimeout(() => {
        handleBotTurn();
      }, 1000);                                                      // 1 second delay so bot doesn't respond instantly.
      return () => clearTimeout(botTimer);
    }
  }, [gameState.currentPlayer, gameState.isGameOver]);

  // handleBotTurn executes the bot's full turn automatically.
  // Bot picks a cell, gets an answer, and processes it.
  const handleBotTurn = useCallback(() => {
    const botMove = getBotMove(gameState.board);                     // Pick a cell to play.
    if (!botMove) return;

    const { row, col } = botMove;

    // Pass global used answers so bot avoids reusing player names.
    const botAnswer = getBotAnswer(row, col, gameState.usedAnswers);

    // If all answers for this cell are used, bot skips its turn.
    if (!botAnswer) {
      setGameState((prev) => ({
        ...prev,
        currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
      }));
      return;
    }

    const question = getQuestion(row, col);
    if (!question) return;

    const existingAnswer = gameState.board[row][col].usedAnswer;

    // Validate bot answer — bot respects all the same rules as human.
    const result = validateAnswer(
      botAnswer,
      question.acceptedAnswers,
      existingAnswer,
      gameState.usedAnswers,
    );

    if (result === 'correct') {
      const newBoard = claimCell(gameState.board, row, col, player2, botAnswer);
      const hasLineWin = checkWinner(newBoard, player2);

      // Update global used answers — add the bot's answer to the list.
      const newUsedAnswers = [...gameState.usedAnswers, botAnswer.trim().toLowerCase()];

      const newCellCounts = {
        player1: countCells(newBoard, player1),
        player2: countCells(newBoard, player2),
      };

      if (hasLineWin) {
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: player2,
          winType: 'line',
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: true,
        }));
      } else if (checkBoardFull(newBoard)) {
        const cellCountWinner = getCellCountWinner(newBoard, player1, player2);
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: cellCountWinner,
          winType: 'cell-count',
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: true,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: null,
          winType: null,
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: false,
          currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
        }));
      }
      setTotalTurns((prev) => prev + 1);

    } else {
      // Bot answer was wrong or already used — skip bot turn.
      setGameState((prev) => ({
        ...prev,
        currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
      }));
    }
  }, [gameState, player1, player2, settings]);

  // onCellPress is called when the human player taps a cell.
  const onCellPress = (row: number, col: number) => {
    if (gameState.isGameOver) return;                                // Block if game is over.
    if (gameState.currentPlayer.type === 'bot') return;              // Block during bot's turn.

    const cell = gameState.board[row][col];

    // Block tapping claimed cells unless Steal Cells is enabled.
    if (!settings.gameRules.stealCells && cell.claimedBy !== null) return;

    // Block stealing your own cell.
    if (
      settings.gameRules.stealCells &&
      cell.claimedBy !== null &&
      cell.claimedBy.id === gameState.currentPlayer.id
    ) return;

    const question = getQuestion(row, col);
    if (!question) return;

    // Open the question modal with this cell's question.
    // Timer keeps running — it started at the beginning of the turn, not here.
    setTurnState({
      selectedCell: { row, col },
      isModalVisible: true,
      currentQuestion: question,
      isWrongAnswer: false,
      isAlreadyUsed: false,
    });
  };

  // onAnswerSubmit is called when the player presses Submit in the modal.
  const onAnswerSubmit = (userAnswer: string) => {
    if (!turnState.selectedCell || !turnState.currentQuestion) return;

    const { row, col } = turnState.selectedCell;
    const existingAnswer = gameState.board[row][col].usedAnswer;

    // Validate the answer — returns 'correct', 'wrong', or 'already-used'.
    const result = validateAnswer(
      userAnswer,
      turnState.currentQuestion.acceptedAnswers,
      existingAnswer,
      gameState.usedAnswers,
    );

    if (result === 'correct') {
      // Correct answer — claim the cell.
      const newBoard = claimCell(
        gameState.board, row, col, gameState.currentPlayer, userAnswer
      );

      // Add this answer to the global used answers list.
      const newUsedAnswers = [
        ...gameState.usedAnswers,
        userAnswer.trim().toLowerCase(),
      ];

      const hasLineWin = checkWinner(newBoard, gameState.currentPlayer);

      // Update cell counts after claiming.
      const newCellCounts = {
        player1: countCells(newBoard, player1),
        player2: countCells(newBoard, player2),
      };

      if (hasLineWin) {
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: gameState.currentPlayer,
          winType: 'line',
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: true,
        }));
      } else if (checkBoardFull(newBoard)) {
        const cellCountWinner = getCellCountWinner(newBoard, player1, player2);
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: cellCountWinner,
          winType: 'cell-count',
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: true,
        }));
      } else {
        setGameState((prev) => ({
          ...prev,
          board: newBoard,
          winner: null,
          winType: null,
          usedAnswers: newUsedAnswers,
          cellCounts: newCellCounts,
          isGameOver: false,
          currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
        }));
      }

      // Close the modal and reset turn state.
      setTurnState(createInitialTurnState());
      setTotalTurns((prev) => prev + 1);

    } else if (result === 'already-used') {
      // Answer correct but already used — keep modal open, player tries again.
      setTurnState((prev) => ({
        ...prev,
        isAlreadyUsed: true,
        isWrongAnswer: false,
      }));

      setTimeout(() => {
        setTurnState((prev) => ({ ...prev, isAlreadyUsed: false }));
      }, 2000);

    } else {
      // Wrong answer — shake animation then switch turn.
      setTurnState((prev) => ({
        ...prev,
        isWrongAnswer: true,
        isAlreadyUsed: false,
      }));

      setTimeout(() => {
        setTurnState((prev) => ({ ...prev, isWrongAnswer: false }));
      }, 600);

      setTimeout(() => {
        setGameState((prev) => ({
          ...prev,
          currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
        }));
        setTurnState(createInitialTurnState());
      }, 800);
    }
  };

  // onModalClose — player dismissed the modal without answering.
  // Treated as a skipped turn — switches to the other player.
  const onModalClose = () => {
    setTurnState(createInitialTurnState());
    setGameState((prev) => ({
      ...prev,
      currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
    }));
  };

  // resetGame — wipes everything and starts fresh.
  const resetGame = () => {
    clearTimer();                                                    // Stop any running timer.
    setGameState(createInitialGameState(player1, player2));
    setTurnState(createInitialTurnState());
    setTotalTurns(0);
    setTimeLeft(TTT_CONFIG.turnTimeLimitSeconds);                    // Reset timer to full duration.
  };

  return {
    gameState,
    turnState,
    totalTurns,
    timeLeft,                                                        // Expose timer value to the UI.
    onCellPress,
    onAnswerSubmit,
    onModalClose,
    resetGame,
  };
};