// ============================================================
// question-modal.component.tsx
// The modal shown when a player taps a cell.
// Contains: question text, answer input, timer, submit button.
// Timer shows countdown if enabled, ∞ symbol if disabled.
// Timer pauses when app goes to background, resumes on return.
// Timer auto-closes modal and switches turn when it hits 0.
// Angular equivalent: a MatDialog component with @Inject(MAT_DIALOG_DATA)
// for the question and DialogRef to close programmatically.
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,           // Full-screen overlay. Equivalent to a dialog/modal in Angular Material.
  View,
  StyleSheet,
  TextInput,
  Animated,        // For the shake animation on wrong answer.
  AppState,        // Detects when app goes to background or foreground.
                   // Angular equivalent: document visibility API or
                   // a custom service listening to window focus/blur events.
  AppStateStatus,  // TypeScript type for AppState values:
                   // 'active' = foreground, 'background' = backgrounded,
                   // 'inactive' = transitioning (e.g. during a call).
  KeyboardAvoidingView, // Moves content up when keyboard appears.
                        // Angular equivalent: CSS adjustments for mobile keyboards.
  Platform,        // Tells us if we are on iOS or Android.
                   // Some behaviours differ between platforms.
} from 'react-native';

import { CellQuestion } from '../types/game.types';
import { AppText } from '../../../core/components/app-text.component';
import { AppButton } from '../../../core/components/app-button.component';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

type Props = {
  // Whether the modal is currently visible.
  isVisible: boolean;

  // The question to display — null when modal is closed.
  question: CellQuestion | null;

  // Whether the player's last answer was wrong.
  // Used to trigger the shake animation.
  isWrongAnswer: boolean;

  // Whether the time limit setting is enabled.
  timeLimitEnabled: boolean;

  // Called when the player submits their answer.
  onSubmit: (answer: string) => void;

  // Called when the modal is closed without an answer
  // or when the timer runs out.
  onClose: () => void;
};

export const QuestionModal = ({
  isVisible,
  question,
  isWrongAnswer,
  timeLimitEnabled,
  onSubmit,
  onClose,
}: Props) => {

  // The text the player is currently typing.
  const [answer, setAnswer] = useState<string>('');

  // Time remaining in seconds — starts at the configured limit.
  const [timeLeft, setTimeLeft] = useState<number>(
    TTT_CONFIG.turnTimeLimitSeconds
  );

  // Whether the timer is currently running.
  // Set to false when app goes to background, true when it returns.
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // shakeAnim controls the horizontal shake on wrong answer.
  // Animated.Value(0) = no shake, animated to left/right on wrong answer.
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // timerRef holds the setInterval ID so we can clear it when needed.
  // useRef persists this value across re-renders without causing re-renders.
  // Angular equivalent: a private timerInterval property on the class.
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // appStateRef tracks the last known AppState to detect changes.
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  // ── RESET STATE WHEN MODAL OPENS ────────────────────────
  // useEffect watches isVisible — when modal opens, reset everything.
  // Angular equivalent: ngOnChanges() reacting to isVisible changing.
  useEffect(() => {
    if (isVisible) {
      // Clear the answer input.
      setAnswer('');
      // Reset timer to full duration.
      setTimeLeft(TTT_CONFIG.turnTimeLimitSeconds);
      // Start the timer only if time limit is enabled.
      setIsTimerRunning(timeLimitEnabled);
    } else {
      // Modal closed — stop the timer.
      setIsTimerRunning(false);
      clearTimerInterval();
    }
  }, [isVisible]);

  // ── TIMER COUNTDOWN ─────────────────────────────────────
  // useEffect watches isTimerRunning and timeLeft.
  // When timer is running, decrement timeLeft every second.
  useEffect(() => {
    if (!isTimerRunning || !timeLimitEnabled) return;

    // Start a new interval that fires every 1000ms (1 second).
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time is up — stop the timer and close the modal.
          clearTimerInterval();
          // onClose switches the turn — same as dismissing the modal.
          onClose();
          return 0;
        }
        // Decrement by 1 second.
        return prev - 1;
      });
    }, 1000);

    // Cleanup — clear the interval when this effect re-runs or unmounts.
    // Angular equivalent: ngOnDestroy() { clearInterval(this.timerInterval) }
    return () => clearTimerInterval();
  }, [isTimerRunning, timeLimitEnabled]);

  // ── APPSTATE DETECTION ──────────────────────────────────
  // useEffect sets up an AppState listener when the modal mounts.
  // AppState fires whenever the app moves between foreground/background.
  useEffect(() => {
    // Subscribe to AppState changes.
    // Angular equivalent: listening to document.visibilitychange event.
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (
          // App was active and is now going to background or inactive.
          appStateRef.current === 'active' &&
          nextAppState.match(/inactive|background/)
        ) {
          // Pause the timer — player is not looking at the screen.
          setIsTimerRunning(false);
        } else if (
          // App was in background and is now active again.
          appStateRef.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // Resume the timer only if the modal is still open
          // and time limit is enabled.
          if (isVisible && timeLimitEnabled) {
            setIsTimerRunning(true);
          }
        }
        // Update the ref to the new state.
        appStateRef.current = nextAppState;
      }
    );

    // Cleanup — remove the listener when modal unmounts.
    // Angular equivalent: ngOnDestroy() { this.subscription.unsubscribe() }
    return () => subscription.remove();
  }, [isVisible, timeLimitEnabled]);

  // ── WRONG ANSWER SHAKE ANIMATION ────────────────────────
  // useEffect watches isWrongAnswer — triggers shake when true.
  // Angular equivalent: ngOnChanges() triggering an animation.
  useEffect(() => {
    if (isWrongAnswer) {
      // Animated.sequence plays each animation one after another.
      // This creates a left-right shake effect.
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [isWrongAnswer]);

  // ── HELPERS ─────────────────────────────────────────────

  // Clears the countdown interval safely.
  const clearTimerInterval = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  // Called when the player presses the Submit button.
  // Angular equivalent: onSubmit() bound to a form's (ngSubmit).
  const handleSubmit = () => {
    if (answer.trim().length === 0) return;
    onSubmit(answer);
  };

  // Determines the timer display colour based on time remaining.
  // Green when plenty of time, amber when running low, red when critical.
  const getTimerColor = (): string => {
    if (timeLeft > 20) return THEME.colors.success;
    if (timeLeft > 10) return THEME.colors.warning;
    return THEME.colors.error;
  };

  // Do not render anything if there is no question loaded.
  if (!question) return null;

  return (
    // Modal is React Native's full-screen overlay component.
    // visible controls whether it is shown or hidden.
    // transparent={true} lets the background show through.
    // Angular equivalent: a MatDialog opened/closed programmatically.
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"  // Slides up from the bottom when opening.
      // onRequestClose handles the Android back button press.
      onRequestClose={onClose}
    >
      {/* Semi-transparent dark overlay behind the modal card */}
      <View style={styles.overlay}>

        {/* KeyboardAvoidingView shifts the modal up when the keyboard appears.
            behavior differs between iOS and Android.
            Angular equivalent: CSS padding-bottom adjustment on keyboard events. */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* The white modal card */}
          <View style={styles.card}>

            {/* ── TIMER ───────────────────────────────────── */}
            <View style={styles.timerContainer}>
              {timeLimitEnabled ? (
                // Show countdown number when time limit is enabled.
                <AppText
                  variant="h2"
                  style={[styles.timerText, { color: getTimerColor() }]as any}
                >
                  {timeLeft}
                </AppText>
              ) : (
                // Show infinity symbol when time limit is disabled.
                <AppText variant="h2" style={styles.infinityText}>
                  ∞
                </AppText>
              )}
            </View>

            {/* ── QUESTION ────────────────────────────────── */}
            <AppText variant="caption" style={styles.questionPrompt}>
              Name a player who played for both
            </AppText>

            {/* The two clubs for this cell */}
            <View style={styles.clubsRow}>
              <AppText variant="h3" style={styles.clubName}>
                {question.rowHeader.label}
              </AppText>
              <AppText variant="body" style={styles.andText}>
                &
              </AppText>
              <AppText variant="h3" style={styles.clubName}>
                {question.colHeader.label}
              </AppText>
            </View>

            {/* ── ANSWER INPUT ────────────────────────────── */}
            {/* Animated.View applies the shake animation to the input */}
            <Animated.View
              style={[
                styles.inputContainer,
                // translateX moves the element left/right.
                // shakeAnim value controls how far it moves.
                { transform: [{ translateX: shakeAnim }] },
              ]}
            >
              <TextInput
                style={[
                  styles.input,
                  // Red border when the last answer was wrong.
                  isWrongAnswer && styles.inputError,
                ]}
                placeholder="Type player name..."
                placeholderTextColor={THEME.colors.textSecondary}
                value={answer}
                onChangeText={setAnswer}
                // autoFocus opens the keyboard immediately when modal appears.
                autoFocus={true}
                autoCapitalize="words"
                // onSubmitEditing fires when the user presses Enter/Done on keyboard.
                // Angular equivalent: (keydown.enter)="handleSubmit()"
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
              />
              {/* Wrong answer feedback text */}
              {isWrongAnswer && (
                <AppText variant="caption" style={styles.errorText}>
                  Wrong answer — try again!
                </AppText>
              )}
            </Animated.View>

            {/* ── BUTTONS ─────────────────────────────────── */}
            <View style={styles.buttonsRow}>
              {/* Skip button — closes modal, switches turn */}
              <AppButton
                label="Skip"
                onPress={onClose}
                variant="ghost"
                style={styles.skipButton}
              />
              {/* Submit button */}
              <AppButton
                label="Submit"
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
  // Full screen semi-transparent overlay.
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // 70% dark overlay.
    justifyContent: 'flex-end',             // Align card to bottom of screen.
  },

  keyboardView: {
    width: '100%',
  },

  // The modal card itself — white rounded rectangle at the bottom.
  card: {
    backgroundColor: THEME.colors.surface,
    borderTopLeftRadius: THEME.borderRadius.lg,
    borderTopRightRadius: THEME.borderRadius.lg,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.lg,
    gap: THEME.spacing.md,
    // Small line at the top of the card — visual drag handle indicator.
    borderTopWidth: 3,
    borderTopColor: THEME.colors.primary,
  },

  timerContainer: {
    alignItems: 'center',
  },

  timerText: {
    fontWeight: THEME.fontWeights.bold,
  },

  infinityText: {
    color: THEME.colors.textSecondary,
    fontSize: 32,
  },

  questionPrompt: {
    textAlign: 'center',
    color: THEME.colors.textSecondary,
  },

  clubsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.sm,
    flexWrap: 'wrap',
  },

  clubName: {
    color: THEME.colors.primary,
    textAlign: 'center',
  },

  andText: {
    color: THEME.colors.textSecondary,
  },

  inputContainer: {
    gap: THEME.spacing.xs,
  },

  input: {
    height: 48,
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    color: THEME.colors.textPrimary,
    fontSize: THEME.fontSizes.md,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },

  inputError: {
    borderColor: THEME.colors.error,
  },

  errorText: {
    color: THEME.colors.error,
    textAlign: 'center',
  },

  buttonsRow: {
    flexDirection: 'row',
    gap: THEME.spacing.sm,
  },

  skipButton: {
    flex: 1,
  },

  submitButton: {
    flex: 2,
  },
});