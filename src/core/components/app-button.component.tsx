// ============================================================
// app-button.component.tsx
// Reusable button component. Uses useTheme() so colours
// update automatically when the theme toggles.
// Angular equivalent: a shared ButtonComponent in SharedModule
// that injects ThemeService.
// ============================================================

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

import { useTheme } from '../theme/theme.context';
import { THEME } from '../theme/theme.config';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

export const AppButton = ({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  labelStyle,
}: Props) => {

  // Get active colours from ThemeContext.
  const { colors } = useTheme();

  // Determine container styles based on variant and state.
  const containerStyles = [
    styles.base,
    variant === 'primary' && { backgroundColor: colors.primary },
    variant === 'secondary' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    (disabled || loading) && {
      backgroundColor: colors.disabled,
      borderColor: colors.disabled,
      opacity: 0.6,
    },
    style,
  ];

  // Determine label colour based on variant and state.
  const labelStyles = [
    styles.label,
    { color: colors.textPrimary },
    variant === 'secondary' && { color: colors.primary },
    variant === 'ghost' && { color: colors.textSecondary },
    (disabled || loading) && { color: colors.textSecondary },
    labelStyle,
  ];

  return (
    <TouchableOpacity
      style={containerStyles as any}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.textPrimary : colors.primary}
          size="small"
        />
      ) : (
        <Text style={labelStyles as any}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: THEME.spacing.sm,
    paddingHorizontal: THEME.spacing.lg,
    borderRadius: THEME.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  label: {
    fontSize: THEME.fontSizes.md,
    fontWeight: THEME.fontWeights.bold,
    letterSpacing: 0.5,
  },
});