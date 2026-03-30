// ============================================================
// settings.screen.tsx
// Global settings — theme toggle, game rules.
// Theme toggle is fully functional and persists.
// Angular equivalent: SettingsComponent injecting
// SettingsService and ThemeService.
// ============================================================

import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useSettings } from '../core/hooks/settings.hook';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { useLanguage } from '../core/i18n/language.context';

export const SettingsScreen = () => {
  const navigation = useNavigation();
  const { settings, isLoading, updateGameRules } = useSettings();
  const { t } = useLanguage();

  // useTheme provides colors for styling AND toggleTheme for the switch.
  const { colors, themeMode, toggleTheme } = useTheme();

  if (isLoading) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <AppText variant="h2" style={{ color: colors.primary }}>{t.settings.title}</AppText>

      {/* ── APPEARANCE ── */}
      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
        {t.settings.appearanceSection}
      </AppText>

      {/* Dark Mode toggle */}
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

      {/* ── GAME RULES ── */}
      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
        {t.settings.gameRulesSection}
      </AppText>

      {/* Steal Cells toggle */}
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

      {/* Time Limit toggle */}
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

      <AppButton
        label="Back"
        onPress={() => navigation.goBack()}
        variant="ghost"
        style={styles.backButton}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxl,
    gap: THEME.spacing.md,
  },
  sectionTitle: {
    marginTop: THEME.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 0.5,
  },
  settingInfo: {
    flex: 1,
    paddingRight: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  backButton: {
    marginTop: THEME.spacing.xl,
  },
});