// ============================================================
// settings.data.ts
// Default values for every app setting.
// Used on first launch or if saved settings fail to load.
// Angular equivalent: a constants or default config file.
// ============================================================

import { AppSettings } from '../types/settings.types';

export const DEFAULT_SETTINGS: AppSettings = {
  gameRules: {
    stealCells: false,
    timeLimitEnabled: false,
  },
  appearance: {
    theme: 'dark',   // Dark mode on by default.
    language: 'en',  // English only in Phase 1.
  },
};

// Key used to save and load settings from AsyncStorage.
export const SETTINGS_STORAGE_KEY = '@aqwata7ady/settings';