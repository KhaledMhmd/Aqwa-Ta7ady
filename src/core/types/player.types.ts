// ============================================================
// player.types.ts
// Defines the shape of a player throughout the entire app.
// Used in every game, every screen, and every hook that
// needs to know who is playing.
// Angular equivalent: player.model.ts in a models folder.
// ============================================================

// GuestPlayer represents someone who is playing without an account.
// Phase 1 only uses this type — UserPlayer comes in Phase 2.
export type GuestPlayer = {
  // 'guest' identifies this as a guest player throughout the app.
  // Used to check if a player is logged in or not.
  type: 'guest';

  // The player's slot in the game — player1 or player2.
  // Can only ever be one of these two values — TypeScript enforces this.
  id: 'player1' | 'player2';

  // The name the player typed when setting up the game.
  name: string;

  // The emoji the player chose to represent them on the board.
  // Example: '⚽', '🦁', '🔥'
  avatar: string;

  // The colour used to highlight this player's claimed cells.
  // Comes from THEME.colors.player1 or THEME.colors.player2.
  color: string;
};

// BotPlayer represents the CPU opponent.
// Used in vs Bot game mode — Phase 1.
export type BotPlayer = {
  // 'bot' identifies this as the CPU opponent.
  type: 'bot';

  // Bot always occupies the player2 slot.
  id: 'player2';

  // The bot's display name — comes from APP_CONFIG.botName.
  name: string;

  // The bot's avatar emoji.
  avatar: string;

  // The colour used for the bot's claimed cells.
  // Comes from THEME.colors.botColor.
  color: string;

  // The difficulty level of the bot.
  // 'easy' = random moves, 'medium' = basic strategy (Phase 1 = easy only).
  difficulty: 'easy' | 'medium' | 'hard';
};

// UserPlayer represents a logged-in user — Phase 2+.
// Defined here now so the rest of the codebase knows it is coming
// and can be typed correctly from day one.
// Nothing in Phase 1 creates a UserPlayer — it is just the type definition.
export type UserPlayer = {
  type: 'user';
  id: 'player1' | 'player2';
  name: string;
  avatar: string;
  color: string;
  userId: string;   // Unique ID from the backend database — Phase 2+
  email: string;    // The user's email address — Phase 2+
};

// Player is the union type used everywhere in the app.
// A Player can be ANY of the three types above.
// When you see Player as a type, it means "could be guest, bot, or user."
// Angular equivalent: a discriminated union type in a model file.
export type Player = GuestPlayer | BotPlayer | UserPlayer;

// GameMode defines the two modes available.
// 'vs-bot' is Phase 1. 'vs-friend' is Phase 2+.
export type GameMode = 'vs-bot' | 'vs-friend';