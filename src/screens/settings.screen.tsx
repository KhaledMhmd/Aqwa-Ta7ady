// ============================================================
// settings.screen.tsx
// Global settings — theme toggle, game rules.
// Theme toggle is fully functional and persists.
// Header pattern: ← back | title | spacer (matches game.screen.tsx).
// Angular equivalent: SettingsComponent injecting
// SettingsService and ThemeService.
// ============================================================

import React from 'react';                                          // React core.
import { View, Switch, StyleSheet, ScrollView } from 'react-native'; // Layout + toggle + scrolling.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useSettings } from '../core/hooks/settings.hook';          // Settings state.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { AppBackButton } from '../core/components/app-back-button.component';

// ── Angular equivalent ────────────────────────────────
// In Angular: SettingsComponent with a shared <app-header>
// and constructor(private settingsService, private themeService).

export const SettingsScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { settings, isLoading, updateGameRules } = useSettings();   // Settings state + updater.
  const { t } = useLanguage();                                       // Translations.
  const { colors, themeMode, toggleTheme } = useTheme();            // Dynamic colours + theme toggler.

  // Don't render while loading settings from storage.
  if (isLoading) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      {/* direction: 'ltr' keeps ← on the left even in Arabic RTL mode. */}
      <View style={[styles.header, { direction: 'ltr' }]}>
       <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {t.settings.title}
        </AppText>
        {/* Empty spacer — same width as back button to center the title. */}
        <View style={styles.headerBackButton} />
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* ── APPEARANCE SECTION ── */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
          {t.settings.appearanceSection}
        </AppText>

        {/* Dark Mode toggle. */}
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <AppText variant="body">{t.settings.darkMode}</AppText>
            <AppText variant="caption">{t.settings.darkModeDesc}</AppText>
          </View>
          <Switch
            value={themeMode === 'dark'}                             // On = dark mode active.
            onValueChange={toggleTheme}                              // Toggle between dark and light.
            trackColor={{ false: colors.disabled, true: colors.primary }} // Track colours.
            thumbColor={colors.textPrimary}                          // Thumb colour.
          />
        </View>

        {/* ── GAME RULES SECTION ── */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
          {t.settings.gameRulesSection}
        </AppText>

        {/* Steal Cells toggle. */}
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <AppText variant="body">{t.settings.stealCells}</AppText>
            <AppText variant="caption">{t.settings.stealCellsDesc}</AppText>
          </View>
          <Switch
            value={settings.gameRules.stealCells}
            onValueChange={(value) => updateGameRules({ stealCells: value })}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>

        {/* Time Limit toggle. */}
        <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <AppText variant="body">{t.settings.timeLimit}</AppText>
            <AppText variant="caption">{t.settings.timeLimitDesc}</AppText>
          </View>
          <Switch
            value={settings.gameRules.timeLimitEnabled}
            onValueChange={(value) => updateGameRules({ timeLimitEnabled: value })}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.textPrimary}
          />
        </View>

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
    gap: THEME.spacing.md,                                           // 16 — gap between elements.
  },
  // Section title.
  sectionTitle: {
    marginTop: THEME.spacing.md,                                     // 16 — gap above sections.
  },
  // Setting row — label + switch side by side.
  settingRow: {
    flexDirection: 'row',                                            // Horizontal layout.
    alignItems: 'center',                                            // Vertically centered.
    justifyContent: 'space-between',                                 // Spread across the row.
    paddingVertical: THEME.spacing.sm,                               // 8 — vertical padding.
    borderBottomWidth: 0.5,                                          // Subtle separator.
  },
  // Setting label + description.
  settingInfo: {
    flex: 1,                                                         // Take available space.
    paddingRight: THEME.spacing.md,                                  // 16 — gap before the switch.
    gap: THEME.spacing.xs,                                           // 4 — gap between label and description.
  },
});