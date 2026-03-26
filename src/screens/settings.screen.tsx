// ============================================================
// settings.screen.tsx
// Global settings page for the entire app.
// Phase 1: Steal Cells toggle and Time Limit toggle.
// More settings added here in future phases.
// ============================================================

import React from 'react';
import { View, Switch, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useSettings } from '../core/hooks/settings.hook';
import { THEME } from '../core/theme/theme.config';

export const SettingsScreen = () => {
  const navigation = useNavigation();

  // useSettings gives us the current settings and the update function.
  // Angular equivalent: injecting SettingsService and subscribing to settings$.
  const { settings, isLoading, updateGameRules } = useSettings();

  // Show nothing while settings are loading from AsyncStorage.
  if (isLoading) return null;

  return (
    <View style={styles.container}>
      <AppText variant="h2" style={styles.title}>Settings</AppText>

      {/* ── GAME RULES SECTION ── */}
      <AppText variant="h3" style={styles.sectionTitle}>Game Rules</AppText>

      {/* Steal Cells toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <AppText variant="body">Steal Cells</AppText>
          <AppText variant="caption">
            Claim an opponent's cell with a different correct answer
          </AppText>
        </View>
        {/* Switch is React Native's toggle component.
            Angular equivalent: a mat-slide-toggle or custom toggle component. */}
        <Switch
          value={settings.gameRules.stealCells}
          // onValueChange is called with the NEW value when toggled.
          // Angular equivalent: (change)="onStealCellsToggle($event)"
          onValueChange={(value) => updateGameRules({ stealCells: value })}
          trackColor={{
            false: THEME.colors.disabled,
            true: THEME.colors.primary,
          }}
          thumbColor={THEME.colors.textPrimary}
        />
      </View>

      {/* Time Limit toggle */}
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <AppText variant="body">Time Limit</AppText>
          <AppText variant="caption">
            45 seconds to answer per turn
          </AppText>
        </View>
        <Switch
          value={settings.gameRules.timeLimitEnabled}
          onValueChange={(value) => updateGameRules({ timeLimitEnabled: value })}
          trackColor={{
            false: THEME.colors.disabled,
            true: THEME.colors.primary,
          }}
          thumbColor={THEME.colors.textPrimary}
        />
      </View>

      {/* Back button */}
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
    backgroundColor: THEME.colors.background,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxl,
    gap: THEME.spacing.md,
  },
  title: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.sm,
  },
  sectionTitle: {
    color: THEME.colors.textSecondary,
    marginTop: THEME.spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: THEME.colors.border,
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