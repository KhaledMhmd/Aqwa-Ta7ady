// ============================================================
// settings.hook.ts
// Manages reading, updating, and persisting all app settings.
// This is the ONLY place in the app that touches AsyncStorage
// for settings. Everything else calls this hook.
// Angular equivalent: a SettingsService with @Injectable()
// that uses localStorage to persist values and exposes
// BehaviorSubject observables for components to subscribe to.
// ============================================================

// useState — holds the current settings object in memory.
// When setSettings() is called with new values, React
// automatically re-renders any component using this hook.
// Angular equivalent: a class property bound to the template.

// useEffect — runs code when something happens.
// With an empty [] dependency array it runs exactly once
// when the component first appears on screen.
// Angular equivalent: ngOnInit().
import { useState, useEffect } from 'react';

// AsyncStorage is React Native's key-value storage system.
// It saves data to the device so it survives app restarts.
// Angular equivalent: localStorage in a web app.
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppSettings } from '../types/settings.types';
import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from '../data/settings.data';

// useSettings is the hook function.
// Call it inside any component that needs to read or change settings.
// Angular equivalent: injecting SettingsService via constructor(private settingsService: SettingsService)
export const useSettings = () => {

  // settings holds the live settings object in memory.
  // Starts with DEFAULT_SETTINGS and gets replaced with
  // the saved settings as soon as AsyncStorage loads them.
  // Angular equivalent: private settingsSubject = new BehaviorSubject<AppSettings>(DEFAULT_SETTINGS)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  // isLoading is true while AsyncStorage is fetching saved settings.
  // Use this to prevent the settings screen from flashing
  // default values before the real saved values appear.
  // Angular equivalent: a loading boolean property on the service.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect with [] runs once when this hook is first used —
  // immediately loads saved settings from AsyncStorage.
  // Angular equivalent: ngOnInit() { this.loadSettings(); }
  useEffect(() => {
    loadSettings();
  }, []);
  // The [] means "only run this effect once on mount."
  // If we put [settings] here instead, it would run every time
  // settings changed — causing an infinite loop.

  // loadSettings reads the saved settings string from AsyncStorage
  // and parses it back into an AppSettings object.
  // It is async because AsyncStorage operations are asynchronous —
  // they take time to read from device storage.
  // Angular equivalent: a private loadSettings() method called in ngOnInit()
  // that reads from localStorage and updates the BehaviorSubject.
  const loadSettings = async () => {
    try {
      // AsyncStorage.getItem() returns the saved string or null
      // if nothing has been saved yet (first time app opens).
      // Angular equivalent: localStorage.getItem(SETTINGS_STORAGE_KEY)
      const saved = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

      if (saved !== null) {
        // JSON.parse converts the saved string back into a JS object.
        // We saved it as a string because AsyncStorage only stores strings.
        // Angular equivalent: JSON.parse(localStorage.getItem(key))
        const parsed: AppSettings = JSON.parse(saved);

        // Merge saved settings with defaults using spread operator.
        // This protects against new settings added in app updates —
        // if the user has old saved settings without the new property,
        // the default value fills it in automatically.
        // Angular equivalent: { ...this.defaultSettings, ...parsed }
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
      // If saved is null (first launch), DEFAULT_SETTINGS stays as-is.

    } catch (error) {
      // If loading fails, silently fall back to defaults.
      // The user loses their saved settings but the app does not crash.
      console.error('Failed to load settings:', error);
    } finally {
      // Always stop the loading state whether it succeeded or failed.
      // Angular equivalent: this.isLoading = false in the finally block.
      setIsLoading(false);
    }
  };

  // saveSettings writes the full updated settings object to AsyncStorage.
  // Called internally every time a setting changes — never called directly
  // from a component. Components call updateGameRules() instead.
  // Angular equivalent: private saveSettings() called inside each update method.
  const saveSettings = async (newSettings: AppSettings) => {
    try {
      // JSON.stringify converts the object to a string for storage.
      // AsyncStorage can only store strings — not objects.
      // Angular equivalent: localStorage.setItem(key, JSON.stringify(value))
      await AsyncStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(newSettings)
      );
    } catch (error) {
      // Log but do not crash — the setting still applies in memory
      // for this session even if saving to storage failed.
      console.error('Failed to save settings:', error);
    }
  };

  // updateGameRules is called by the settings screen when
  // the player toggles a game rule on or off.
  // It takes a Partial type so you can update just ONE property
  // without passing the entire object.
  // Example: updateGameRules({ stealCells: true })
  // Angular equivalent: a public updateGameRules() method on SettingsService
  // that updates the BehaviorSubject and calls localStorage.setItem().
  const updateGameRules = async (
    // Partial<> means every property is optional —
    // you only pass the ones you want to change.
    updatedRules: Partial<AppSettings['gameRules']>
  ) => {
    // Build the new settings object without mutating the current one.
    // Spread keeps all existing values, then overwrites only what changed.
    // React requires immutable updates — never mutate state directly.
    // Angular equivalent: this.settings = { ...this.settings, gameRules: { ...this.settings.gameRules, ...updatedRules } }
    const newSettings: AppSettings = {
      ...settings,
      gameRules: {
        ...settings.gameRules,
        ...updatedRules,
      },
    };

    // Update in-memory state immediately so the UI responds instantly.
    // Angular equivalent: this.settingsSubject.next(newSettings)
    setSettings(newSettings);

    // Persist to AsyncStorage in the background.
    await saveSettings(newSettings);
  };

  // Return the values and functions that components need.
  // Angular equivalent: the public API of SettingsService —
  // the properties and methods other classes can access.
  return {
    // The current settings object — read values from here.
    // Example: settings.gameRules.stealCells
    settings,

    // True while AsyncStorage is loading — show a spinner if needed.
    isLoading,

    // Call this to toggle a game rule on or off.
    // Example: updateGameRules({ stealCells: true })
    updateGameRules,
  };
};