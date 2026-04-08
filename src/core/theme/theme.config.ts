// ── React Native ──────────────────────────────────────

// ============================================================
// theme.config.ts
// THE single source of truth for all visual design tokens.
// Contains DARK_THEME and LIGHT_THEME colour palettes.
// Based on the "Neon Glistle" design system:
// Primary: #6C63FF (purple/violet)
// Secondary: #FF59D6 (hot pink)
// Tertiary: #2CCBFF (cyan/sky blue)
// Neutral: #F8F9FA (near-white)
// Fonts: Plus Jakarta Sans (headlines), Be Vietnam Pro (body/labels)
// To update colours — edit DARK_THEME or LIGHT_THEME only.
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
  border: string;
  borderLight: string;
  focusBorder: string;   // ADD THIS LINE

  // Overlay colours
  modalOverlay: string;  // Semi-transparent overlay behind modals.
  comingSoon: string;    // Overlay for Coming Soon locked features.
};

// ── DARK THEME ───────────────────────────────────────────────
// Deep dark backgrounds with neon purple/pink/cyan accents.
// Extracted from Image 1 of the Neon Glistle design system.
export const DARK_THEME: ColorPalette = {
  // Brand
  primary: '#6C63FF',      // Purple/violet — main CTA buttons, active states.
  primaryDark: '#5A52E0',  // Darker purple — pressed state of primary buttons.
  secondary: '#FF59D6',    // Hot pink — secondary buttons and accents.
  tertiary: '#2CCBFF',     // Cyan/sky blue — highlights, tertiary actions.

  // Backgrounds — deep dark tones from the dark theme image.
  background: '#0F0F1A',   // Deepest dark — main screen background.
  surface: '#1A1A2E',      // Card/container bg — slightly lighter than background.
  surfaceLight: '#252540',  // Input fields and inactive cells — lighter than surface.

  // Text — light text on dark backgrounds.
  textPrimary: '#F8F9FA',  // Near-white — the Neutral colour from design. Main readable text.
  textSecondary: '#8888A4', // Muted purple-grey — captions, labels, hints.
  textDark: '#0F0F1A',     // Dark text — used on light/coloured backgrounds.
  textOnPrimary: '#FFFFFF', // White text shown on top of the purple primary button.

  // Game colours — using neon palette for distinct player identification.
  player1: '#6C63FF',      // Player 1 uses primary purple.
  player2: '#2CCBFF',      // Player 2 uses tertiary cyan — clearly distinct from purple.
  botColor: '#FF59D6',     // Bot uses secondary pink — stands out clearly.

  // Status colours.
  success: '#2CCBFF',      // Cyan — correct answer, positive states.
  error: '#FF4757',        // Bright red — wrong answer, destructive actions.
  warning: '#FFB84D',      // Amber/orange — caution states, time running low.
  disabled: '#2A2A44',     // Very dark muted purple — disabled state.

// Borders.
  border: '#252540',
  borderLight: '#1E1E36',
  focusBorder: '#8B83FF',  // ADD THIS LINE — lighter purple glow for focus states.

  // Overlays.
  modalOverlay: 'rgba(0,0,0,0.75)',     // Dark overlay behind modals.
  comingSoon: 'rgba(15,15,26,0.85)',     // Dark overlay for locked features.
};

// ── LIGHT THEME ──────────────────────────────────────────────
// Light grey backgrounds with the same neon accents.
// Extracted from Image 2 of the Neon Glistle design system.
export const LIGHT_THEME: ColorPalette = {
  // Brand — same neon palette, used on light bg.
  primary: '#6C63FF',      // Purple — CTA buttons.
  primaryDark: '#5A52E0',  // Darker purple — pressed state.
  secondary: '#FF59D6',    // Hot pink — secondary actions.
  tertiary: '#2CCBFF',     // Cyan — highlights.

  // Backgrounds — light grey tones from the light theme image.
  background: '#E8E8EE',   // Light grey — main screen background.
  surface: '#F0F0F5',      // Slightly lighter — card/container background.
  surfaceLight: '#FFFFFF',  // White — input fields, active cells.

  // Text — dark text on light backgrounds.
  textPrimary: '#1A1A2E',  // Dark — main readable text.
  textSecondary: '#6B6B8A', // Medium purple-grey — captions, labels, hints.
  textDark: '#1A1A2E',     // Same as textPrimary — used on coloured backgrounds.
  textOnPrimary: '#FFFFFF', // White text on top of the purple primary button.

  // Game colours — same neon palette, works on light bg too.
  player1: '#5A52E0',      // Slightly darker purple so it reads on light bg.
  player2: '#1BA8D9',      // Slightly darker cyan — distinct from player 1.
  botColor: '#D94DB8',     // Slightly darker pink — readable on light backgrounds.

  // Status colours.
  success: '#1BA8D9',      // Darker cyan for success on light bg.
  error: '#E84050',        // Red — similar in both themes.
  warning: '#E6A040',      // Darker amber — readable on light backgrounds.
  disabled: '#C8C8D8',     // Light muted purple-grey — disabled on light bg.

// Borders.
  border: '#D0D0DE',
  borderLight: '#DCDCE8',
  focusBorder: '#6C63FF',  // ADD THIS LINE — primary purple, pops on light backgrounds.

  // Overlays.
  modalOverlay: 'rgba(0,0,0,0.5)',       // Lighter overlay on light bg.
  comingSoon: 'rgba(232,232,238,0.9)',    // Light overlay for locked features.
};

// ── React Native ──────────────────────────────────────

// ── FONT FAMILIES ────────────────────────────────────────────
// Loaded in index.tsx via useFonts().
// English uses Poppins, Arabic uses Cairo, accent titles use Bungee.
// Components call FONTS.get(language) to get the right font set.
// Angular equivalent: CSS variables for font-family set by [lang] attribute.

// FontSet defines the fonts available for one language.
// Each component picks the right key: headline, body, or accent.
type FontSet = {
  headlineRegular: string;  // Headlines regular weight (h1, h2, h3).
  headlineBold: string;     // Headlines bold weight.
  bodyRegular: string;      // Body text, captions, labels.
  bodyBold: string;         // Bold body text, button labels.
  accent: string;           // Accent font — game titles, app name only.
};

// English font set — Poppins for everything, Bungee for accents.
const EN_FONTS: FontSet = {
  headlineRegular: 'Poppins-Regular',   // Poppins Regular 400.
  headlineBold: 'Poppins-Bold',         // Poppins Bold 700.
  bodyRegular: 'Poppins-Regular',       // Poppins Regular 400.
  bodyBold: 'Poppins-Bold',             // Poppins Bold 700.
  accent: 'Bungee',                     // Bungee — game titles only.
};

// Arabic font set — Cairo for everything, Bungee doesn't support Arabic
// so accent falls back to Cairo Bold for Arabic titles.
const AR_FONTS: FontSet = {
  headlineRegular: 'Cairo-Regular',     // Cairo Regular 400.
  headlineBold: 'Cairo-Bold',           // Cairo Bold 700.
  bodyRegular: 'Cairo-Regular',         // Cairo Regular 400.
  bodyBold: 'Cairo-Bold',              // Cairo Bold 700.
  accent: 'Cairo-Bold',                // Bungee doesn't support Arabic — use Cairo Bold.
};

// FONTS.get(language) returns the correct font set for the active language.
// Called in AppText and AppButton to pick the right fontFamily.
// Angular equivalent: a service method that returns fonts based on active locale.
export const FONTS = {
  get: (language: 'ar' | 'en'): FontSet => {
    return language === 'ar' ? AR_FONTS : EN_FONTS; // Arabic → Cairo, English → Poppins.
  },
};

// ── THEME STATIC VALUES ──────────────────────────────────────
// These never change between themes.
// Components use THEME.spacing, THEME.fontSizes etc for layout.
// Components use useTheme().colors for dynamic colour values.
// Angular equivalent: static SCSS variables that never change.
export const THEME = {

  // Typography scale.
  fontSizes: {
    xs: 10,      // Smallest text — badges, tiny labels.
    sm: 12,      // Small text — captions, helper text.
    md: 14,      // Default body text size.
    lg: 16,      // Slightly larger body — emphasized text.
    xl: 20,      // Section titles, h3.
    xxl: 26,     // Screen titles, h2.
    xxxl: 36,    // Hero text, h1.
  },

  // Font weights — mapped to actual fontFamily strings.
  // In React Native, fontWeight and fontFamily must match.
  // You cannot use fontWeight: '700' with a Regular font file —
  // you must use the Bold font file instead.
  fontWeights: {
    regular: '400' as const,   // Used with *-Regular font files.
    bold: '700' as const,      // Used with *-Bold font files.
  },

  // Spacing scale.
  spacing: {
    xs: 4,       // Tightest spacing — inline gaps.
    sm: 8,       // Small gaps — between related elements.
    md: 16,      // Default spacing — between sections.
    lg: 24,      // Large gaps — major sections.
    xl: 32,      // Extra large — screen padding.
    xxl: 48,     // Largest — hero sections.
  },

  // Border radius scale.
  borderRadius: {
    sm: 4,       // Subtle rounding — tags, badges.
    md: 8,       // Default rounding — buttons, inputs.
    lg: 16,      // Large rounding — cards, containers.
    full: 999,   // Fully rounded — circles, pills.
  },

} as const;