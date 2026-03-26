// 
// ============================================================
// player.types.ts
// Defines the shape of every player type in the app.
// Used in every game, screen, and hook that deals with players.
// Angular equivalent: player.model.ts in a models folder.
// ============================================================

// GuestPlayer — playing without an account. Phase 1 only.
export type GuestPlayer = {
  type: 'guest';
  id: 'player1' | 'player2';
  name: string;
  avatar: string;
  color: string;
};

// BotPlayer — the CPU opponent. Phase 1.
export type BotPlayer = {
  type: 'bot';
  id: 'player2';
  name: string;
  avatar: string;
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
};

// UserPlayer — logged in user. Phase 2+.
export type UserPlayer = {
  type: 'user';
  id: 'player1' | 'player2';
  name: string;
  avatar: string;
  color: string;
  userId: string;
  email: string;
};

// Player is the union — can be any of the three types above.
// Angular equivalent: a discriminated union in a model file.
export type Player = GuestPlayer | BotPlayer | UserPlayer;

// GameMode — vs-bot is Phase 1, vs-friend is Phase 2+.
export type GameMode = 'vs-bot' | 'vs-friend';