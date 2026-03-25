// ============================================================
// game.hook.ts
// The bridge between game logic and the UI.
// Holds all live game state using useState.
// Exposes actions the screen component calls when things happen.
// Angular equivalent: the logic inside a component class —
// the properties and methods the template binds to.
// Key difference from Angular: this logic lives in a SEPARATE
// reusable hook function, not inside the component class itself.
// The component just calls useGame() and gets everything it needs.
// ============================================================

// useState — declares a stateful variable.
// When the setter is called, React re-renders the component.
// Angular equivalent: a class property that triggers change detection.

// useEffect — runs code in response to something.
// Angular equivalent: ngOnInit(), ngOnChanges(), ngOnDestroy().

// useCallback — memoizes a function so it is not recreated
// on every render. Used for the bot turn timer.
// Angular equivalent: no direct equivalent — Angular does not
// re-create methods on every change detection cycle.
import { useState, useEffect, useCallback } from 'react';

import { GameState, TurnState } from '../types/game.types';
import { Player } from '../../../core/types/player.types';
import { AppSettings } from '../../../core/types/settings.types';
import {
  createInitialGameState,   // Builds the starting game state.
  createInitialTurnState,   // Builds the starting turn state.
  getQuestion,              // Finds the question for a tapped cell.
  validateAnswer,           // Checks if the answer is correct.
  checkWinner,              // Checks if someone won.
  checkDraw,                // Checks if the board is full.
  claimCell,                // Returns a new board with a cell claimed.
  switchPlayer,             // Returns the other player.
  getBotMove,               // Returns the cell the bot chooses.
  getBotAnswer,             // Returns the answer the bot submits.
} from '../logic/game.service';

// useGame is the hook function.
// Called once inside the game screen component.
// Takes both players and the current app settings as arguments.
// Angular equivalent: a component class that injects GameService
// and receives @Input() player1, player2, and settings.
export const useGame = (
  player1: Player,       // The human player — always player1.
  player2: Player,       // The bot or second player — always player2.
  settings: AppSettings  // Current app settings — used for Steal Cells rule.
) => {

  // gameState holds the full state of the game at all times.
  // useState() takes the initial value and returns [value, setter].
  // Calling setGameState() with a new value triggers a UI re-render.
  // Angular equivalent: gameState property + BehaviorSubject in the service.
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState(player1, player2)
  );

  // turnState holds what is happening in the CURRENT turn only.
  // Resets completely after every turn ends.
  const [turnState, setTurnState] = useState<TurnState>(
    createInitialTurnState()
  );

  // totalTurns tracks how many turns have been played.
  // Used in the GameResult passed to the result screen.
  const [totalTurns, setTotalTurns] = useState<number>(0);

  // useEffect watches currentPlayer — whenever it changes,
  // this effect checks if it is the bot's turn and triggers the bot move.
  // Angular equivalent: ngOnChanges() reacting to currentPlayer changing.
  useEffect(() => {
    // Only trigger bot logic if the current player is the bot.
    if (gameState.currentPlayer.type === 'bot' && !gameState.isGameOver) {
      // Delay the bot's move by 1 second so it feels natural —
      // instant responses feel robotic and jarring.
      const botTimer = setTimeout(() => {
        handleBotTurn();
      }, 1000); // 1000 milliseconds = 1 second delay.

      // Cleanup function — cancels the timer if the component
      // unmounts before the timer fires (e.g. player quits mid-game).
      // Angular equivalent: ngOnDestroy() clearing a setTimeout.
      return () => clearTimeout(botTimer);
    }
  }, [gameState.currentPlayer, gameState.isGameOver]);
  // The array [gameState.currentPlayer, gameState.isGameOver] is the
  // dependency array — this effect re-runs whenever either of these changes.

  // handleBotTurn executes the bot's full turn automatically.
  // Gets the bot's chosen cell, gets the bot's answer, and processes it.
  // useCallback memoizes this function — it is only recreated when
  // gameState or settings changes, not on every render.
  // Angular equivalent: a private handleBotTurn() method in the component.
  const handleBotTurn = useCallback(() => {
    // Get the cell the bot wants to play.
    const botMove = getBotMove(gameState.board);

    // Safety check — if no move is available, do nothing.
    if (!botMove) return;

    const { row, col } = botMove;

    // Get the bot's answer for the chosen cell.
    const botAnswer = getBotAnswer(row, col);

    // Safety check — if no answer is available, skip the bot's turn.
    if (!botAnswer) {
      setGameState((prev) => ({
        ...prev,
        currentPlayer: switchPlayer(prev.currentPlayer, player1, player2),
      }));
      return;
    }

    // Get the question for this cell to validate the bot's answer.
    const question = getQuestion(row, col);
    if (!question) return;

    // Get the answer already used on this cell (for Steal Cells rule).
    const existingAnswer = gameState.board[row][col].usedAnswer;

    // Validate the bot's answer — easy bot always answers correctly
    // so this should always be true in Phase 1.
    const isCorrect = validateAnswer(
      botAnswer,
      question.acceptedAnswers,
      existingAnswer
    );

    if (isCorrect) {
      // Bot answered correctly — claim the cell.
      const newBoard = claimCell(
        gameState.board,
        row,
        col,
        player2,
        botAnswer
      );

      const hasWon = checkWinner(newBoard, player2);
      const isDraw = !hasWon && checkDraw(newBoard);

      // Update game state with the new board and result.
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        winner: hasWon ? player2 : null,
        isDraw,
        isGameOver: hasWon || isDraw,
        currentPlayer: hasWon || isDraw
          ? prev.currentPlayer
          : switchPlayer(prev.currentPlayer, player1, player2),
      }));

      // Increment turn counter.
      setTotalTurns((prev) => prev + 1);
    }
  }, [gameState, player1, player2, settings]);

  // onCellPress is called when the HUMAN player taps a cell.
  // Passed down as a prop to the GameCell component.
  // Angular equivalent: a method bound to (click) in the template.
  const onCellPress = (row: number, col: number) => {
    // Ignore taps if the game is over.
    if (gameState.isGameOver) return;

    // Ignore taps if it is the bot's turn.
    if (gameState.currentPlayer.type === 'bot') return;

    // Get the cell that was tapped.
    const cell = gameState.board[row][col];

    // If Steal Cells is DISABLED — ignore taps on claimed cells.
    if (!settings.gameRules.stealCells && cell.claimedBy !== null) return;

    // If Steal Cells is ENABLED — allow tapping claimed cells
    // BUT only if the cell is claimed by the OTHER player.
    // You cannot steal your own cell.
    if (
      settings.gameRules.stealCells &&
      cell.claimedBy !== null &&
      cell.claimedBy.id === gameState.currentPlayer.id
    ) return;

    // Find the question for this cell.
    const question = getQuestion(row, col);
    if (!question) return;

    // Open the question modal with this cell's question.
    // setTurnState triggers a re-render — the modal appears on screen.
    setTurnState({
      selectedCell: { row, col },
      isModalVisible: true,
      currentQuestion: question,
      isWrongAnswer: false,
    });
  };

  // onAnswerSubmit is called when the player presses Submit in the modal.
  // Angular equivalent: a method bound to (submit) on a form.
  const onAnswerSubmit = (userAnswer: string) => {
    // Safety check — do nothing if there is no active question.
    if (!turnState.selectedCell || !turnState.currentQuestion) return;

    const { row, col } = turnState.selectedCell;

    // Get the answer already used on this cell (for Steal Cells validation).
    const existingAnswer = gameState.board[row][col].usedAnswer;

    // Check the player's answer.
    const isCorrect = validateAnswer(
      userAnswer,
      turnState.currentQuestion.acceptedAnswers,
      existingAnswer
    );

    if (isCorrect) {
      // Correct — claim the cell for the current player.
      const newBoard = claimCell(
        gameState.board,
        row,
        col,
        gameState.currentPlayer,
        userAnswer
      );

      const hasWon = checkWinner(newBoard, gameState.currentPlayer);
      const isDraw = !hasWon && checkDraw(newBoard);

      // Update game state — (prev) => pattern used because React
      // state updates are asynchronous. Using prev guarantees we
      // always have the latest state value, not a stale one.
      // Angular equivalent: this.gameState = { ...this.gameState, ... }
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        winner: hasWon ? gameState.currentPlayer : null,
        isDraw,
        isGameOver: hasWon || isDraw,
        currentPlayer: hasWon || isDraw
          ? prev.currentPlayer
          : switchPlayer(prev.currentPlayer, player1, player2),
      }));

      // Close the modal and reset turn state.
      setTurnState(createInitialTurnState());

      // Increment the turn counter.
      setTotalTurns((prev) => prev + 1);

    } else {
      // Wrong answer — trigger the shake animation on the input.
      // The modal stays open so the player can see their answer was wrong.
      setTurnState((prev) => ({
        ...prev,
        isWrongAnswer: true, // This triggers the shake animation.
      }));

      // After 600ms reset isWrongAnswer so the animation can
      // trigger again if the player submits another wrong answer.
      setTimeout(() => {
        setTurnState((prev) => ({
          ...prev,
          isWrongAnswer: false,
        }));
      }, 600);
    }
  };

  // onModalClose is called when the player dismisses the modal
  // without submitting an answer — treated as a skipped turn.
  // Angular equivalent: a method bound to (close) on a modal component.
  const onModalClose = () => {
    // Close the modal.
    setTurnState(createInitialTurnState());

    // Switch to the other player — skipping counts as losing your turn.
    setGameState((prev) => ({
      ...prev,
      currentPlayer: switchPlayer(
        prev.currentPlayer,
        player1,
        player2
      ),
    }));
  };

  // resetGame wipes everything and starts fresh.
  // Called when the player taps "Play Again" on the result screen.
  // Angular equivalent: a reset() method that reinitialises all properties.
  const resetGame = () => {
    setGameState(createInitialGameState(player1, player2));
    setTurnState(createInitialTurnState());
    setTotalTurns(0);
  };

  // Return everything the game screen needs.
  // Angular equivalent: the public properties and methods of a component
  // class that the template accesses.
  return {
    gameState,      // Full game state — read to know what to display.
    turnState,      // Current turn state — controls modal visibility.
    totalTurns,     // How many turns played — for the result screen.
    onCellPress,    // Call when a cell is tapped.
    onAnswerSubmit, // Call when the player submits an answer.
    onModalClose,   // Call when the modal is dismissed without answering.
    resetGame,      // Call to restart the game.
  };
};
