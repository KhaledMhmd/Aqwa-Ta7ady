// ============================================================
// game.hook.ts
// Bridge between game logic and the UI.
// Holds all live game state and exposes actions the screen calls.
// Angular equivalent: component class logic + injected services.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { GameState, TurnState } from '../types/game.types';
import { Player } from '../../../core/types/player.types';
import { AppSettings } from '../../../core/types/settings.types';
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
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState(player1, player2)
  );

  // turnState holds what is happening in the current turn only.
  const [turnState, setTurnState] = useState<TurnState>(
    createInitialTurnState()
  );

  // totalTurns tracks how many turns have been played.
  const [totalTurns, setTotalTurns] = useState<number>(0);

  // Trigger bot move when it becomes the bot's turn.
  // useEffect watches currentPlayer — fires whenever it changes.
  useEffect(() => {
    if (gameState.currentPlayer.type === 'bot' && !gameState.isGameOver) {
      const botTimer = setTimeout(() => {
        handleBotTurn();
      }, 1000); // 1 second delay so the bot does not respond instantly.
      return () => clearTimeout(botTimer);
    }
  }, [gameState.currentPlayer, gameState.isGameOver]);

  // handleBotTurn executes the bot's full turn automatically.
  // Bot picks a cell, gets an answer, and processes it.
  const handleBotTurn = useCallback(() => {
    const botMove = getBotMove(gameState.board);
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
    if (gameState.isGameOver) return;
    if (gameState.currentPlayer.type === 'bot') return;

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
      gameState.usedAnswers, // Pass the global used answers list.
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
        // Line win — end the game immediately.
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
        // Board full, no line — decide by cell count.
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
        // Game continues — switch to the other player.
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
      // Answer is correct but already used on another cell.
      // Do NOT switch the turn — player gets to try again with a different name.
      // Show the already-used message inside the modal.
      setTurnState((prev) => ({
        ...prev,
        isAlreadyUsed: true,  // Triggers the specific message in the modal.
        isWrongAnswer: false, // Not a wrong answer — different message entirely.
      }));

      // Reset the already-used flag after 2 seconds so it can trigger again
      // if the player submits another already-used answer.
      setTimeout(() => {
        setTurnState((prev) => ({ ...prev, isAlreadyUsed: false }));
      }, 2000);

    } else {
      // Wrong answer — trigger shake animation and switch turn.
      setTurnState((prev) => ({
        ...prev,
        isWrongAnswer: true,
        isAlreadyUsed: false,
      }));

      // Reset the wrong answer flag after 600ms.
      setTimeout(() => {
        setTurnState((prev) => ({ ...prev, isWrongAnswer: false }));
      }, 600);

      // Switch to the other player after a short delay
      // so the shake animation plays before the turn switches.
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
    setGameState(createInitialGameState(player1, player2));
    setTurnState(createInitialTurnState());
    setTotalTurns(0);
  };

  return {
    gameState,
    turnState,
    totalTurns,
    onCellPress,
    onAnswerSubmit,
    onModalClose,
    resetGame,
  };
};