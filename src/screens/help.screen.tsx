// ============================================================
// help.screen.tsx
// Basic instructions screen — Phase 1.
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { THEME } from '../core/theme/theme.config';
import { APP_CONFIG } from '../core/config/app.config';

export const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    // ScrollView allows the content to scroll if it overflows the screen.
    // Angular equivalent: overflow-y: auto on a container div.
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      <AppText variant="h2" style={styles.title}>How to Play</AppText>

      <AppText variant="body" style={styles.rule}>
        {APP_CONFIG.name} is a football trivia game inspired by tic-tac-toe.
      </AppText>

      <AppText variant="h3" style={styles.sectionTitle}>The Grid</AppText>
      <AppText variant="body" style={styles.rule}>
        The board is a 3x3 grid. Each row and column has a football club badge as its header.
      </AppText>

      <AppText variant="h3" style={styles.sectionTitle}>Your Turn</AppText>
      <AppText variant="body" style={styles.rule}>
        Tap any empty cell. You will be asked to name a player who played for BOTH clubs — the one on the row and the one on the column.
      </AppText>

      <AppText variant="h3" style={styles.sectionTitle}>Claiming a Cell</AppText>
      <AppText variant="body" style={styles.rule}>
        Answer correctly and the cell is yours. Answer wrongly and the turn passes to your opponent.
      </AppText>

      <AppText variant="h3" style={styles.sectionTitle}>Winning</AppText>
      <AppText variant="body" style={styles.rule}>
        Get 3 cells in a row — horizontally, vertically, or diagonally — to win.
      </AppText>

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
    backgroundColor: THEME.colors.background,
  },
  container: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxl,
    paddingBottom: THEME.spacing.xxl,
    gap: THEME.spacing.md,
  },
  title: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.sm,
  },
  rule: {
    lineHeight: 22,
  },
  button: {
    marginTop: THEME.spacing.xl,
  },
});