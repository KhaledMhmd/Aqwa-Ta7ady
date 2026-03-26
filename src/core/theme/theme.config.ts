// ============================================================
// theme.config.ts
// THE single source of truth for all visual design tokens.
// Contains DARK_THEME and LIGHT_THEME colour palettes.
// Both extracted from the Stitch design system:
// Primary: #2ECC71 (green)
// Secondary: #03B179 (teal green)
// Tertiary/Warning: #FFE500 (yellow)
// Neutral: #1A2421 (dark green-black)
// To update colours in the future — edit DARK_THEME or LIGHT_THEME only.
// Nothing else in the codebase needs to change.
// Angular equivalent: SCSS variables file with theme maps.
// ============================================================

// ColorPalette defines the required shape of every theme.
// Both DARK_THEME and LIGHT_THEME must satisfy this type.
// Adding a new colour = add it here first, then in both themes.
type ColorPalette = {
  // Brand colours
  primary: string;       // Main action colour — buttons, highlights, active states.
  primaryDark: string;   // Darker shade of primary — pressed button states.
  secondary: string;     // Secondary brand colour — secondary actions, accents.
  tertiary: string;      // Tertiary accent — warnings, special highlights.

  // Background colours
  background: string;    // Main screen background.
  surface: string;       // Card and container background — slightly different from bg.
  surfaceLight: string;  // Input fields, inactive cells — lighter than surface.

  // Text colours
  textPrimary: string;   // Main readable text.
  textSecondary: string; // Muted text — labels, hints, captions.
  textDark: string;      // Dark text — used on light/coloured backgrounds.
  textOnPrimary: string; // Text shown ON top of the primary colour background.

  // Game-specific colours
  player1: string;       // Player 1 cell colour.
  player2: string;       // Player 2 cell colour.
  botColor: string;      // Bot cell colour.

  // Status colours
  success: string;       // Correct answer, positive states.
  error: string;         // Wrong answer, destructive actions.
  warning: string;       // Caution states, time running low.
  disabled: string;      // Disabled buttons and inactive elements.

  // Border colours
  border: string;        // Default border — subtle separator.
  borderLight: string;   // Lighter border — very subtle separator.

  // Overlay colours
  modalOverlay: string;  // Semi-transparent overlay behind modals.
  comingSoon: string;    // Overlay for Coming Soon locked features.
};

// ── DARK THEME ───────────────────────────────────────────────
// Dark green-black backgrounds with bright green primary.
// Extracted from Image 1 of the Stitch design system.
export const DARK_THEME: ColorPalette = {
  // Brand
  primary: '#2ECC71',      // Bright green — main CTA buttons, active states.
  primaryDark: '#27AE60',  // Darker green — pressed state of primary buttons.
  secondary: '#03B179',    // Teal green — secondary buttons and accents.
  tertiary: '#FFE500',     // Yellow — warnings, special highlights, tertiary actions.

  // Backgrounds — based on Neutral #1A2421 and its dark variations.
  background: '#0F1A17',   // Darkest bg — main screen background.
  surface: '#1A2421',      // Card/container bg — the Neutral colour from design.
  surfaceLight: '#243028', // Input fields and inactive cells — slightly lighter than surface.

  // Text — light text on dark backgrounds.
  textPrimary: '#F0F4F2',  // Near-white — main readable text.
  textSecondary: '#7A9188',// Muted green-grey — captions, labels, hints.
  textDark: '#1A2421',     // Dark text — used on light/coloured backgrounds.
  textOnPrimary: '#0F1A17',// Dark text shown on top of the green primary button.

  // Game colours — using design palette.
  player1: '#2ECC71',      // Player 1 uses primary green.
  player2: '#03B179',      // Player 2 uses secondary teal.
  botColor: '#FFE500',     // Bot uses tertiary yellow — stands out clearly.

  // Status colours.
  success: '#2ECC71',      // Same as primary — green = correct answer.
  error: '#E74C3C',        // Red — wrong answer, destructive actions.
  warning: '#FFE500',      // Same as tertiary — yellow = caution/time low.
  disabled: '#2D3F38',     // Very dark muted green — disabled state.

  // Borders.
  border: '#243028',       // Subtle dark border — matches surfaceLight.
  borderLight: '#1E2B25',  // Very subtle border — barely visible separator.

  // Overlays.
  modalOverlay: 'rgba(0,0,0,0.75)',     // Dark overlay behind modals.
  comingSoon: 'rgba(15,26,23,0.85)',    // Dark green overlay for locked features.
};

// ── LIGHT THEME ──────────────────────────────────────────────
// Very light mint/grey-green backgrounds with dark green primary.
// Extracted from Image 2 of the Stitch design system.
export const LIGHT_THEME: ColorPalette = {
  // Brand — same green palette, used differently on light bg.
  primary: '#2ECC71',      // Bright green — CTA buttons.
  primaryDark: '#27AE60',  // Darker green — pressed state.
  secondary: '#03B179',    // Teal green — secondary actions.
  tertiary: '#FFE500',     // Yellow — warnings, highlights.

  // Backgrounds — very light mint green tones from Image 2.
  background: '#E8F0EC',   // Light mint — main screen background.
  surface: '#F0F5F2',      // Slightly lighter — card/container background.
  surfaceLight: '#FFFFFF', // White — input fields, active cells.

  // Text — dark text on light backgrounds.
  textPrimary: '#1A2421',  // Dark neutral — main readable text (Neutral from design).
  textSecondary: '#5A7268',// Medium green-grey — captions, labels, hints.
  textDark: '#1A2421',     // Same as textPrimary — used on coloured backgrounds.
  textOnPrimary: '#FFFFFF',// White text on top of the green primary button.

  // Game colours — same palette, works on light bg too.
  player1: '#27AE60',      // Slightly darker green so it reads on light bg.
  player2: '#03B179',      // Teal green — distinct from player 1.
  botColor: '#B8860B',     // Darker yellow/gold — yellow is too light on light bg.

  // Status colours.
  success: '#27AE60',      // Darker green for success on light bg.
  error: '#E74C3C',        // Red — same in both themes.
  warning: '#D4A800',      // Darker yellow — readable on light backgrounds.
  disabled: '#B0C4BA',     // Light muted green — disabled on light bg.

  // Borders.
  border: '#C8D8D0',       // Subtle light border.
  borderLight: '#DDE8E3',  // Very subtle border.

  // Overlays.
  modalOverlay: 'rgba(0,0,0,0.5)',      // Lighter overlay on light bg.
  comingSoon: 'rgba(232,240,236,0.9)',  // Light green overlay for locked features.
};

// ── THEME STATIC VALUES ──────────────────────────────────────
// These never change between themes.
// Components use THEME.spacing, THEME.fontSizes etc for layout.
// Components use useTheme().colors for dynamic colour values.
// Angular equivalent: static SCSS variables that never change.
export const THEME = {

  // Typography scale.
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 26,
    xxxl: 36,
  },

  // Font weights.
  fontWeights: {
    regular: '400' as const,
    bold: '700' as const,
  },

  // Spacing scale.
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius scale.
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 999,
  },

} as const;