// ── React Native ──────────────────────────────────────

// ============================================================
// app-text.component.tsx
// Reusable text component. Uses useTheme() for dynamic colours
// and FONTS.get(language) for language-aware font families.
// English → Poppins, Arabic → Cairo.
// Angular equivalent: a shared TextComponent in SharedModule.
// ============================================================

import React from 'react';                                // React core.
import { Text, TextStyle } from 'react-native';           // Text component and style type.
import { useTheme } from '../theme/theme.context';         // Dynamic colours.
import { THEME, FONTS } from '../theme/theme.config';      // Static sizes and font getter.
import { useLanguage } from '../i18n/language.context';    // Current language for font selection.

// Props type — what the parent component can pass in.
type Props = {
  children: React.ReactNode;                               // Text content to render.
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label' | 'accent'; // Text style variant.
  color?: string;                                          // Optional colour override.
  style?: TextStyle;                                       // Optional extra styles from parent.
};

export const AppText = ({
  children,
  variant = 'body',                                        // Default to body variant.
  color,
  style,
}: Props) => {
  const { colors } = useTheme();                           // Dynamic theme colours.
  const { language } = useLanguage();                      // Current language — 'ar' or 'en'.
  const fonts = FONTS.get(language);                       // Get the correct font set for this language.

  // Map each variant to its font size, font family, and default colour.
  // Headlines use headlineBold, body/caption/label use bodyRegular.
  // Accent uses Bungee for English, Cairo Bold for Arabic.
  const variantStyles: Record<string, TextStyle> = {
    h1: {
      fontSize: THEME.fontSizes.xxxl,                      // 36 — largest text.
      fontFamily: fonts.headlineBold,                      // Poppins Bold / Cairo Bold.
      color: colors.textPrimary,
    },
    h2: {
      fontSize: THEME.fontSizes.xxl,                       // 26 — screen titles.
      fontFamily: fonts.headlineBold,                      // Poppins Bold / Cairo Bold.
      color: colors.textPrimary,
    },
    h3: {
      fontSize: THEME.fontSizes.xl,                        // 20 — section titles.
      fontFamily: fonts.headlineBold,                      // Poppins Bold / Cairo Bold.
      color: colors.textPrimary,
    },
    body: {
      fontSize: THEME.fontSizes.md,                        // 14 — default body text.
      fontFamily: fonts.bodyRegular,                       // Poppins Regular / Cairo Regular.
      color: colors.textPrimary,
    },
    caption: {
      fontSize: THEME.fontSizes.sm,                        // 12 — small helper text.
      fontFamily: fonts.bodyRegular,                       // Poppins Regular / Cairo Regular.
      color: colors.textSecondary,
    },
    label: {
      fontSize: THEME.fontSizes.xs,                        // 10 — smallest text.
      fontFamily: fonts.bodyRegular,                       // Poppins Regular / Cairo Regular.
      color: colors.textSecondary,
    },
    accent: {
      fontSize: THEME.fontSizes.xxl,                       // 26 — same as h2 size.
      fontFamily: fonts.accent,                            // Bungee for English, Cairo Bold for Arabic.
      color: colors.textPrimary,
    },
  };

  return (
    <Text style={[
      variantStyles[variant],                              // Base variant styles.
      color ? { color } : undefined,                       // Optional colour override.
      style,                                               // Parent overrides.
    ] as any}>
      {children}
    </Text>
  );
};