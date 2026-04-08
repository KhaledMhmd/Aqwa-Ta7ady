// ============================================================
// mode-select.screen.tsx
// Step 1: Player picks vs Bot or vs Friend.
// Step 2: If vs Bot selected, difficulty options appear below.
// vs Friend is disabled in Phase 1 — Coming Soon.
// Angular equivalent: ModeSelectComponent with conditional
// rendering based on selected mode state.
// ============================================================

import React, { useState } from 'react';                            // React core + state hook.
import { View, StyleSheet, Alert } from 'react-native';             // Layout + alert.
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area.
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.
import { RootStackParamList } from '../../../navigation/app.navigator'; // Route types.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { AppButton } from '../../../core/components/app-button.component'; // Themed button.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { useLanguage } from '../../../core/i18n/language.context';  // Translations.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing.
import { TTT_CONFIG } from '../config/game.config';                 // Game name.

// ── Angular equivalent ────────────────────────────────
// In Angular: ModeSelectComponent with *ngIf="selectedMode === 'vs-bot'"
// to conditionally show the difficulty section.

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicTacToeModeSelect'>;
type RoutePropType = RouteProp<RootStackParamList, 'TicTacToeModeSelect'>;

// GameMode — which mode the player selected in step 1.
type GameMode = 'vs-bot' | 'vs-friend' | null;

export const ModeSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Navigate to other screens.
  const route = useRoute<RoutePropType>();                           // Read params.
  const { colors } = useTheme();                                     // Dynamic colours.
  const { t } = useLanguage();                                       // Translations.

  const { playerName, playerAvatar } = route.params;                 // Player info from previous screen.

  // selectedMode — pre-selected to 'vs-bot' so difficulty is immediately visible.
  const [selectedMode, setSelectedMode] = useState<GameMode>('vs-bot');

  // Step 1 — picking vs Bot or vs Friend.
  const onModeSelect = (mode: 'vs-bot' | 'vs-friend') => {
    if (mode === 'vs-friend') {
      Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
      return;
    }
    setSelectedMode(mode);
  };

  // Step 2 — picking Easy, Medium, or Hard.
  const onDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigation.navigate('TicTacToe', {
      playerName,
      playerAvatar,
      difficulty,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* Game title. */}
        <AppText variant="h2" style={{ color: colors.primary }}>
          {TTT_CONFIG.name}
        </AppText>

        {/* Step 1 — Mode selection. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
          {t.modeSelect.title}
        </AppText>

        <View style={styles.modeRow}>
          {/* vs Bot button. */}
          <AppButton
            label={t.modeSelect.vsBot}
            onPress={() => onModeSelect('vs-bot')}
            variant={selectedMode === 'vs-bot' ? 'primary' : 'secondary'}
            style={styles.modeButton}
          />
          {/* vs Friend button — disabled, Coming Soon. */}
          <AppButton
            label={t.modeSelect.vsFriend}
            onPress={() => onModeSelect('vs-friend')}
            variant="ghost"
            style={[styles.modeButton, { opacity: 0.5 }] as any}
          />
        </View>

        {/* Step 2 — Difficulty selection (shown when vs Bot is selected). */}
        {/* Angular equivalent: *ngIf="selectedMode === 'vs-bot'". */}
        {selectedMode === 'vs-bot' && (
          <View style={[
            styles.difficultySection,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}>
            <AppText variant="body" style={[styles.difficultyLabel, { color: colors.textSecondary }] as any}>
              {t.modeSelect.difficultyTitle}
            </AppText>
            <AppButton
              label={t.modeSelect.easy}
              onPress={() => onDifficultySelect('easy')}
              variant="secondary"
              style={styles.difficultyButton}
            />
            <AppButton
              label={t.modeSelect.medium}
              onPress={() => onDifficultySelect('medium')}
              variant="secondary"
              style={styles.difficultyButton}
            />
            <AppButton
              label={t.modeSelect.hard}
              onPress={() => onDifficultySelect('hard')}
              variant="secondary"
              style={styles.difficultyButton}
            />
          </View>
        )}

        {/* Back button. */}
        <AppButton
          label={t.common.back}
          onPress={() => navigation.goBack()}
          variant="ghost"
          style={styles.backButton}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // SafeAreaView — fills the screen.
  safeArea: {
    flex: 1,
  },
  // Main container.
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  // Section title spacing.
  sectionTitle: {
    marginBottom: THEME.spacing.xs,
  },
  // Mode buttons row.
  modeRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    width: '100%',
  },
  // Each mode button takes equal width.
  modeButton: {
    flex: 1,
  },
  // Difficulty section card.
  difficultySection: {
    width: '100%',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 0.5,
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  // Difficulty label spacing.
  difficultyLabel: {
    marginBottom: THEME.spacing.xs,
  },
  // Difficulty button — full width.
  difficultyButton: {
    width: '100%',
  },
  // Back button.
  backButton: {
    marginTop: THEME.spacing.sm,
    width: '100%',
  },
});