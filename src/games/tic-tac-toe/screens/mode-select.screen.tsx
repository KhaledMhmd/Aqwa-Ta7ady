// ============================================================
// mode-select.screen.tsx
// Step 1: Player picks vs Bot or vs Friend.
// Step 2: If vs Bot selected, difficulty options appear below.
// vs Friend is disabled in Phase 1 — Coming Soon.
// Header pattern: ← back | title | spacer (matches game.screen.tsx).
// Angular equivalent: ModeSelectComponent with conditional rendering.
// ============================================================

import React, { useState } from 'react';                            // React core + state hook.
import { View, StyleSheet, Alert } from 'react-native';             // Layout + alert.
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.
import { RootStackParamList } from '../../../navigation/app.navigator'; // Route types.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { AppButton } from '../../../core/components/app-button.component'; // Themed button.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { useLanguage } from '../../../core/i18n/language.context';  // Translations.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing.
import { TTT_CONFIG } from '../config/game.config';                 // Game name.
import { AppBackButton } from '../../../core/components/app-back-button.component';

// ── Angular equivalent ────────────────────────────────
// In Angular: ModeSelectComponent with *ngIf="selectedMode === 'vs-bot'"
// and a shared <app-header> component.

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
      Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);  // vs Friend is locked.
      return;
    }
    setSelectedMode(mode);                                           // Show difficulty section.
  };

  // Step 2 — picking Easy, Medium, or Hard. Navigates to game.
  const onDifficultySelect = (difficulty: 'easy' | 'medium' | 'hard') => {
    navigation.navigate('TicTacToe', {
      playerName,
      playerAvatar,
      difficulty,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      {/* direction: 'ltr' keeps ← on the left even in Arabic RTL mode. */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {TTT_CONFIG.name}
        </AppText>
        {/* Empty spacer — same width as back button to center the title. */}
        <View style={styles.headerBackButton} />
      </View>

      {/* ── CONTENT — centered in remaining space ──────── */}
      <View style={styles.content}>

        {/* Step 1 — Mode selection title. */}
        <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>
          {t.modeSelect.title}
        </AppText>

        {/* Mode buttons row. */}
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

      </View>
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
    width: 44,                                            // Matches game.screen.tsx.
  },
  // Content area — centered vertically in remaining space.
  content: {
    flex: 1,                                                         // Fill remaining space below header.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'center',                                        // Center vertically.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    gap: THEME.spacing.md,                                           // 16 — gap between elements.
  },
  // Section title spacing.
  sectionTitle: {
    marginBottom: THEME.spacing.xs,                                  // 4 — small gap below.
  },
  // Mode buttons row.
  modeRow: {
    flexDirection: 'row',                                            // Side by side.
    gap: THEME.spacing.sm,                                           // 8 — gap between buttons.
    width: '100%',                                                   // Full width.
  },
  // Each mode button takes equal width.
  modeButton: {
    flex: 1,
  },
  // Difficulty section card.
  difficultySection: {
    width: '100%',                                                   // Full width.
    borderRadius: THEME.borderRadius.lg,                             // 16 — rounded corners.
    borderWidth: 0.5,                                                // Subtle border.
    padding: THEME.spacing.md,                                       // 16 — inner padding.
    gap: THEME.spacing.sm,                                           // 8 — gap between buttons.
  },
  // Difficulty label spacing.
  difficultyLabel: {
    marginBottom: THEME.spacing.xs,
  },
  // Difficulty button — full width.
  difficultyButton: {
    width: '100%',
  },
});