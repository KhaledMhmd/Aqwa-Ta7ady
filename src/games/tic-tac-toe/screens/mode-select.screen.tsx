// ============================================================
// mode-select.screen.tsx
// Step 1: Player picks vs Bot or vs Friend.
// Step 2: If vs Bot selected, difficulty options appear below.
// vs Friend is disabled in Phase 1 — Coming Soon.
// Angular equivalent: a ModeSelectComponent with conditional
// rendering based on selected mode state.
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/app.navigator';
import { AppText } from '../../../core/components/app-text.component';
import { AppButton } from '../../../core/components/app-button.component';
import { useTheme } from '../../../core/theme/theme.context';
import { useLanguage } from '../../../core/i18n/language.context';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicTacToeModeSelect'>;
type RoutePropType = RouteProp<RootStackParamList, 'TicTacToeModeSelect'>;

// GameMode — which mode the player selected in step 1.
// null means nothing selected yet — step 1 not completed.
type GameMode = 'vs-bot' | 'vs-friend' | null;

export const ModeSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
  const { t } = useLanguage();

  const { playerName, playerAvatar } = route.params;

  // selectedMode holds which mode the player picked in step 1.
  // null = nothing selected yet, difficulty section is hidden.
  // 'vs-bot' = difficulty section appears below.
  // 'vs-friend' = Coming Soon alert shown, mode resets to null.
  // Angular equivalent: a selectedMode property on the component class
  // that the template uses with *ngIf to show/hide the difficulty section.
  const [selectedMode, setSelectedMode] = useState<GameMode>(null);

  // onModeSelect handles step 1 — picking vs Bot or vs Friend.
  const onModeSelect = (mode: 'vs-bot' | 'vs-friend') => {
    if (mode === 'vs-friend') {
      // vs Friend is Coming Soon — show alert and do not update selectedMode.
      Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
      return;
    }
    // vs Bot selected — update state to show difficulty section.
    // React re-renders and the difficulty section appears below.
    // Angular equivalent: this.selectedMode = mode; (triggers *ngIf)
    setSelectedMode(mode);
  };

  // onDifficultySelect handles step 2 — picking Easy, Medium, or Hard.
  // Navigates to the game with all required params.
  const onDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigation.navigate('TicTacToe', {
      playerName,
      playerAvatar,
      difficulty,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Game title */}
      <AppText variant="h2" style={{ color: colors.primary }}>
        {TTT_CONFIG.name}
      </AppText>

      {/* ── STEP 1 — MODE SELECTION ───────────────────────── */}
<AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
            {t.modeSelect.title}
      </AppText>

      <View style={styles.modeRow}>

        {/* vs Bot button */}
        <AppButton
          label={t.modeSelect.vsBot}
          onPress={() => onModeSelect('vs-bot')}
          // Primary when selected, secondary when not.
          // Angular equivalent: [variant]="selectedMode === 'vs-bot' ? 'primary' : 'secondary'"
          variant={selectedMode === 'vs-bot' ? 'primary' : 'secondary'}
          style={styles.modeButton}
        />

        {/* vs Friend button — disabled, Coming Soon */}
        <AppButton
          label={t.modeSelect.vsFriend}
          onPress={() => onModeSelect('vs-friend')}
          // Ghost when not selected, stays ghost — disabled feel.
          variant="ghost"
          style={[
            styles.modeButton,
            // Visual indicator that this option is locked.
            { opacity: 0.5 },
          ] as any}
        />

      </View>

      {/* ── STEP 2 — DIFFICULTY SELECTION ────────────────── */}
      {/* Only shown after vs Bot is selected in step 1.      */}
      {/* Angular equivalent: *ngIf="selectedMode === 'vs-bot'" */}
      {selectedMode === 'vs-bot' && (
        <View style={[
          styles.difficultySection,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}>

          <AppText variant="body" style={[styles.difficultyLabel, { color: colors.textSecondary }] as any}>
            {t.modeSelect.difficultyTitle}
          </AppText>

          {/* Easy */}
          <AppButton
            label={t.modeSelect.easy}
            onPress={() => onDifficultySelect('easy')}
            variant="ghost"
            style={styles.difficultyButton}
          />

          {/* Medium */}
          <AppButton
            label={t.modeSelect.medium}
            onPress={() => onDifficultySelect('medium')}
            variant="secondary"
            style={styles.difficultyButton}
          />

          {/* Hard */}
          <AppButton
            label={t.modeSelect.hard}
            onPress={() => onDifficultySelect('hard')}
            variant="primary"
            style={styles.difficultyButton}
          />

        </View>
      )}

      {/* Back button */}
      <AppButton
        label={t.common.back}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  sectionTitle: {
    marginBottom: THEME.spacing.xs,
  },
  // Mode buttons sit side by side in a row.
  modeRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
    width: '100%',
  },
  modeButton: {
    flex: 1,  // Each mode button takes equal width.
  },
  // Difficulty section slides in below after vs Bot is selected.
  difficultySection: {
    width: '100%',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 0.5,
    padding: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  difficultyLabel: {
    marginBottom: THEME.spacing.xs,
  },
  difficultyButton: {
    width: '100%',
  },
  backButton: {
    marginTop: THEME.spacing.sm,
    width: '100%',
  },
});