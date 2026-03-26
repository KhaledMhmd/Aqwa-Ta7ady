// ============================================================
// leaderboard.screen.tsx
// Coming Soon placeholder — Phase 2+.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { THEME } from '../core/theme/theme.config';

export const LeaderboardScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppText variant="h1">🏆</AppText>
      <AppText variant="h2" style={styles.title}>Leaderboards</AppText>
      <AppText variant="caption" style={styles.message}>
        Coming in a future update. Get ready to compete!
      </AppText>
      <AppButton
        label="Back"
        onPress={() => navigation.goBack()}
        variant="ghost"
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  title: { color: THEME.colors.primary },
  message: { textAlign: 'center' },
  button: { marginTop: THEME.spacing.lg },
});