// ============================================================
// help.screen.tsx
// Instructions screen. Phase 1.
// Header pattern: ← back | title | spacer (matches game.screen.tsx).
// Angular equivalent: HelpComponent.
// ============================================================

import React from 'react';                                          // React core.
import { View, StyleSheet, ScrollView } from 'react-native';        // Layout + scrolling.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { AppBackButton } from '../core/components/app-back-button.component';

export const HelpScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { colors } = useTheme();                                     // Dynamic colours.
  const { t } = useLanguage();                                       // Translations.

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      {/* direction: 'ltr' keeps ← on the left even in Arabic RTL mode. */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {t.help.title}
        </AppText>
        {/* Empty spacer — same width as back button to center the title. */}
        <View style={styles.headerBackButton} />
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────── */}
      <ScrollView contentContainerStyle={styles.container}>

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

        {/* Got it button — still at bottom of content for a clear call-to-action. */}
        <AppButton
          label={t.help.gotIt}
          onPress={() => navigation.goBack()}
          style={styles.button}
        />

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // Full screen wrapper.
  screen: {
    flex: 1,                                                         // Fill all available space.
  },
  // ── HEADER — reusable pattern from game.screen.tsx ──
  header: {
    flexDirection: 'row',                                            // Horizontal layout.
    alignItems: 'center',                                            // Vertically centered.
    justifyContent: 'space-between',                                 // Spread across the row.
    paddingHorizontal: THEME.spacing.md,                             // 16 — side padding.
    paddingVertical: THEME.spacing.sm,                               // 8 — top/bottom padding.
  },
  // Back button + spacer — same width so the title stays centered.
  headerBackButton: {
     width: 44,                                   // Matches game.screen.tsx.
  },
  // ScrollView content.
  container: {
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    paddingTop: THEME.spacing.sm,                                    // 8 — small gap below header.
    paddingBottom: THEME.spacing.xxl,                                // 48 — bottom padding.
    gap: THEME.spacing.md,                                           // 16 — gap between sections.
  },
  // Section title spacing.
  sectionTitle: {
    marginTop: THEME.spacing.sm,                                     // 8 — small gap above section titles.
  },
  // Got it button.
  button: {
    marginTop: THEME.spacing.xl,                                     // 32 — gap above button.
  },
});