// ============================================================
// settings.screen.tsx
// Global settings — theme toggle, game rules.
// Theme toggle is fully functional and persists.
// Angular equivalent: SettingsComponent injecting
// SettingsService and ThemeService.
// ============================================================

import React from 'react';                                          // React core.
import {
  View,                                                              // Container element.
  Switch,                                                            // Toggle switch.
  StyleSheet,                                                        // Style creation.
  ScrollView,                                                        // FIX — scrollable for small screens.
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useSettings } from '../core/hooks/settings.hook';          // Settings state.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.

// ── Angular equivalent ────────────────────────────────
// In Angular: SettingsComponent with constructor(
//   private settingsService: SettingsService,
//   private themeService: ThemeService
// )

export const SettingsScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { settings, isLoading, updateGameRules } = useSettings();   // Settings state + updater.
  const { t } = useLanguage();                                       // Translations.
  const { colors, themeMode, toggleTheme } = useTheme();            // Dynamic colours + theme toggler.

  // Don't render while loading settings from storage.
  if (isLoading) return null;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Screen title. */}
        <AppText variant="h2" style={{ color: colors.primary }}>{t.settings.title}</AppText>

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
            value={themeMode === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.disabled, true: colors.primary }}
            thumbColor={colors.textPrimary}
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

        {/* FIX — uses translated t.common.back instead of hardcoded "Back". */}
        <AppButton
          label={t.common.back}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.backButton}
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
  // ScrollView content — padded container.
  container: {
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    paddingTop: THEME.spacing.md,                                    // FIX — less padding since SafeAreaView handles notch.
    paddingBottom: THEME.spacing.xl,                                 // 32 — bottom padding.
    gap: THEME.spacing.md,                                           // 16 — gap between elements.
  },
  // Section title.
  sectionTitle: {
    marginTop: THEME.spacing.md,
  },
  // Setting row — label + switch.
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 0.5,
  },
  // Setting label + description.
  settingInfo: {
    flex: 1,
    paddingRight: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  // Back button.
  backButton: {
    marginTop: THEME.spacing.xl,
  },
});