// ============================================================
// theme.config.ts
// THE single source of truth for all visual design tokens.
// Every colour, font size, border radius, and spacing value
// in the entire app comes from here.
// Want to rebrand the app? Edit this file only.
// Angular equivalent: a global SCSS variables file (_variables.scss).
// ============================================================

export const THEME = {

  // ----------------------------------------------------------
  // COLOURS
  // ----------------------------------------------------------
  colors: {

    // Primary brand colours
    primary: '#E63946',       // Main red — used for buttons, highlights, active states
    primaryDark: '#C1121F',   // Darker red — used for pressed button states
    secondary: '#1D3557',     // Dark navy — used for backgrounds and cards

    // Background colours
    background: '#0D1B2A',    // Main app background — very dark navy
    surface: '#1B2838',       // Card/surface background — slightly lighter than background
    surfaceLight: '#253545',  // Lighter surface — used for input fields and inactive cells

    // Text colours
    textPrimary: '#FFFFFF',   // Main text — white on dark backgrounds
    textSecondary: '#A8B2C1', // Muted text — labels, hints, secondary info
    textDark: '#0D1B2A',      // Dark text — used on light/coloured backgrounds

    // Game-specific colours
    player1: '#E63946',       // Player 1 colour — red (matches primary)
    player2: '#457B9D',       // Player 2 colour — blue
    botColor: '#2EC4B6',      // Bot colour — teal

    // Status colours
    success: '#2EC4B6',       // Correct answer — teal green
    error: '#E63946',         // Wrong answer — red
    warning: '#F4A261',       // Warning states — orange
    disabled: '#3D4F61',      // Disabled buttons and cells — muted grey-blue

    // Border colours
    border: '#253545',        // Default border colour
    borderLight: '#3D4F61',   // Lighter border for subtle separators

    // Coming Soon overlay colour
    comingSoon: 'rgba(0,0,0,0.6)', // Semi-transparent overlay for locked features

  },

  // ----------------------------------------------------------
  // TYPOGRAPHY
  // ----------------------------------------------------------
  // Font sizes follow a scale — each step is meaningfully larger
  // than the previous. Never use a font size that is not in this list.
  fontSizes: {
    xs: 10,    // Tiny labels, badges
    sm: 12,    // Secondary text, hints
    md: 14,    // Body text, default
    lg: 16,    // Slightly prominent text
    xl: 20,    // Section headings
    xxl: 26,   // Screen titles
    xxxl: 36,  // Hero text, splash screen
  },

  // Font weights — only use these two values for consistency.
  fontWeights: {
    regular: '400' as const,  // Normal body text
    bold: '700' as const,     // Headings, buttons, emphasis
  },

  // ----------------------------------------------------------
  // SPACING
  // ----------------------------------------------------------
  // All padding and margin values come from this scale.
  // Using a fixed scale keeps spacing consistent everywhere.
  // Angular equivalent: $spacing-* variables in SCSS.
  spacing: {
    xs: 4,    // Tiny gaps — between icon and label
    sm: 8,    // Small padding — inside compact components
    md: 16,   // Default padding — inside cards and buttons
    lg: 24,   // Large padding — section spacing
    xl: 32,   // Extra large — screen-level padding
    xxl: 48,  // Hero spacing — splash screen elements
  },

  // ----------------------------------------------------------
  // BORDER RADIUS
  // ----------------------------------------------------------
  // Consistent rounding across all components.
  borderRadius: {
    sm: 4,    // Subtle rounding — input fields
    md: 8,    // Default rounding — buttons, cards
    lg: 16,   // Prominent rounding — modals, bottom sheets
    full: 999, // Fully round — avatars, pills, circular buttons
  },

} as const;
// 'as const' makes the entire theme object readonly.
// No component can accidentally mutate theme values at runtime.