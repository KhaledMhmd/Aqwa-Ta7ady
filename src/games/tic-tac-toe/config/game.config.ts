// // ============================================================
// // game.config.ts
// // THE single source of truth for tic-tac-toe specific config.
// // Want to rename the game? Change it here only.
// // Want to change the grid size? Change it here only.
// // Angular equivalent: a game-specific environment/constants file.
// // ============================================================

// export const TTT_CONFIG = {

//   // The display name of this game — shown on the game select screen
//   // and the game screen header.
//   name: 'Grid Challenge',

//   // Short description shown on the game select screen card.
//   description: 'Name a player who played for both clubs',

//   // The grid is always 3x3 for tic-tac-toe.
//   // Stored here so if we ever want a 4x4 variant,
//   // it is one number change instead of hunting through components.
//   gridSize: 3,

//   // How many seconds a player has to answer when time limit is enabled.
//   // Only used when AppSettings.gameRules.timeLimitEnabled is true.
//   turnTimeLimitSeconds: 45,

//   // Bot difficulty for Phase 1.
//   // 'easy' means the bot picks a random empty cell and always
//   // submits the first accepted answer for that cell.
//   defaultBotDifficulty: 'easy' as const,

//   // The emoji shown as the bot's avatar on the board.
//   botAvatar: '🤖',

//   // The default avatars a player can choose from on the setup screen.
//   // Phase 1: players pick from this list.
//   // Phase 2+: players can upload a custom avatar.
//   availableAvatars: ['⚽', '🦁', '🔥', '⚡', '🎯', '👑', '🐉', '🌟'],

// } as const;
// ============================================================
// game.config.ts
// Single source of truth for tic-tac-toe specific config.
// Change game name, grid size, bot settings here only.
// Angular equivalent: a game-specific constants file.
// ============================================================

export const TTT_CONFIG = {
  name: 'Grid Challenge',
  description: 'Name a player who played for both clubs',
  gridSize: 3,
  turnTimeLimitSeconds: 45,
  defaultBotDifficulty: 'easy' as const,
  botAvatar: '🤖',
  availableAvatars: ['⚽', '🦁', '🔥', '⚡', '🎯', '👑', '🐉', '🌟'],
} as const;