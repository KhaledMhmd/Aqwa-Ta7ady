// ── React Native ──────────────────────────────────────

// ============================================================
// question-modal.component.tsx
// Modal shown when a player taps a cell.
// Displays the question (two clubs) and collects the answer.
// Timer is NO LONGER managed here — it lives in game.hook.ts
// and displays on the turn indicator instead.
// Uses useTheme() for dynamic colours.
// Angular equivalent: MatDialog component.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';        // React core + hooks.
import {
  Modal,                                                             // Full-screen overlay.
  View,                                                              // Container.
  StyleSheet,                                                        // Styles.
  TextInput,                                                         // Text input for the answer.
  Animated,                                                          // Shake animation.
  KeyboardAvoidingView,                                              // Pushes content above keyboard.
  Platform,                                                          // iOS vs Android detection.
} from 'react-native';
import { CellQuestion } from '../types/game.types';                  // Question type.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { AppButton } from '../../../core/components/app-button.component'; // Themed button.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing.
import { useLanguage } from '../../../core/i18n/language.context';  // Translations.

// Props type — what GameScreen passes in.
// timeLimitEnabled and timer state are REMOVED — timer lives in game.hook.ts now.
type Props = {
  isVisible: boolean;                                                // Controls modal visibility.
  question: CellQuestion | null;                                     // The question for the selected cell.
  isWrongAnswer: boolean;                                            // Triggers shake animation.
  isAlreadyUsed: boolean;                                            // Shows "already used" message.
  onSubmit: (answer: string) => void;                                // Called when player presses Submit.
  onClose: () => void;                                               // Called when player presses Skip.
};

export const QuestionModal = ({
  isVisible,
  question,
  isWrongAnswer,
  isAlreadyUsed,
  onSubmit,
  onClose,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { t } = useLanguage();                                       // Translations.
  const [answer, setAnswer] = useState<string>('');                  // Current text input value.

  // Shake animation ref — triggers horizontal shake on wrong answer.
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Reset answer text when modal opens or closes.
  // Angular equivalent: ngOnChanges watching isVisible.
  useEffect(() => {
    if (isVisible) {
      setAnswer('');                                                  // Clear previous answer on open.
    }
  }, [isVisible]);

  // Trigger shake animation when a wrong answer is submitted.
  // Angular equivalent: a CSS animation triggered by [class.shake].
  useEffect(() => {
    if (isWrongAnswer) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isWrongAnswer]);

  // Handles the Submit button press.
  // Ignores empty answers.
  const handleSubmit = () => {
    if (answer.trim().length === 0) return;                          // Don't submit empty answers.
    onSubmit(answer);                                                // Pass answer to game.hook.ts.
  };

  // Don't render anything if there's no question loaded.
  if (!question) return null;

  return (
    <Modal
      visible={isVisible}                                            // Show/hide the modal.
      transparent={true}                                             // Background is semi-transparent.
      animationType="slide"                                          // Slides up from the bottom.
      onRequestClose={onClose}                                       // Android back button closes modal.
    >
      <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}   // iOS pushes up, Android resizes.
          style={styles.keyboardView}
        >
          <View style={[styles.card, { backgroundColor: colors.surface, borderTopColor: colors.primary }]}>

            {/* Question — "Name a player who played for both" */}
            <AppText variant="caption" style={{ textAlign: 'center', color: colors.textSecondary }}>
              {t.game.nameAPlayer}
            </AppText>

            {/* Club names — "Arsenal & Chelsea" */}
            <View style={styles.clubsRow}>
              <AppText variant="h3" style={{ color: colors.primary, textAlign: 'center' }}>
                {question.rowHeader.label}
              </AppText>
              <AppText variant="body" style={{ color: colors.textSecondary }}>{t.game.andConnector}</AppText>
              <AppText variant="h3" style={{ color: colors.primary, textAlign: 'center' }}>
                {question.colHeader.label}
              </AppText>
            </View>

            {/* Answer input with shake animation */}
            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.surfaceLight,              // Input background from theme.
                  color: colors.textPrimary,                         // Input text colour from theme.
                  borderColor: isWrongAnswer ? colors.error : colors.border, // Red border on wrong answer.
                }]}
                placeholder={t.game.placeholder}                     // "Type player name..."
                placeholderTextColor={colors.textSecondary}          // Muted placeholder colour.
                value={answer}                                       // Controlled input value.
                onChangeText={setAnswer}                             // Update state on every keystroke.
                autoFocus={true}                                     // Focus input immediately when modal opens.
                autoCapitalize="words"                               // Capitalise first letter of each word.
                onSubmitEditing={handleSubmit}                       // Submit on keyboard "Done" press.
                returnKeyType="done"                                 // Show "Done" on keyboard.
              />

              {/* Wrong answer message */}
              {isWrongAnswer && (
                <AppText variant="caption" style={{ color: colors.error, textAlign: 'center' }}>
                  {t.game.wrongAnswer}
                </AppText>
              )}

              {/* Already used message */}
              {isAlreadyUsed && (
                <AppText variant="caption" style={{ color: colors.warning, textAlign: 'center' }}>
                  {t.game.alreadyUsed}
                </AppText>
              )}
            </Animated.View>

            {/* Buttons — Skip and Submit */}
            <View style={styles.buttonsRow}>
              <AppButton label={t.game.skip} onPress={onClose} variant="ghost" style={styles.skipButton} />
              <AppButton
                label={t.game.submit}
                onPress={handleSubmit}
                disabled={answer.trim().length === 0}                // Disable when input is empty.
                style={styles.submitButton}
              />
            </View>

          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Semi-transparent background — covers the entire screen behind the modal.
  overlay: {
    flex: 1,                                           // Full screen.
    justifyContent: 'flex-end',                        // Modal card sits at the bottom.
  },
  // Keyboard avoiding wrapper — full width.
  keyboardView: {
    width: '100%',
  },
  // Modal card — the white/dark panel with the question and input.
  card: {
    borderTopLeftRadius: THEME.borderRadius.lg,        // 16 — rounded top corners.
    borderTopRightRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.xl,               // 32 — generous side padding.
    paddingVertical: THEME.spacing.lg,                 // 24 — vertical padding.
    gap: THEME.spacing.md,                             // 16 — space between sections.
    borderTopWidth: 3,                                 // Coloured top accent line.
  },
  // Club names row — "Arsenal & Chelsea" side by side.
  clubsRow: {
    flexDirection: 'row',                              // Side by side.
    alignItems: 'center',                              // Vertically centered.
    justifyContent: 'center',                          // Horizontally centered.
    gap: THEME.spacing.sm,                             // 8 — gap between club names.
    flexWrap: 'wrap',                                  // Wrap to next line if names are long.
  },
  // Input container — holds the TextInput and error messages.
  inputContainer: {
    gap: THEME.spacing.xs,                             // 4 — gap between input and error text.
  },
  // Text input field.
  input: {
    height: 48,                                        // Fixed height for consistent sizing.
    borderRadius: THEME.borderRadius.md,               // 8 — rounded corners.
    paddingHorizontal: THEME.spacing.md,               // 16 — inner horizontal padding.
    fontSize: THEME.fontSizes.md,                      // 14 — default text size.
    borderWidth: 1,                                    // Subtle border.
  },
  // Buttons row — Skip and Submit side by side.
  buttonsRow: {
    flexDirection: 'row',                              // Side by side.
    gap: THEME.spacing.sm,                             // 8 — gap between buttons.
  },
  // Skip button takes 1/3 of the row.
  skipButton: { flex: 1 },
  // Submit button takes 2/3 of the row.
  submitButton: { flex: 2 },
});