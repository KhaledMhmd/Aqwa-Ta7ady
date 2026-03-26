// ============================================================
// app-text.component.tsx
// Reusable text component. Every text element in the app
// uses this instead of React Native's raw <Text> component.
// Ensures consistent typography from theme.config.ts everywhere.
// Angular equivalent: a shared TextComponent in a SharedModule.
// ============================================================

import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { THEME } from '../theme/theme.config';

// Props for the text component.
type Props = {
  // The text content to display.
  children: React.ReactNode;

  // Visual variant of the text.
  // 'h1'      = large screen title (36px bold)
  // 'h2'      = section title (26px bold)
  // 'h3'      = subsection title (20px bold)
  // 'body'    = default body text (14px regular) — default
  // 'caption' = small secondary text (12px regular)
  // 'label'   = tiny label text (10px regular)
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

  // Colour override — defaults to textPrimary if not provided.
  // Pass THEME.colors.textSecondary for muted text etc.
  color?: string;

  // Optional extra styles from the parent.
  style?: TextStyle;
};

export const AppText = ({
  children,
  variant = 'body',
  color,
  style,
}: Props) => {

  // Build the style array — base + variant + colour override + parent styles.
  const textStyle = [
    styles.base,
    styles[variant],
    // Only apply color override if explicitly passed.
    color ? { color } : undefined,
    style,
  ];

  return <Text style={textStyle}>{children}</Text>;
};

const styles = StyleSheet.create({
  // Base style applied to all text.
  base: {
    color: THEME.colors.textPrimary,  // Default text colour from theme.
  },

  // Variant styles — font size and weight from theme.
  h1: {
    fontSize: THEME.fontSizes.xxxl,
    fontWeight: THEME.fontWeights.bold,
  },
  h2: {
    fontSize: THEME.fontSizes.xxl,
    fontWeight: THEME.fontWeights.bold,
  },
  h3: {
    fontSize: THEME.fontSizes.xl,
    fontWeight: THEME.fontWeights.bold,
  },
  body: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.regular,
  },
  caption: {
    fontSize: THEME.fontSizes.sm,
    fontWeight: THEME.fontWeights.regular,
    color: THEME.colors.textSecondary,  // Captions are muted by default.
  },
  label: {
    fontSize: THEME.fontSizes.xs,
    fontWeight: THEME.fontWeights.regular,
    color: THEME.colors.textSecondary,
  },
});