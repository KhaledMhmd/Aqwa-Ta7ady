// ============================================================
// theme.config.ts
// Contains DARK_THEME and LIGHT_THEME colour palettes.
// THEME is the combined object every component imports —
// it has colors, spacing, fontSizes, fontWeights, borderRadius.
// Components use useTheme() to get dynamic colors.
// They use THEME.spacing, THEME.fontSizes etc for static values
// that never change between themes.
// Angular equivalent: SCSS variables file with theme maps.
// ============================================================

// ColorPalette defines the required shape of every theme.
// Both DARK_THEME and LIGHT_THEME must satisfy this type.
type ColorPalette = {
  primary: string;
  primaryDark: string;
  secondary: string;
  background: string;
  surface: string;
  surfaceLight: string;
  textPrimary: string;
  textSecondary: string;
  textDark: string;
  player1: string;
  player2: string;
  botColor: string;
  success: string;
  error: string;
  warning: string;
  disabled: string;
  border: string;
  borderLight: string;
  comingSoon: string;
    modalOverlay: string;  // Semi-transparent overlay behind modals.

};

// DARK_THEME — default Phase 1 theme.
// Update these hex values when Stitch dark design is shared.
export const DARK_THEME: ColorPalette = {
  primary: '#E63946',
  primaryDark: '#C1121F',
  secondary: '#1D3557',
  background: '#0D1B2A',
  surface: '#1B2838',
  surfaceLight: '#253545',
  textPrimary: '#FFFFFF',
  textSecondary: '#A8B2C1',
  textDark: '#0D1B2A',
  player1: '#E63946',
  player2: '#457B9D',
  botColor: '#2EC4B6',
  success: '#2EC4B6',
  error: '#E63946',
  warning: '#F4A261',
  disabled: '#3D4F61',
  border: '#253545',
  borderLight: '#3D4F61',
  comingSoon: 'rgba(0,0,0,0.6)',
  modalOverlay: 'rgba(0,0,0,0.7)', // Darker overlay for modals on dark bg.
};

// LIGHT_THEME — placeholder values.
// Update these hex values when Stitch light design is shared.
export const LIGHT_THEME: ColorPalette = {
  primary: '#E63946',
  primaryDark: '#C1121F',
  secondary: '#1D3557',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceLight: '#F1F3F5',
  textPrimary: '#0D1B2A',
  textSecondary: '#6C757D',
  textDark: '#0D1B2A',
  player1: '#E63946',
  player2: '#457B9D',
  botColor: '#2EC4B6',
  success: '#2EC4B6',
  error: '#E63946',
  warning: '#F4A261',
  disabled: '#CED4DA',
  border: '#DEE2E6',
  borderLight: '#E9ECEF',
  comingSoon: 'rgba(0,0,0,0.4)',
  modalOverlay: 'rgba(0,0,0,0.5)', // Slightly lighter overlay on light bg.
};

// THEME is the static object every component imports.
// colors is NOT included here — components get colors via useTheme().
// Only static values that never change between themes live here.
// Angular equivalent: static SCSS variables that do not change with theme.
export const THEME = {
  // Typography scale — same for both themes.
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 26,
    xxxl: 36,
  },

  // Font weights — same for both themes.
  fontWeights: {
    regular: '400' as const,
    bold: '700' as const,
  },

  // Spacing scale — same for both themes.
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius scale — same for both themes.
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },
} as const;