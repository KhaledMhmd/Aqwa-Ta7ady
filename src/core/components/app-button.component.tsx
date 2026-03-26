// ============================================================
// app-button.component.tsx
// Reusable button component used throughout the entire app.
// All colours come from theme.config.ts — never hardcoded.
// Angular equivalent: a shared ButtonComponent in a SharedModule
// with @Input() for variant, label, disabled, and onPress.
// ============================================================

import React from 'react';
import {
  TouchableOpacity,  // Pressable wrapper with opacity feedback on press.
  Text,              // Renders text. Equivalent to <span>.
  StyleSheet,        // Defines styles. Equivalent to a .scss file.
  ActivityIndicator, // Shows a spinning loader. Equivalent to a CSS spinner.
  ViewStyle,         // TypeScript type for style objects applied to Views.
  TextStyle,         // TypeScript type for style objects applied to Text.
} from 'react-native';

import { THEME } from '../theme/theme.config';

// Props defines everything this button accepts from its parent.
// Angular equivalent: @Input() properties on the component class.
type Props = {
  // The text label shown inside the button.
  label: string;

  // Function called when the button is pressed.
  // Angular equivalent: @Output() pressed = new EventEmitter<void>()
  onPress: () => void;

  // Visual style of the button.
  // 'primary' = filled red button — main actions.
  // 'secondary' = outlined button — secondary actions.
  // 'ghost' = no border, no background — subtle actions.
  // Defaults to 'primary' if not provided.
  variant?: 'primary' | 'secondary' | 'ghost';

  // When true, button is greyed out and cannot be pressed.
  // Angular equivalent: [disabled]="isDisabled"
  disabled?: boolean;

  // When true, shows a spinner instead of the label.
  // Used for async actions like submitting a form.
  loading?: boolean;

  // Optional extra styles passed from the parent to override defaults.
  // Angular equivalent: [ngStyle] or [class] binding from parent.
  style?: ViewStyle;

  // Optional extra text styles passed from the parent.
  labelStyle?: TextStyle;
};

// AppButton is the component function.
// Destructure props with default values for optional ones.
// Angular equivalent: the component class with @Input() properties
// and the template combined into one function.
export const AppButton = ({
  label,
  onPress,
  variant = 'primary',  // Default to primary if not specified.
  disabled = false,
  loading = false,
  style,
  labelStyle,
}: Props) => {

  // Determine which background style to use based on variant.
  // Angular equivalent: [class.primary]="variant === 'primary'" etc.
  const containerStyle = [
    styles.base,                                    // Always applied.
    variant === 'primary' && styles.primary,        // Red filled button.
    variant === 'secondary' && styles.secondary,    // Outlined button.
    variant === 'ghost' && styles.ghost,            // No background button.
    (disabled || loading) && styles.disabled,       // Greyed out when disabled.
    style,                                          // Parent overrides last.
  ];

  // Determine text colour based on variant.
  const textStyle = [
    styles.label,
    variant === 'secondary' && styles.labelSecondary,
    variant === 'ghost' && styles.labelGhost,
    (disabled || loading) && styles.labelDisabled,
    labelStyle,
  ];

  return (
    // TouchableOpacity dims on press via activeOpacity.
    // disabled prop prevents any press when true.
    // Angular equivalent: <button [disabled]="disabled || loading" (click)="onPress()">
    <TouchableOpacity
      style={containerStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        // Show spinner instead of label when loading.
        // Color matches the label colour for the current variant.
        // Angular equivalent: *ngIf="loading"
        <ActivityIndicator
          color={
            variant === 'primary'
              ? THEME.colors.textPrimary
              : THEME.colors.primary
          }
          size="small"
        />
      ) : (
        // Show the label text when not loading.
        // Angular equivalent: *ngIf="!loading" {{ label }}
        <Text style={textStyle}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

// StyleSheet.create() defines all styles for this component.
// Angular equivalent: app-button.component.scss
const styles = StyleSheet.create({
  // Base styles applied to every button regardless of variant.
  base: {
    paddingVertical: THEME.spacing.sm,        // Vertical padding from theme.
    paddingHorizontal: THEME.spacing.lg,      // Horizontal padding from theme.
    borderRadius: THEME.borderRadius.md,      // Rounded corners from theme.
    alignItems: 'center',                     // Center content horizontally.
    justifyContent: 'center',                 // Center content vertically.
    minHeight: 48,                            // Minimum touch target height.
  },

  // Primary variant — filled red background.
  primary: {
    backgroundColor: THEME.colors.primary,
  },

  // Secondary variant — transparent with red border.
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: THEME.colors.primary,
  },

  // Ghost variant — no background, no border.
  ghost: {
    backgroundColor: 'transparent',
  },

  // Disabled state — overrides all variant colours.
  disabled: {
    backgroundColor: THEME.colors.disabled,
    borderColor: THEME.colors.disabled,
    opacity: 0.6,
  },

  // Label styles.
  label: {
    color: THEME.colors.textPrimary,
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.bold,
    letterSpacing: 0.5,
  },

  labelSecondary: {
    color: THEME.colors.primary,
  },

  labelGhost: {
    color: THEME.colors.textSecondary,
  },

  labelDisabled: {
    color: THEME.colors.textSecondary,
  },
});