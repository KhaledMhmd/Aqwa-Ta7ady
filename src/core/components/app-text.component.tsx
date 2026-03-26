// ============================================================
// app-text.component.tsx
// Reusable text component. Uses useTheme() so text colours
// update automatically when the theme toggles.
// Angular equivalent: a shared TextComponent in SharedModule
// that injects ThemeService.
// ============================================================

import React from 'react';
import { Text, TextStyle } from 'react-native';
import { useTheme } from '../theme/theme.context';
import { THEME } from '../theme/theme.config';

type Props = {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: string;       // Optional colour override.
  style?: TextStyle;    // Optional extra styles from parent.
};

export const AppText = ({
  children,
  variant = 'body',
  color,
  style,
}: Props) => {

  // Get active colours from ThemeContext.
  // Re-renders automatically when theme toggles.
  // Angular equivalent: this.colors = this.themeService.activeColors
  const { colors } = useTheme();

  // Map each variant to its font size, weight, and default colour.
  const variantStyles: Record<string, TextStyle> = {
    h1: {
      fontSize: THEME.fontSizes.xxxl,
      fontWeight: THEME.fontWeights.bold,
      color: colors.textPrimary,
    },
    h2: {
      fontSize: THEME.fontSizes.xxl,
      fontWeight: THEME.fontWeights.bold,
      color: colors.textPrimary,
    },
    h3: {
      fontSize: THEME.fontSizes.xl,
      fontWeight: THEME.fontWeights.bold,
      color: colors.textPrimary,
    },
    body: {
      fontSize: THEME.fontSizes.md,
      fontWeight: THEME.fontWeights.regular,
      color: colors.textPrimary,
    },
    caption: {
      fontSize: THEME.fontSizes.sm,
      fontWeight: THEME.fontWeights.regular,
      color: colors.textSecondary,
    },
    label: {
      fontSize: THEME.fontSizes.xs,
      fontWeight: THEME.fontWeights.regular,
      color: colors.textSecondary,
    },
  };

  return (
    <Text style={[
      variantStyles[variant],
      color ? { color } : undefined,
      style,
    ] as any}>
      {children}
    </Text>
  );
};