// ============================================================
// help.screen.tsx
// Instructions screen. Phase 1.
// Angular equivalent: HelpComponent.
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { APP_CONFIG } from '../core/config/app.config';

export const HelpScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      <AppText variant="h2" style={{ color: colors.primary }}>How to Play</AppText>

      <AppText variant="body">{APP_CONFIG.name} is a football trivia game inspired by tic-tac-toe.</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>The Grid</AppText>
      <AppText variant="body">The board is a 3x3 grid. Each row and column has a football club badge as its header.</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>Your Turn</AppText>
      <AppText variant="body">Tap any empty cell. Name a player who played for BOTH clubs — the row club and the column club.</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>Claiming a Cell</AppText>
      <AppText variant="body">Answer correctly and the cell is yours. Answer wrongly and the turn passes to your opponent.</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>Winning</AppText>
      <AppText variant="body">Get 3 cells in a row — horizontally, vertically, or diagonally — to win.</AppText>

      <AppButton
        label="Got it"
        onPress={() => navigation.goBack()}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxl,
    paddingBottom: THEME.spacing.xxl,
    gap: THEME.spacing.md,
  },
  sectionTitle: {
    marginTop: THEME.spacing.sm,
  },
  button: {
    marginTop: THEME.spacing.xl,
  },
});