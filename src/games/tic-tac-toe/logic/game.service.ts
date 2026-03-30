// ============================================================
// game.service.ts
// All pure logic functions for tic-tac-toe.
// Pure = takes inputs, returns outputs, no side effects.
// Never touches UI, state, or AsyncStorage.
// Angular equivalent: @Injectable() GameService class.
// ============================================================

import { GameState, CellState, TurnState, CellQuestion, AnswerResult } from '../types/game.types';
import { Player, BotPlayer } from '../../../core/types/player.types';
import { QUESTIONS, ROW_HEADERS, COL_HEADERS } from '../data/questions.data';
import { TTT_CONFIG } from '../config/game.config';
import { APP_CONFIG } from '../../../core/config/app.config';

// ── INITIAL STATE CREATORS ──────────────────────────────────

// Creates one empty cell — called when building the initial board.
// Returns a NEW object every time so cells never share memory.
export const createEmptyCell = (): CellState => ({
  claimedBy: null,    // Nobody owns this cell yet.
  usedAnswer: null,   // No answer has been used for this cell.
});

// Creates a fresh 3x3 board with all empty cells.
// Called in createInitialGameState() and resetGame().
export const createInitialBoard = (): CellState[][] => {
  return Array(TTT_CONFIG.gridSize)
    .fill(null)
    .map(() =>
      Array(TTT_CONFIG.gridSize)
        .fill(null)
        .map(() => createEmptyCell())
    );
};

// Creates a GuestPlayer for player 1.
// color is passed in from the screen via useTheme()
// so it always matches the active theme — never hardcoded here.
export const createGuestPlayer1 = (
  name: string,
  avatar: string,
  color: string,
): import('../../../core/types/player.types').GuestPlayer => ({
  type: 'guest',
  id: 'player1',
  name,
  avatar,
  color,
});

// Creates the BotPlayer.
// color is passed in from the screen via useTheme().
export const createBotPlayer = (color: string): BotPlayer => ({
  type: 'bot',
  id: 'player2',
  name: APP_CONFIG.botName,
  avatar: TTT_CONFIG.botAvatar,
  color,
  difficulty: TTT_CONFIG.defaultBotDifficulty,
});

// Creates the full initial GameState when the game starts.
// Called once in game.hook.ts inside useState().
export const createInitialGameState = (
  player1: Player,
  player2: Player,
): GameState => ({
  board: createInitialBoard(),
  currentPlayer: player1,    // Player 1 always goes first.
  winner: null,              // No winner yet.
  winType: null,             // No win type yet.
  usedAnswers: [],           // No answers used yet — empty list.
  cellCounts: {
    player1: 0,              // Player 1 has 0 cells at the start.
    player2: 0,              // Player 2 has 0 cells at the start.
  },
  isGameOver: false,
});

// Creates the initial TurnState — nothing is happening right now.
// Called at the start of the game and after every turn ends.
export const createInitialTurnState = (): TurnState => ({
  selectedCell: null,
  isModalVisible: false,
  currentQuestion: null,
  isWrongAnswer: false,
  isAlreadyUsed: false,   // No already-used error at the start.
});

// ── QUESTION LOGIC ──────────────────────────────────────────

// Returns the question for a specific cell on the board.
// Called in game.hook.ts when a player taps a cell.
export const getQuestion = (row: number, col: number): CellQuestion | null => {
  const rowId = ROW_HEADERS[row]?.id;
  const colId = COL_HEADERS[col]?.id;
  return QUESTIONS.find(
    (q) => q.rowHeader.id === rowId && q.colHeader.id === colId
  ) ?? null;
};

// ── ANSWER VALIDATION ───────────────────────────────────────

// Checks the player's answer and returns one of three results:
// 'correct'      = answer matches an accepted answer and has not been used before.
// 'wrong'        = answer does not match any accepted answer.
// 'already-used' = answer is correct BUT was already used on another cell.
//
// The 'already-used' case is treated differently from 'wrong':
// - 'wrong' triggers a shake animation and switches the turn.
// - 'already-used' shows a specific message and keeps the modal open
//   so the player can try a different answer without losing their turn.
//
// Angular equivalent: a validateAnswer() method in GameService
// that returns an AnswerResultEnum.
export const validateAnswer = (
  userAnswer: string,
  acceptedAnswers: string[],
  usedAnswerOnCell: string | null,  // The answer already used on THIS specific cell.
  globalUsedAnswers: string[],       // All answers used anywhere on the board.
): AnswerResult => {
  // Clean the input — trim whitespace and convert to lowercase.
  const cleaned = userAnswer.trim().toLowerCase();

  // Reject empty answers immediately.
  if (cleaned.length === 0) return 'wrong';

  // Check if this answer matches any accepted answer using fuzzy matching.
  const isCorrectAnswer = acceptedAnswers.some((answer) => {
    const cleanedAnswer = answer.trim().toLowerCase();
    return (
      cleaned === cleanedAnswer ||
      cleanedAnswer.includes(cleaned) ||
      cleaned.includes(cleanedAnswer) ||
      getLevenshteinDistance(cleaned, cleanedAnswer) <= 2
    );
  });

  // If the answer does not match any accepted answer — it is simply wrong.
  if (!isCorrectAnswer) return 'wrong';

  // The answer IS correct — now check if it has been used before.

  // Check 1: Was this exact answer used to claim THIS cell already?
  // Relevant when Steal Cells is enabled — the new answer must be different.
  if (usedAnswerOnCell && cleaned === usedAnswerOnCell.toLowerCase()) {
    return 'already-used';
  }

 // Check 2: Was this answer used on ANY OTHER cell on the board?
// We check in both directions:
// Direction A: does the cleaned answer match or contain a used answer?
//   e.g. user types 'marc bosnich', used answer is 'marc bosnich' → blocked
//   e.g. user types 'marc bosnich', used answer is 'bosnich' → blocked
// Direction B: does a used answer contain the cleaned answer?
//   e.g. user types 'bosnich', used answer is 'marc bosnich' → blocked
//   e.g. user types 'marc', used answer is 'marc bosnich' → blocked
// We also use fuzzy matching (distance <= 2) to catch typos of used answers.
// This means once 'marc bosnich' is used, no variation of that name passes.
const isGloballyUsed = globalUsedAnswers.some((used) => {
  const cleanedUsed = used.toLowerCase();
  return (
    // Exact match — 'marc bosnich' === 'marc bosnich'.
    cleaned === cleanedUsed ||
    // User typed a substring of a used answer — 'bosnich' inside 'marc bosnich'.
    cleanedUsed.includes(cleaned) ||
    // User typed a superset of a used answer — 'marc bosnich' contains 'bosnich'.
    cleaned.includes(cleanedUsed) ||
    // Fuzzy match — handles typos of the used answer.
    getLevenshteinDistance(cleaned, cleanedUsed) <= 2
  );
});

  if (isGloballyUsed) return 'already-used';

  // Answer is correct and has never been used before — accept it.
  return 'correct';
};

// Calculates the Levenshtein distance between two strings.
// Allows up to 2 typos in an answer (e.g. 'nasr' or 'nasry' still matches 'nasri').
// Called only inside validateAnswer() — not used anywhere else.
const getLevenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1,
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

// ── GAME STATE LOGIC ────────────────────────────────────────

// Returns a new board with one cell claimed. Never mutates the original.
// Called after a 'correct' answer result in game.hook.ts.
export const claimCell = (
  board: CellState[][],
  row: number,
  col: number,
  player: Player,
  answer: string,
): CellState[][] => {
  // Create a completely new board — React requires immutable state updates.
  const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
  newBoard[row][col] = {
    claimedBy: player,
    usedAnswer: answer.trim().toLowerCase(),
  };
  return newBoard;
};

// Checks whether a player has won by getting 3 in a row.
// Called after every correct answer in game.hook.ts.
// Returns true if the player owns all 3 cells in any of the 8 winning lines.
export const checkWinner = (board: CellState[][], player: Player): boolean => {
  const winningLines = [
    [[0,0],[0,1],[0,2]], // top row
    [[1,0],[1,1],[1,2]], // middle row
    [[2,0],[2,1],[2,2]], // bottom row
    [[0,0],[1,0],[2,0]], // left column
    [[0,1],[1,1],[2,1]], // middle column
    [[0,2],[1,2],[2,2]], // right column
    [[0,0],[1,1],[2,2]], // diagonal top-left → bottom-right
    [[0,2],[1,1],[2,0]], // diagonal top-right → bottom-left
  ];
  return winningLines.some((line) =>
    line.every(([r, c]) => board[r][c].claimedBy?.id === player.id)
  );
};

// Checks if all 9 cells have been claimed.
// Called after every correct answer when checkWinner returns false.
// If the board is full and nobody won a line, we count cells instead.
export const checkBoardFull = (board: CellState[][]): boolean => {
  return board.every((row) =>
    row.every((cell) => cell.claimedBy !== null)
  );
};

// Counts how many cells a specific player owns on the board.
// Called after every correct answer to update the live score display.
// Also called by getCellCountWinner when the board is full.
export const countCells = (board: CellState[][], player: Player): number => {
  let count = 0;
  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.claimedBy?.id === player.id) count++;
    });
  });
  return count;
};

// Determines the winner by cell count when the board is full with no line winner.
// With 9 cells split between 2 players the count is always uneven —
// a draw is mathematically impossible so this always returns a winner.
export const getCellCountWinner = (
  board: CellState[][],
  player1: Player,
  player2: Player,
): Player => {
  const p1Count = countCells(board, player1);
  const p2Count = countCells(board, player2);
  // Whoever has more cells wins.
  return p1Count > p2Count ? player1 : player2;
};

// Returns whichever player is NOT the current player.
// Called after every completed turn to switch to the other player.
export const switchPlayer = (
  currentPlayer: Player,
  player1: Player,
  player2: Player,
): Player => {
  return currentPlayer.id === player1.id ? player2 : player1;
};

// ── BOT LOGIC ───────────────────────────────────────────────

// Returns the cell the bot will play on its turn.
// Easy difficulty: picks a random empty cell.
export const getBotMove = (
  board: CellState[][],
): { row: number; col: number } | null => {
  const emptyCells: { row: number; col: number }[] = [];
  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell.claimedBy === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  if (emptyCells.length === 0) return null;
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

// Returns the answer the bot will submit for a given cell.
// Easy difficulty: always uses the first accepted answer.
// Checks the global used answers list to avoid already-used answers.
export const getBotAnswer = (
  row: number,
  col: number,
  globalUsedAnswers: string[], // Bot respects the global used answers rule too.
): string | null => {
  const question = getQuestion(row, col);
  if (!question) return null;

  // Find the first accepted answer that has NOT been used yet.
  // Bot is smart enough not to reuse an answer from another cell.
  const availableAnswer = question.acceptedAnswers.find(
    (answer) => !globalUsedAnswers.includes(answer.trim().toLowerCase())
  );

  // Return the first available answer, or null if all answers are used.
  return availableAnswer ?? null;
};