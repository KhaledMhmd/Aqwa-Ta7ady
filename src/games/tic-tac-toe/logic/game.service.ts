// ============================================================
// game.service.ts
// Contains ALL pure logic functions for tic-tac-toe.
// "Pure" means: takes inputs → returns output → no side effects.
// These functions never touch the UI, never update state,
// never call AsyncStorage. They just calculate and return.
// Angular equivalent: a class with @Injectable() that gets
// injected into components via the constructor.
// In React we just import and call these functions directly —
// no injection system needed.
// ============================================================

import { GameState, CellState, TurnState, CellQuestion } from '../types/game.types';
import { Player, BotPlayer } from '../../../core/types/player.types';
import { QUESTIONS, ROW_HEADERS, COL_HEADERS } from '../data/questions.data';
import { TTT_CONFIG } from '../config/game.config';
import { APP_CONFIG } from '../../../core/config/app.config';
import { THEME } from '../../../core/theme/theme.config';

// ============================================================
// INITIAL STATE CREATORS
// Functions that build fresh starting state objects.
// Called once when the game starts and again on reset.
// ============================================================

// Creates one empty cell — used when building the initial board.
// Returns a NEW object every time so cells never share memory.
// Angular equivalent: a factory method that returns a new CellModel().
export const createEmptyCell = (): CellState => ({
  claimedBy: null,    // Nobody owns this cell yet.
  usedAnswer: null,   // No answer has been used for this cell yet.
});

// Creates a fresh 3x3 board where every cell is empty.
// Called in createInitialGameState() and in resetGame() in the hook.
// Array(3) creates an array with 3 empty slots.
// .fill(null) fills those slots so .map() can iterate over them.
// .map(() => ...) replaces each slot with a fresh row of cells.
// Angular equivalent: a method that returns a 2D array of new CellModel objects.
export const createInitialBoard = (): CellState[][] => {
  return Array(TTT_CONFIG.gridSize)
    .fill(null)
    .map(() =>
      Array(TTT_CONFIG.gridSize)
        .fill(null)
        // createEmptyCell() is called for EACH cell individually
        // so every cell is a separate object in memory.
        // Without this, all cells in a row would point to the same
        // object and changing one would change all of them.
        .map(() => createEmptyCell())
    );
};

// Creates the GuestPlayer object for player 1.
// Called from the player setup screen when the game starts.
// Angular equivalent: a factory method in a PlayerService.
export const createGuestPlayer1 = (
  name: string,   // The name the player typed on the setup screen.
  avatar: string  // The emoji the player chose on the setup screen.
): import('../../../core/types/player.types').GuestPlayer => ({
  type: 'guest',
  id: 'player1',
  name,
  avatar,
  // Player 1 always uses the player1 colour from the theme.
  color: THEME.colors.player1,
});

// Creates the BotPlayer object for the CPU opponent.
// Called from the game screen when vs-bot mode is selected.
// Angular equivalent: a factory method in a BotService.
export const createBotPlayer = (): BotPlayer => ({
  type: 'bot',
  id: 'player2',
  // Bot name comes from APP_CONFIG so changing it there
  // automatically updates it everywhere in the app.
  name: APP_CONFIG.botName,
  avatar: TTT_CONFIG.botAvatar,
  color: THEME.colors.botColor,
  difficulty: TTT_CONFIG.defaultBotDifficulty,
});

// Creates the full initial GameState when the game starts.
// Called once in game.hook.ts inside useState().
// Angular equivalent: ngOnInit() setting up initial component state.
export const createInitialGameState = (
  player1: Player,  // The human player — always goes first.
  player2: Player   // The bot or second player.
): GameState => ({
  board: createInitialBoard(),  // Fresh 3x3 board with all empty cells.
  currentPlayer: player1,       // Player 1 always takes the first turn.
  winner: null,                 // No winner yet.
  isDraw: false,                // Not a draw yet.
  isGameOver: false,            // Game has not ended yet.
});

// Creates the initial TurnState — "nothing is happening right now."
// Called at the start of the game and after EVERY turn ends.
// Resetting to this closes the modal and clears the selected cell.
// Angular equivalent: a method that resets turn-related component properties.
export const createInitialTurnState = (): TurnState => ({
  selectedCell: null,     // No cell is tapped yet.
  isModalVisible: false,  // Question modal is hidden.
  currentQuestion: null,  // No question is loaded.
  isWrongAnswer: false,   // No wrong answer animation playing.
});

// ============================================================
// QUESTION LOGIC
// Functions that find and return questions for cells.
// ============================================================

// Returns the question for a specific cell on the board.
// Called in game.hook.ts when a player taps a cell.
// Looks through QUESTIONS to find the one where rowHeader matches
// the row index and colHeader matches the column index.
// Returns null if no question found — should never happen with correct data.
// Angular equivalent: a method in a QuestionService that queries the data.
export const getQuestion = (
  row: number,  // The row index of the tapped cell (0, 1, or 2).
  col: number   // The column index of the tapped cell (0, 1, or 2).
): CellQuestion | null => {
  // Get the id of the row header at this index.
  // Example: row 0 → 'arsenal', row 1 → 'aston_villa'
  const rowId = ROW_HEADERS[row]?.id;

  // Get the id of the column header at this index.
  // Example: col 1 → 'chelsea', col 2 → 'man_utd'
  const colId = COL_HEADERS[col]?.id;

  // Find the question where BOTH headers match.
  // .find() returns the first match or undefined if none found.
  const question = QUESTIONS.find(
    (q) => q.rowHeader.id === rowId && q.colHeader.id === colId
  );

  // Return the question or null if nothing matched.
  return question ?? null;
};

// ============================================================
// ANSWER VALIDATION
// Functions that check whether a player's answer is correct.
// ============================================================

// Checks whether the user's typed answer matches any accepted answer.
// Called in game.hook.ts inside onAnswerSubmit().
// Returns true if correct, false if not.
// Angular equivalent: a validateAnswer() method in a QuestionService.
export const validateAnswer = (
  userAnswer: string,        // The raw string the player typed.
  acceptedAnswers: string[], // The valid answers from questions.data.ts.
  usedAnswer: string | null  // The answer already used to claim this cell.
                             // Only relevant when Steal Cells is enabled.
): boolean => {
  // Clean the input: trim whitespace and convert to lowercase.
  // This means 'Nasri ', 'NASRI', 'nasri' all become 'nasri'.
  const cleaned = userAnswer.trim().toLowerCase();

  // Reject empty answers immediately.
  if (cleaned.length === 0) return false;

  // If this cell was already claimed, the new answer must be
  // DIFFERENT from the answer that was used to claim it.
  // This enforces the Steal Cells rule — you cannot reuse the same answer.
  if (usedAnswer && cleaned === usedAnswer.toLowerCase()) return false;

  // Check if the cleaned answer matches ANY accepted answer.
  // .some() returns true as soon as ONE match is found.
  return acceptedAnswers.some((answer) => {
    const cleanedAnswer = answer.trim().toLowerCase();

    return (
      // Exact match — 'nasri' === 'nasri'.
      cleaned === cleanedAnswer ||

      // Partial match — user typed 'nasri', accepted is 'samir nasri'.
      // Handles first-name-only or last-name-only answers.
      cleanedAnswer.includes(cleaned) ||

      // Reverse partial — user typed 'samir nasri', accepted is 'nasri'.
      cleaned.includes(cleanedAnswer) ||

      // Fuzzy match — allows up to 2 character differences.
      // Handles typos: 'nasr', 'nasry', 'narsri' still match 'nasri'.
      getLevenshteinDistance(cleaned, cleanedAnswer) <= 2
    );
  });
};

// Calculates the edit distance between two strings.
// The edit distance is the number of single-character changes
// (insert, delete, substitute) needed to turn one string into another.
// Example: 'nasri' vs 'nasry' = 1 substitution → distance 1 → accepted.
// Example: 'messi' vs 'nasri' = 4 changes → distance 4 → rejected.
// Called only inside validateAnswer() — not used anywhere else.
// Angular equivalent: a private utility method in a service.
const getLevenshteinDistance = (a: string, b: string): number => {
  // Build a 2D matrix to store intermediate distances.
  const matrix: number[][] = [];

  // Fill the first column — distance from '' to b[0..i].
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // Fill the first row — distance from '' to a[0..j].
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the rest of the matrix by comparing characters.
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        // Characters match — carry forward the previous distance unchanged.
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        // Characters differ — take the minimum of the 3 possible edits.
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  // Bottom-right cell = final distance between the two full strings.
  return matrix[b.length][a.length];
};

// ============================================================
// GAME STATE LOGIC
// Functions that calculate new game states after actions.
// All return NEW objects — never mutate the inputs.
// React requires immutable state — you never modify state directly,
// always return a fresh copy with the changes applied.
// Angular equivalent: methods that return new state objects
// rather than mutating this.gameState directly.
// ============================================================

// Returns a new board with one specific cell claimed by a player.
// Called in game.hook.ts after a correct answer is submitted.
// NEVER mutates the original board — always returns a new one.
export const claimCell = (
  board: CellState[][], // The current board state.
  row: number,          // Row of the cell to claim.
  col: number,          // Column of the cell to claim.
  player: Player,       // The player claiming the cell.
  answer: string        // The answer used — stored to enforce Steal Cells rule.
): CellState[][] => {
  // Create a completely new board by copying every row and every cell.
  // map() on the outer array copies rows.
  // map() on the inner array copies each cell with spread { ...cell }.
  // This guarantees the original board is completely untouched.
  const newBoard = board.map((r) =>
    r.map((cell) => ({ ...cell }))
  );

  // Now update ONLY the specific cell that was just claimed.
  newBoard[row][col] = {
    claimedBy: player,                        // Mark as owned by this player.
    usedAnswer: answer.trim().toLowerCase(),   // Store the answer used.
  };

  return newBoard;
};

// Checks whether a player has won the game.
// Called after every correct answer in game.hook.ts.
// Returns true if the player owns all 3 cells in any winning line.
// Angular equivalent: a checkWinner() method in a GameService.
export const checkWinner = (
  board: CellState[][], // The board AFTER the latest cell was claimed.
  player: Player        // The player to check for a win.
): boolean => {
  // All 8 possible winning lines in a 3x3 grid.
  // Each line is 3 [row, col] pairs.
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

  // .some() returns true as soon as ONE winning line is found.
  return winningLines.some((line) =>
    // .every() returns true only if ALL 3 cells in the line
    // are owned by this specific player.
    line.every(
      ([row, col]) => board[row][col].claimedBy?.id === player.id
    )
  );
};

// Checks whether the game is a draw.
// Called after every correct answer, only if checkWinner returned false.
// Returns true if every cell on the board is claimed.
// Angular equivalent: a checkDraw() method in a GameService.
export const checkDraw = (board: CellState[][]): boolean => {
  // .every() on the outer array checks every row.
  // .every() on the inner array checks every cell in that row.
  // Returns true only if ALL cells have a non-null claimedBy.
  return board.every((row) =>
    row.every((cell) => cell.claimedBy !== null)
  );
};

// Returns whichever player is NOT the current player.
// Called after every turn (correct or wrong answer) to switch turns.
// Angular equivalent: a switchPlayer() method in a GameService.
export const switchPlayer = (
  currentPlayer: Player, // The player whose turn just ended.
  player1: Player,       // Player 1 reference.
  player2: Player        // Player 2 / Bot reference.
): Player => {
  // If currentPlayer is player1, return player2. Otherwise return player1.
  return currentPlayer.id === player1.id ? player2 : player1;
};

// ============================================================
// BOT LOGIC
// Functions that control what the Bot does on its turn.
// Phase 1: easy difficulty only — bot picks a random empty cell
// and always submits the first accepted answer for that cell.
// Phase 2+: medium/hard difficulty with strategic cell selection.
// ============================================================

// Returns the cell the bot will play on its turn.
// Called in game.hook.ts after the turn switches to the bot.
// Angular equivalent: a getBotMove() method in a BotService.
export const getBotMove = (
  board: CellState[][] // The current board — bot needs to see empty cells.
): { row: number; col: number } | null => {
  // Find all empty cells on the board.
  const emptyCells: { row: number; col: number }[] = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      // A cell is empty if nobody has claimed it yet.
      if (cell.claimedBy === null) {
        emptyCells.push({ row: rowIndex, col: colIndex });
      }
    });
  });

  // If no empty cells exist, return null — game should already be over.
  if (emptyCells.length === 0) return null;

  // Easy difficulty: pick a random empty cell.
  // Math.random() returns a number between 0 and 1.
  // Multiplying by emptyCells.length and flooring gives a random index.
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
};

// Returns the answer the bot will submit for a given cell.
// Called in game.hook.ts right after getBotMove() returns a cell.
// Easy difficulty: always uses the first accepted answer for that cell.
// Angular equivalent: a getBotAnswer() method in a BotService.
export const getBotAnswer = (
  row: number, // The row of the cell the bot chose.
  col: number  // The column of the cell the bot chose.
): string | null => {
  // Get the question for the cell the bot chose.
  const question = getQuestion(row, col);

  // If no question found, return null — bot cannot answer.
  if (!question) return null;

  // Easy difficulty: always return the first accepted answer.
  // This means the bot always answers correctly on easy mode.
  // Phase 2+: medium/hard will have a chance of wrong answers.
  return question.acceptedAnswers[0];
};