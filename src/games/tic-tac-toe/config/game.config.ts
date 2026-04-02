// ── React Native ──────────────────────────────────────

// ============================================================
// game.config.ts
// Single source of truth for tic-tac-toe specific config.
// Change game name, grid size, bot settings here only.
// Angular equivalent: a game-specific constants file.
// ============================================================

export const TTT_CONFIG = {
  // Display name of this game — shown on game select and game screen.
  name: 'Grid Challenge',

  // Short description — shown on game select card.
  description: 'Name a player who played for both clubs',

  // Grid is always 3x3. Stored here so a 4x4 variant is one change.
  gridSize: 3,

  // Seconds per TURN (not per answer). Timer starts when the turn begins,
  // not when the player taps a cell. Covers both cell selection and answering.
  // Increased from 45 to 60 to account for the extra thinking time needed.
  // Only used when AppSettings.gameRules.timeLimitEnabled is true.
  turnTimeLimitSeconds: 10,

  // Bot difficulty for Phase 1.
  defaultBotDifficulty: 'easy' as const,

  // Bot avatar emoji.
  botAvatar: '🤖',

  // Default avatars a player can choose from on the auth screen.
  availableAvatars: ['⚽', '🦁', '🔥', '⚡', '🎯', '👑', '🐉', '🌟'],
} as const;