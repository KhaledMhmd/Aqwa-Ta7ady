// ============================================================
// game.types.ts
// All TypeScript types specific to tic-tac-toe.
// Nothing outside the tic-tac-toe folder imports from here.
// Angular equivalent: a models folder inside a game feature module.
// ============================================================

import { Player } from '../../../core/types/player.types';

// CellState — the state of one cell in the 3x3 grid.
export type CellState = {
  // null = nobody has claimed this cell yet.
  // Player = the player who answered correctly and owns this cell.
  claimedBy: Player | null;

  // The answer used to claim this cell — stored so the same
  // answer cannot be used again anywhere else on the board.
  // null when the cell is unclaimed.
  usedAnswer: string | null;
};

// GridHeader — one club badge shown as a row or column header.
export type GridHeader = {
  id: string;     // Internal ID. Example: 'arsenal'
  label: string;  // Display name. Example: 'Arsenal'
  image: string;  // Badge image URL.
};

// CellQuestion — the question for a specific cell.
export type CellQuestion = {
  rowHeader: GridHeader;      // Club on the LEFT of this row.
  colHeader: GridHeader;      // Club on the TOP of this column.
  acceptedAnswers: string[];  // All valid answers — all lowercase.
};

// AnswerResult — the possible outcomes when a player submits an answer.
// 'correct'      = answer is valid and not used before — claim the cell.
// 'wrong'        = answer does not match any accepted answer — shake + switch turn.
// 'already-used' = answer is correct BUT was already used on another cell —
//                  show specific message, do NOT switch turn, let player try again.
export type AnswerResult = 'correct' | 'wrong' | 'already-used';

// GameState — snapshot of the entire game at any moment.
export type GameState = {
  // The 3x3 board — board[row][col] gives the CellState of that cell.
  board: CellState[][];

  // Whose turn it is right now.
  currentPlayer: Player;

  // null until the game ends — then holds the winning Player object.
  // Always set when isGameOver is true — no draws possible.
  winner: Player | null;

  // How the game was won — only set when isGameOver is true.
  // 'line'       = player got 3 in a row.
  // 'cell-count' = board filled with no line, winner had more cells.
  // null while the game is still in progress.
  winType: 'line' | 'cell-count' | null;

  // All answers used anywhere on the board so far — normalised to lowercase.
  // A new answer is checked against this list before being accepted.
  // If found here, the answer is rejected with 'already-used' result.
  usedAnswers: string[];

  // Live cell count for each player — updated after every correct answer.
  // Shown during the game as a score and used to decide winner when board is full.
  cellCounts: {
    player1: number;
    player2: number;
  };

  // True when winner is set — either by line win or cell count win.
  isGameOver: boolean;
};

// TurnState — what is happening in the current turn only.
// Resets completely after every turn ends.
export type TurnState = {
  // The row and col of the cell the current player just tapped.
  selectedCell: { row: number; col: number } | null;

  // Controls whether the question modal is visible on screen.
  isModalVisible: boolean;

  // The question loaded into the modal for the selected cell.
  currentQuestion: CellQuestion | null;

  // True when the last submitted answer was wrong.
  // Triggers the shake animation on the input field.
  isWrongAnswer: boolean;

  // True when the last submitted answer was correct but already used
  // on another cell. Shows a specific message — does NOT switch turn.
  // The player stays in the modal and can try a different answer.
  isAlreadyUsed: boolean;
};

// GameResult — passed to the result screen when the game ends.
export type GameResult = {
  winner: Player;                        // Always has a winner — no draws.
  winType: 'line' | 'cell-count';        // How the winner was decided.
  player1Cells: number;                  // How many cells player 1 claimed.
  player2Cells: number;                  // How many cells player 2 claimed.
  totalTurns: number;                    // How many turns the game lasted.
};