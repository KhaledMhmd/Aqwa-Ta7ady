// ============================================================
// question-modal.component.tsx
// Modal shown when a player taps a cell.
// Timer counts down (or shows ∞), pauses on background.
// Uses useTheme() for dynamic colours.
// Angular equivalent: MatDialog component.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  TextInput,
  Animated,
  AppState,
  AppStateStatus,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { CellQuestion } from '../types/game.types';
import { AppText } from '../../../core/components/app-text.component';
import { AppButton } from '../../../core/components/app-button.component';
import { useTheme } from '../../../core/theme/theme.context';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';
import { useLanguage } from '../../../core/i18n/language.context';

type Props = {
  isVisible: boolean;
  question: CellQuestion | null;
  isWrongAnswer: boolean;
  isAlreadyUsed: boolean;    // Add this line.
  timeLimitEnabled: boolean;
  onSubmit: (answer: string) => void;
  onClose: () => void;
};

export const QuestionModal = ({
  isVisible,
  question,
  isWrongAnswer,
  isAlreadyUsed,    // Add this line.
  timeLimitEnabled,
  onSubmit,
  onClose,
}: Props) => {
  const { colors } = useTheme();
  const { t } = useLanguage();
  const [answer, setAnswer] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(TTT_CONFIG.turnTimeLimitSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // Reset state when modal opens or closes.
  useEffect(() => {
    if (isVisible) {
      setAnswer('');
      setTimeLeft(TTT_CONFIG.turnTimeLimitSeconds);
      setIsTimerRunning(timeLimitEnabled);
    } else {
      setIsTimerRunning(false);
      clearTimerInterval();
    }
  }, [isVisible]);

  // Countdown timer.
  useEffect(() => {
    if (!isTimerRunning || !timeLimitEnabled) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearTimerInterval();
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearTimerInterval();
  }, [isTimerRunning, timeLimitEnabled]);

  // Pause/resume timer based on app state.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        setIsTimerRunning(false);
      } else if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isVisible && timeLimitEnabled) setIsTimerRunning(true);
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [isVisible, timeLimitEnabled]);

  // Shake animation on wrong answer.
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

  const clearTimerInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSubmit = () => {
    if (answer.trim().length === 0) return;
    onSubmit(answer);
  };

  const getTimerColor = (): string => {
    if (timeLeft > 20) return colors.success;
    if (timeLeft > 10) return colors.warning;
    return colors.error;
  };

  if (!question) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
            <View style={[styles.overlay, { backgroundColor: colors.modalOverlay }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={[styles.card, { backgroundColor: colors.surface, borderTopColor: colors.primary }]}>

            {/* Timer */}
            <View style={styles.timerContainer}>
              {timeLimitEnabled ? (
                <AppText variant="h2" style={[styles.timerText, { color: getTimerColor() }] as any}>
                  {timeLeft}
                </AppText>
              ) : (
                <AppText variant="h2" style={{ color: colors.textSecondary, fontSize: 32 }}>
                  ∞
                </AppText>
              )}
            </View>

            {/* Question */}
            <AppText variant="caption" style={{ textAlign: 'center', color: colors.textSecondary }}>
              {t.game.nameAPlayer}
            </AppText>

            <View style={styles.clubsRow}>
              <AppText variant="h3" style={{ color: colors.primary, textAlign: 'center' }}>
                {question.rowHeader.label}
              </AppText>
              <AppText variant="body" style={{ color: colors.textSecondary }}>{t.game.andConnector}</AppText>
              <AppText variant="h3" style={{ color: colors.primary, textAlign: 'center' }}>
                {question.colHeader.label}
              </AppText>
            </View>

            {/* Answer input */}
            <Animated.View style={[styles.inputContainer, { transform: [{ translateX: shakeAnim }] }]}>
              <TextInput
                style={[styles.input, {
                  backgroundColor: colors.surfaceLight,
                  color: colors.textPrimary,
                  borderColor: isWrongAnswer ? colors.error : colors.border,
                }]}
                placeholder={t.game.placeholder}
                placeholderTextColor={colors.textSecondary}
                value={answer}
                onChangeText={setAnswer}
                autoFocus={true}
                autoCapitalize="words"
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
              {/* Wrong answer message — shown when answer does not match. */}
{isWrongAnswer && (
  <AppText
    variant="caption"
    style={{ color: colors.error, textAlign: 'center' }}
  >
    {t.game.wrongAnswer}
  </AppText>
)}

{/* Already used message — shown when answer is correct but
    already used on another cell. Player keeps their turn
    and can try a different name. */}
{isAlreadyUsed && (
  <AppText
    variant="caption"
    style={{ color: colors.warning, textAlign: 'center' }}
  >
    {t.game.alreadyUsed}
  </AppText>
)}
            </Animated.View>

            {/* Buttons */}
            <View style={styles.buttonsRow}>
              <AppButton label={t.game.skip} onPress={onClose} variant="ghost" style={styles.skipButton} />
              <AppButton
                label={t.game.submit}
                onPress={handleSubmit}
                disabled={answer.trim().length === 0}
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
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    width: '100%',
  },
  card: {
    borderTopLeftRadius: THEME.borderRadius.lg,
    borderTopRightRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.lg,
    gap: THEME.spacing.md,
    borderTopWidth: 3,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerText: {
    fontWeight: THEME.fontWeights.bold,
  },
  clubsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    flexWrap: 'wrap',
  },
  inputContainer: {
    gap: THEME.spacing.xs,
  },
  input: {
    height: 48,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.fontSizes.md,
    borderWidth: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },
  skipButton: { flex: 1 },
  submitButton: { flex: 2 },
});