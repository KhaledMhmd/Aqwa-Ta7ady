// ============================================================
// settings.types.ts
// Defines the shape of ALL app settings.
// Adding a new setting = add one property here and one default
// value in settings.data.ts. Nothing else ever needs to change.
// Angular equivalent: a settings.model.ts interface file.
// ============================================================

// GameRulesSettings holds every toggle that changes how a game plays.
// Each property is a boolean — on or off.
export type GameRulesSettings = {

  // When true: a player can tap an already-claimed cell and steal
  // it by answering correctly with a different answer.
  // Default: false — standard rules apply.
  stealCells: boolean;

  // When true: each player has a time limit to answer per turn.
  // The time limit value lives in gameConfig, not here.
  // Default: false — no time limit.
  // Phase 2+ feature — defined here now for scalability.
  timeLimitEnabled: boolean;

};

// AppSettings is the root object that holds all setting sections.
// Every new category of settings gets its own section here.
// Example future sections: audioSettings, displaySettings, notificationSettings.
export type AppSettings = {

  // All game rule toggles.
  gameRules: GameRulesSettings;

};