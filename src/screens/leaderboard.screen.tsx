// ============================================================
// leaderboard.screen.tsx
// Coming Soon placeholder. Phase 2+.
// Angular equivalent: LeaderboardComponent.
// ============================================================

import React from 'react';                                          // React core.
import { View, StyleSheet } from 'react-native';                    // Layout.
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.

export const LeaderboardScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { colors } = useTheme();                                     // Dynamic colours.
  const { t } = useLanguage();                                       // Translations.

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>
        <AppText variant="h1">🏆</AppText>
        <AppText variant="h2" style={{ color: colors.primary }}>{t.leaderboard.title}</AppText>
        <AppText variant="caption">{t.leaderboard.comingSoonMessage}</AppText>
        <AppButton label={t.common.back} onPress={() => navigation.goBack()} variant="ghost" style={styles.button} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // SafeAreaView — fills the screen.
  safeArea: {
    flex: 1,
  },
  // Content container — centered.
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  // Back button spacing.
  button: {
    marginTop: THEME.spacing.lg,
  },
});