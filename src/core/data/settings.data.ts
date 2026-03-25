// ============================================================
// settings.data.ts
// The default values for every setting in the app.
// These are used on first launch or if saved settings fail to load.
// Angular equivalent: a constants file or default config object.
// ============================================================

import { AppSettings } from '../types/settings.types';

// DEFAULT_SETTINGS is the fallback for all settings.
// Every setting starts as its safest, most standard value.
export const DEFAULT_SETTINGS: AppSettings = {
  gameRules: {
    stealCells: false,      // Standard rules — no stealing by default.
    timeLimitEnabled: false, // No time limit by default.
  },
};

// SETTINGS_STORAGE_KEY is the key used to save/load settings
// in AsyncStorage — React Native's equivalent of localStorage.
// Using a namespaced key (app name prefix) avoids conflicts
// if other libraries also use AsyncStorage.
export const SETTINGS_STORAGE_KEY = '@aqwata7ady/settings';