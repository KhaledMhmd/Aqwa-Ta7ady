// ============================================================
// language.context.tsx
// Provides translations and RTL direction to every component.
// Works exactly like theme.context.tsx — provide once at root,
// consume anywhere via useLanguage() hook.
// Angular equivalent: a TranslationService with @Injectable()
// that loads the active language and exposes a translate() method.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
// I18nManager controls the layout direction of the entire app.
// I18nManager.forceRTL(true) flips all layouts to right-to-left.
// This must be set before the app renders — takes effect after restart.

import * as Updates from 'expo-updates';
// expo-updates allows reloading the app programmatically.
// Used to apply RTL changes — RTL only takes full effect after restart.

import { ar } from './ar';
import { en } from './en';
import { Translations } from './i18n.types';

// Language type — only two options in Phase 1.
export type Language = 'ar' | 'en';

// Storage key for saving language preference.
const LANGUAGE_STORAGE_KEY = '@aqwata7ady/language';

// LanguageContextType — everything the context provides.
type LanguageContextType = {
  // The active language code — 'ar' or 'en'.
  language: Language;

  // The active translations object — use t.home.play etc.
  // Angular equivalent: the translate pipe or TranslateService.instant().
  t: Translations;

  // True when language is Arabic — used to apply RTL styles.
  isRTL: boolean;

  // Call this to switch language — saves preference and restarts app.
  setLanguage: (lang: Language) => Promise<void>;
};

// Create the context.
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// LanguageProvider wraps the entire app alongside ThemeProvider.
export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {

  // Default language is Arabic — app launches in Arabic.
  const [language, setLanguageState] = useState<Language>('ar');

  // Load saved language on mount — before anything renders.
  useEffect(() => {
    loadLanguage();
  }, []);

  // Apply RTL direction when language state changes.
  // This runs every time language changes in memory,
  // but the actual layout flip only applies after a restart.
  useEffect(() => {
    const isArabic = language === 'ar';
    // forceRTL tells React Native to flip all layouts.
    // allowRTL must also be true for forceRTL to work.
    I18nManager.allowRTL(isArabic);
    I18nManager.forceRTL(isArabic);
  }, [language]);

  // Reads saved language preference from AsyncStorage.
  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        setLanguageState(saved);
      }
      // If nothing saved, keep default 'ar'.
    } catch (error) {
      console.error('Failed to load language:', error);
    }
  };

  // setLanguage saves the preference, updates RTL, and restarts the app.
  // The restart is required because RTL layout changes only take full
  // effect after React Native reinitialises the layout engine.
  // Angular equivalent: changing the document dir attribute and reloading.
  const setLanguage = async (lang: Language) => {
  try {
    // Save the new language preference to AsyncStorage.
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);

    // Update in-memory state immediately for visual feedback.
    setLanguageState(lang);

    // Apply RTL direction for the new language.
    const isArabic = lang === 'ar';
    I18nManager.allowRTL(isArabic);
    I18nManager.forceRTL(isArabic);

    // Try to reload the app using expo-updates.
    // This works in production builds only.
    // In development with Expo Go it throws an error which we catch below.
    try {
      await Updates.reloadAsync();
    } catch {
      // Development mode — expo-updates reload is not available.
      // The language switch still works visually in the current session.
      // RTL layout flip will apply properly in a production build.
      // No action needed here — the state update above already
      // switched the translations throughout the app.
      console.log('Dev mode: language switched without full restart. RTL will apply in production build.');
    }

  } catch (error) {
    console.error('Failed to set language:', error);
  }
};

  // Active translations — ar or en based on current language.
  const t = language === 'ar' ? ar : en;

  // isRTL is true when Arabic is active.
  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    t,
    isRTL,
    setLanguage,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// useLanguage — hook to access translations in any component.
// Angular equivalent: injecting TranslationService via constructor.
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};