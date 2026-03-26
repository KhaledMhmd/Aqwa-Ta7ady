// // ============================================================
// // game.types.ts
// // All TypeScript types specific to the tic-tac-toe game.
// // No other game or screen imports from this file —
// // it is fully isolated inside the tic-tac-toe folder.
// // Angular equivalent: a models folder inside a game feature module.
// // ============================================================

// import { Player } from '../../../core/types/player.types';
// // We import Player from core because a player is app-wide —
// // the same Player type is used in every game.
// // The game-specific types below are ONLY used in tic-tac-toe.

// // CellState represents the current state of one cell in the 3x3 grid.
// // Every cell starts as empty and can be claimed by a player.
// export type CellState = {

//   // null = nobody has claimed this cell yet.
//   // Player = the player who answered correctly and owns this cell.
//   // Angular equivalent: a nullable property on a CellModel class.
//   claimedBy: Player | null;

//   // The answer that was used to claim this cell.
//   // Stored so the Steal Cells feature can reject the same answer
//   // if another player tries to use it to steal the cell.
//   // null when the cell is unclaimed.
//   usedAnswer: string | null;

// };

// // GridHeader represents one club badge shown on the top row
// // or left column of the game board.
// export type GridHeader = {
//   id: string;      // Internal ID used to match questions to cells. Example: 'arsenal'
//   label: string;   // Display name shown under the badge. Example: 'Arsenal'
//   image: string;   // URL of the club badge image.
// };

// // CellQuestion is the question generated for a specific cell.
// // It is determined by the intersection of a row header and a column header.
// export type CellQuestion = {
//   rowHeader: GridHeader;           // The club on the LEFT of this cell's row.
//   colHeader: GridHeader;           // The club on the TOP of this cell's column.
//   acceptedAnswers: string[];       // All valid answers for this cell — all lowercase.
// };

// // GameState is a snapshot of the entire game at any moment.
// // This is what gets stored in the hook and passed to components.
// export type GameState = {
//   // The 3x3 board — board[row][col] gives the CellState of that cell.
//   // Example: board[0][2] is the top-right cell.
//   board: CellState[][];

//   // The player whose turn it is right now.
//   currentPlayer: Player;

//   // null until someone wins — then holds the winning Player object.
//   winner: Player | null;

//   // True when all 9 cells are claimed and nobody won.
//   isDraw: boolean;

//   // True when winner is set OR isDraw is true.
//   // Components check this to disable cells and show the result.
//   isGameOver: boolean;
// };

// // TurnState tracks what is happening in the CURRENT turn only.
// // It resets completely after every turn ends.
// export type TurnState = {
//   // The row and col of the cell the current player just tapped.
//   // null when no cell is selected (between turns).
//   selectedCell: { row: number; col: number } | null;

//   // Controls whether the question modal is visible on screen.
//   // true = modal is open, false = modal is closed.
//   isModalVisible: boolean;

//   // The question loaded into the modal for the selected cell.
//   // null when no cell is selected.
//   currentQuestion: CellQuestion | null;

//   // Whether the current player's submitted answer was wrong.
//   // Used to trigger the shake animation on the input field.
//   isWrongAnswer: boolean;
// };

// // GameResult is passed to the result screen when the game ends.
// export type GameResult = {
//   winner: Player | null;  // null means it was a draw.
//   isDraw: boolean;
//   totalTurns: number;     // How many turns the game lasted.
// };
// ============================================================
// game.types.ts
// All TypeScript types specific to tic-tac-toe.
// Nothing outside the tic-tac-toe folder imports from here.
// Angular equivalent: a models folder inside a game feature module.
// ============================================================

import { Player } from '../../../core/types/player.types';

// CellState — the state of one cell in the 3x3 grid.
export type CellState = {
  claimedBy: Player | null;   // null = empty. Player = claimed.
  usedAnswer: string | null;  // The answer used to claim this cell.
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

// GameState — snapshot of the entire game at any moment.
export type GameState = {
  board: CellState[][];     // 3x3 board — board[row][col].
  currentPlayer: Player;    // Whose turn it is.
  winner: Player | null;    // null until someone wins.
  isDraw: boolean;          // True when board full with no winner.
  isGameOver: boolean;      // True when winner set OR isDraw true.
};

// TurnState — what is happening in the current turn only.
export type TurnState = {
  selectedCell: { row: number; col: number } | null;
  isModalVisible: boolean;
  currentQuestion: CellQuestion | null;
  isWrongAnswer: boolean;  // Triggers shake animation on input.
};

// GameResult — passed to result screen when game ends.
export type GameResult = {
  winner: Player | null;
  isDraw: boolean;
  totalTurns: number;
};