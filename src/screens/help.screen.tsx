// ============================================================
// help.screen.tsx
// Instructions screen. Phase 1.
// Angular equivalent: HelpComponent.
// ============================================================

import React from 'react';                                          // React core.
import { StyleSheet, ScrollView } from 'react-native';              // Layout + scrolling.
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.

export const HelpScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { colors } = useTheme();                                     // Dynamic colours.
  const { t } = useLanguage();                                       // Translations.

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Screen title. */}
        <AppText variant="h2" style={{ color: colors.primary }}>{t.help.title}</AppText>

        {/* Intro paragraph. */}
        <AppText variant="body">{t.help.intro}</AppText>

        {/* Grid section. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.gridTitle}</AppText>
        <AppText variant="body">{t.help.gridDesc}</AppText>

        {/* Turn section. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.turnTitle}</AppText>
        <AppText variant="body">{t.help.turnDesc}</AppText>

        {/* Claim section. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.claimTitle}</AppText>
        <AppText variant="body">{t.help.claimDesc}</AppText>

        {/* Win section. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.winTitle}</AppText>
        <AppText variant="body">{t.help.winDesc}</AppText>

        {/* Got it button. */}
        <AppButton
          label={t.help.gotIt}
          onPress={() => navigation.goBack()}
          style={styles.button}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // SafeAreaView — fills the screen.
  safeArea: {
    flex: 1,
  },
  // ScrollView content.
  container: {
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    paddingTop: THEME.spacing.md,                                    // FIX — less padding since SafeAreaView handles notch.
    paddingBottom: THEME.spacing.xxl,                                // 48 — bottom padding.
    gap: THEME.spacing.md,                                           // 16 — gap between sections.
  },
  // Section title spacing.
  sectionTitle: {
    marginTop: THEME.spacing.sm,
  },
  // Got it button.
  button: {
    marginTop: THEME.spacing.xl,
  },
});