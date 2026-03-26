// ============================================================
// shop.screen.tsx
// Coming Soon placeholder. Phase 2+.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';

export const ShopScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="h1">🛍️</AppText>
      <AppText variant="h2" style={{ color: colors.primary }}>Shop</AppText>
      <AppText variant="caption">Coming in a future update. Exclusive items on the way!</AppText>
      <AppButton label="Back" onPress={() => navigation.goBack()} variant="ghost" style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  button: { marginTop: THEME.spacing.lg },
});