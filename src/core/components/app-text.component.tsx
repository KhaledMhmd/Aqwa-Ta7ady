// ── React Native ──────────────────────────────────────

// ============================================================
// app-text.component.tsx
// Reusable text component. Uses useTheme() for dynamic colours
// and FONTS for custom font families.
// Headlines use Plus Jakarta Sans, body/caption/label use Be Vietnam Pro.
// Angular equivalent: a shared TextComponent in SharedModule
// that injects ThemeService.
// ============================================================

import React from 'react';                                // React core — needed for JSX.
import { Text, TextStyle } from 'react-native';           // Text component and style type.
import { useTheme } from '../theme/theme.context';         // Dynamic theme colours.
import { THEME, FONTS } from '../theme/theme.config';      // Static sizes, spacing, and font families.

// Props type — what the parent component can pass in.
// Angular equivalent: @Input() decorators on the component class.
type Props = {
  children: React.ReactNode;                               // The text content to render.
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label'; // Which text style to apply.
  color?: string;                                          // Optional colour override from parent.
  style?: TextStyle;                                       // Optional extra styles from parent.
};

export const AppText = ({
  children,
  variant = 'body',                                        // Default to body variant if not specified.
  color,
  style,
}: Props) => {

  // Get active colours from ThemeContext.
  // Re-renders automatically when theme toggles.
  // Angular equivalent: this.colors = this.themeService.activeColors
  const { colors } = useTheme();

  // Map each variant to its font size, weight, font family, and default colour.
  // Headlines use Plus Jakarta Sans Bold.
  // Body/caption/label use Be Vietnam Pro Regular.
  // Angular equivalent: an ngSwitch on variant applying different CSS classes.
  const variantStyles: Record<string, TextStyle> = {
    h1: {
      fontSize: THEME.fontSizes.xxxl,                      // 36 — largest text in the app.
      fontFamily: FONTS.headlineBold,                      // Plus Jakarta Sans Bold.
      color: colors.textPrimary,                           // Default to primary text colour.
    },
    h2: {
      fontSize: THEME.fontSizes.xxl,                       // 26 — screen titles.
      fontFamily: FONTS.headlineBold,                      // Plus Jakarta Sans Bold.
      color: colors.textPrimary,
    },
    h3: {
      fontSize: THEME.fontSizes.xl,                        // 20 — section titles.
      fontFamily: FONTS.headlineBold,                      // Plus Jakarta Sans Bold.
      color: colors.textPrimary,
    },
    body: {
      fontSize: THEME.fontSizes.md,                        // 14 — default readable text.
      fontFamily: FONTS.bodyRegular,                       // Be Vietnam Pro Regular.
      color: colors.textPrimary,
    },
    caption: {
      fontSize: THEME.fontSizes.sm,                        // 12 — small helper text.
      fontFamily: FONTS.bodyRegular,                       // Be Vietnam Pro Regular.
      color: colors.textSecondary,                         // Muted colour for captions.
    },
    label: {
      fontSize: THEME.fontSizes.xs,                        // 10 — smallest text.
      fontFamily: FONTS.bodyRegular,                       // Be Vietnam Pro Regular.
      color: colors.textSecondary,                         // Muted colour for labels.
    },
  };

  return (
    // Merge variant styles, optional colour override, and parent styles.
    // Later styles in the array override earlier ones.
    <Text style={[
      variantStyles[variant],                              // Base variant styles.
      color ? { color } : undefined,                       // Override colour if parent passed one.
      style,                                               // Any additional styles from parent.
    ] as any}>
      {children}
    </Text>
  );
};