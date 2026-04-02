// ── React Native ──────────────────────────────────────

// ============================================================
// app-button.component.tsx
// Reusable button component. Uses useTheme() so colours
// update automatically when the theme toggles.
// Button labels use Be Vietnam Pro Bold font.
// Angular equivalent: a shared ButtonComponent in SharedModule
// that injects ThemeService.
// ============================================================

import React from 'react';                                 // React core — needed for JSX.
import {
  TouchableOpacity,                                        // Pressable wrapper — like a clickable <div>.
  Text,                                                    // Text inside the button.
  StyleSheet,                                              // Creates optimised style objects.
  ActivityIndicator,                                       // Loading spinner.
  ViewStyle,                                               // Type for container styles.
  TextStyle,                                               // Type for text styles.
} from 'react-native';

import { useTheme } from '../theme/theme.context';         // Dynamic theme colours.
import { THEME, FONTS } from '../theme/theme.config';      // Static sizes and font families.

// Props type — what the parent can pass in.
// Angular equivalent: @Input() decorators.
type Props = {
  label: string;                                           // Button text.
  onPress: () => void;                                     // Tap handler — like (click) in Angular.
  variant?: 'primary' | 'secondary' | 'ghost';            // Visual style variant.
  disabled?: boolean;                                      // Greyed out and non-interactive.
  loading?: boolean;                                       // Shows spinner instead of text.
  style?: ViewStyle;                                       // Extra container styles from parent.
  labelStyle?: TextStyle;                                  // Extra label styles from parent.
};

export const AppButton = ({
  label,
  onPress,
  variant = 'primary',                                     // Default to primary variant.
  disabled = false,
  loading = false,
  style,
  labelStyle,
}: Props) => {

  // Get active colours from ThemeContext.
  const { colors } = useTheme();

  // Determine container styles based on variant and state.
  // Angular equivalent: [ngClass] with conditional classes.
  const containerStyles = [
    styles.base,                                           // Base padding, border radius, alignment.
    variant === 'primary' && { backgroundColor: colors.primary },        // Solid purple background.
    variant === 'secondary' && {
      backgroundColor: 'transparent',                      // No background.
      borderWidth: 1.5,                                    // Purple outline only.
      borderColor: colors.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },           // No background, no border.
    (disabled || loading) && {
      backgroundColor: colors.disabled,                    // Greyed out background.
      borderColor: colors.disabled,                        // Greyed out border.
      opacity: 0.6,                                        // Faded appearance.
    },
    style,                                                 // Parent overrides.
  ];

  // Determine label colour based on variant and state.
  const labelStyles = [
    styles.label,                                          // Base font size and weight.
    { color: colors.textOnPrimary },                       // Default: white text on purple.
    variant === 'secondary' && { color: colors.primary },  // Purple text on outlined button.
    variant === 'ghost' && { color: colors.textSecondary },// Muted text on ghost button.
    (disabled || loading) && { color: colors.textSecondary }, // Muted when disabled.
    labelStyle,                                            // Parent overrides.
  ];

  return (
    <TouchableOpacity
      style={containerStyles as any}                       // Apply computed container styles.
      onPress={onPress}                                    // Tap handler.
      disabled={disabled || loading}                       // Block interaction when disabled or loading.
      activeOpacity={0.8}                                  // Slight dim on press — visual feedback.
    >
      {loading ? (
        // Show spinner when loading — replaces the label text.
        <ActivityIndicator
          color={variant === 'primary' ? colors.textOnPrimary : colors.primary} // Spinner colour matches context.
          size="small"
        />
      ) : (
        // Show label text when not loading.
        <Text style={labelStyles as any}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base button container — shared by all variants.
  base: {
    paddingVertical: THEME.spacing.sm,                     // 8 — vertical padding.
    paddingHorizontal: THEME.spacing.lg,                   // 24 — horizontal padding.
    borderRadius: THEME.borderRadius.md,                   // 8 — rounded corners.
    alignItems: 'center',                                  // Center text horizontally.
    justifyContent: 'center',                              // Center text vertically.
    minHeight: 48,                                         // Minimum tap target — accessibility.
  },
  // Button label text — Be Vietnam Pro Bold.
  label: {
    fontSize: THEME.fontSizes.md,                          // 14 — default text size.
    fontFamily: FONTS.bodyBold,                            // Be Vietnam Pro Bold for button labels.
    letterSpacing: 0.5,                                    // Slight letter spacing for readability.
  },
});