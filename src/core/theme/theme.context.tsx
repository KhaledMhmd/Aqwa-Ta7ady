// ============================================================
// theme.context.tsx
// Provides the active theme colours to every component.
// React Context works like Angular's dependency injection —
// provide once at the root, consume anywhere below.
// Angular equivalent: ThemeService with @Injectable({providedIn:'root'})
// holding a BehaviorSubject<ColorPalette>.
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_THEME, LIGHT_THEME } from './theme.config';
import { ThemeMode } from '../types/settings.types';

// ThemeColors is the type of the active colour palette.
export type ThemeColors = typeof DARK_THEME;

// ThemeContextType — everything the context provides.
// Angular equivalent: the public interface of ThemeService.
type ThemeContextType = {
  colors: ThemeColors;       // Active colour palette — use this in components.
  themeMode: ThemeMode;      // Current mode — 'dark' or 'light'.
  toggleTheme: () => void;   // Call this to switch themes.
  isThemeLoading: boolean;   // True while loading saved theme from storage.
};

// Storage key for persisting theme preference.
const THEME_STORAGE_KEY = '@aqwata7ady/theme';

// Create the context — undefined default forces consumers to be inside ThemeProvider.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ThemeProvider wraps the entire app at the root level (index.ts).
// Angular equivalent: providing ThemeService in AppModule.
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  // Current theme mode — starts dark until saved preference loads.
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');

  // Prevents flash of wrong theme on app start.
  const [isThemeLoading, setIsThemeLoading] = useState<boolean>(true);

  // Load saved theme on mount.
  // Angular equivalent: ngOnInit() reading from localStorage.
  useEffect(() => {
    loadTheme();
  }, []);

  // Reads saved theme mode from AsyncStorage.
  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        setThemeMode(saved);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    } finally {
      setIsThemeLoading(false);
    }
  };

  // Saves theme mode to AsyncStorage.
  const saveTheme = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Flips the theme and saves the new preference.
  // Angular equivalent: toggleTheme() on ThemeService calling
  // this.themeSubject.next() and localStorage.setItem().
  const toggleTheme = () => {
    const newMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(newMode);
    saveTheme(newMode);
  };

  // Active colour palette based on current mode.
  const colors = themeMode === 'dark' ? DARK_THEME : LIGHT_THEME;

  const value: ThemeContextType = {
    colors,
    themeMode,
    toggleTheme,
    isThemeLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// useTheme — hook to access theme in any component.
// Angular equivalent: injecting ThemeService via constructor.
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
};