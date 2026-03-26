// ============================================================
// settings.types.ts
// Defines the shape of ALL app settings.
// Adding a new setting = one line here + one line in settings.data.ts.
// Angular equivalent: a settings.model.ts interface file.
// ============================================================

// ThemeMode — dark or light.
export type ThemeMode = 'dark' | 'light';

// GameRulesSettings — toggles that change how games play.
export type GameRulesSettings = {
  stealCells: boolean;
  timeLimitEnabled: boolean;
};

// AppearanceSettings — visual and language preferences.
export type AppearanceSettings = {
  // Active theme — dark by default in Phase 1.
  theme: ThemeMode;
  // Active language — English only in Phase 1. Arabic in later phase.
  language: 'en' | 'ar';
};

// AppSettings — root settings object.
export type AppSettings = {
  gameRules: GameRulesSettings;
  appearance: AppearanceSettings;
};