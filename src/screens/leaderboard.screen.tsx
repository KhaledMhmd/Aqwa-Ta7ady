// ============================================================
// leaderboard.screen.tsx
// Coming Soon placeholder. Phase 2+.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { useLanguage } from '../core/i18n/language.context';

export const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="h1">🏆</AppText>
      <AppText variant="h2" style={{ color: colors.primary }}>{t.leaderboard.title}</AppText>
      <AppText variant="caption">{t.leaderboard.comingSoonMessage}</AppText>
      <AppButton label={t.common.back} onPress={() => navigation.goBack()} variant="ghost" style={styles.button} />
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