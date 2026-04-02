// ── React Native ──────────────────────────────────────

// ============================================================
// turn-indicator.component.tsx
// Shows both players with the active one highlighted.
// Displays countdown timer beneath the active player's name.
// Timer changes colour as time gets low: green → yellow → red.
// Uses useTheme() for dynamic colours.
// Angular equivalent: TurnIndicatorComponent with @Input() props.
// ============================================================

import React from 'react';                                          // React core — needed for JSX.
import { View, StyleSheet } from 'react-native';                    // Layout components.
import { Player } from '../../../core/types/player.types';          // Player type.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { AppAvatar } from '../../../core/components/app-avatar.component'; // Avatar component.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing/font values.
import { useLanguage } from '../../../core/i18n/language.context';  // Translations.

// Props type — what GameScreen passes in.
// Angular equivalent: @Input() decorators.
type Props = {
  player1: Player;                                                   // Player 1 object.
  player2: Player;                                                   // Player 2 / bot object.
  currentPlayer: Player;                                             // Whose turn it is right now.
  isGameOver: boolean;                                               // Whether the game has ended.
  timeLeft: number;                                                  // Seconds remaining in the current turn.
  timeLimitEnabled: boolean;                                         // Whether the timer is active.
};

export const TurnIndicator = ({
  player1,
  player2,
  currentPlayer,
  isGameOver,
  timeLeft,
  timeLimitEnabled,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { t } = useLanguage();                                       // Translations.

  // Returns true if the given player is the active one.
  // Angular equivalent: a method called from the template with [class.active].
  const isActive = (player: Player) => player.id === currentPlayer.id;

  // Returns the timer colour based on remaining time.
  // Green when plenty of time, yellow when getting low, red when critical.
  // Angular equivalent: a getter that returns a CSS class name.
  const getTimerColor = (): string => {
    if (timeLeft > 30) return colors.success;                        // > 30s — green, plenty of time.
    if (timeLeft > 15) return colors.warning;                        // 15-30s — yellow, getting low.
    return colors.error;                                             // < 15s — red, critical.
  };

  // Formats seconds into a readable timer string.
  // Shows "∞" when timer is disabled.
  // Angular equivalent: a pipe or getter that formats the time.
  const formatTime = (): string => {
    if (!timeLimitEnabled) return '∞';                               // Timer disabled — show infinity.
    return `${timeLeft}s`;                                           // e.g. "45s"
  };

  // Renders one player card — avatar, name, turn label, and timer.
  // Extracted to avoid duplicating the same JSX for player1 and player2.
  // Angular equivalent: a child component or ng-template.
  const renderPlayerCard = (player: Player) => {
    const active = isActive(player);                                 // Is this player's turn?
    const isBotThinking = active && !isGameOver && player.type === 'bot'; // Bot's turn — show "Thinking..."

    return (
      <View style={[
        styles.playerCard,                                           // Base card layout.
        { backgroundColor: active ? colors.surfaceLight : 'transparent' }, // Highlight if active.
        !active && styles.inactiveCard,                              // Dim if not active.
      ]}>
        {/* Player avatar */}
        <AppAvatar avatar={player.avatar} color={player.color} size="sm" />

        <AppText
  variant="caption"
  style={{
    fontWeight: THEME.fontWeights.bold,
    color: active ? colors.textPrimary : colors.textSecondary,
    textAlign: 'center',
  }}
>
  {player.name}
  {active && !isGameOver && (
    <AppText
      variant="caption"
      style={{ color: colors.primary, fontWeight: THEME.fontWeights.bold }}
    >
      {` (${isBotThinking ? t.game.thinking : t.game.yourTurn})`}
    </AppText>
  )}
</AppText>

        {/* Timer — shown beneath the active HUMAN player only.
            Not shown for bot (bot doesn't have a timer).
            Not shown when game is over. */}
        {active && !isGameOver && player.type !== 'bot' && (
          <AppText
            variant="caption"
            style={{
              color: timeLimitEnabled ? getTimerColor() : colors.textSecondary, // Colour-coded when enabled.
              fontWeight: THEME.fontWeights.bold,
              fontSize: THEME.fontSizes.lg,                          // 16 — larger than caption for visibility.
            }}
          >
            {formatTime()}
          </AppText>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>

      {/* Player 1 card */}
      {renderPlayerCard(player1)}

      {/* Center VS / END label */}
      <View style={[styles.center, styles.width50]}>
        <AppText variant="caption" style={{textAlign: 'center', color: colors.textSecondary, fontWeight: THEME.fontWeights.bold }}>
          {t.game.vsLabel}
        </AppText>
      </View>

      {/* Player 2 / Bot card */}
      {renderPlayerCard(player2)}

    </View>
  );
};

const styles = StyleSheet.create({
  // Outer container — holds both player cards and the VS label.
  container: {
    flexDirection: 'row',                              // Side by side layout.
    alignItems: 'center',                              // Vertically center all items.
    paddingHorizontal: THEME.spacing.md,               // 16 — side padding.
    paddingVertical: THEME.spacing.sm,                 // 8 — top/bottom padding.
    borderRadius: THEME.borderRadius.lg,               // 16 — rounded corners.
    marginHorizontal: THEME.spacing.md,                // 16 — side margin from screen edge.
    marginVertical: THEME.spacing.sm,                  // 8 — vertical margin.
  },
  // Each player card — avatar, name, label, timer stacked vertically.
  playerCard: {
    flex: 1,                                           // Each card takes equal width.
    alignItems: 'center',                              // Center content horizontally.
    gap: THEME.spacing.xs,                             // 4 — small gap between items.
    paddingVertical: THEME.spacing.xs,                 // 4 — small vertical padding.
    borderRadius: THEME.borderRadius.md,               // 8 — rounded corners.
    paddingHorizontal: THEME.spacing.sm,               // 8 — small side padding.
  },
  // Inactive player card — dimmed opacity.
  inactiveCard: {
    opacity: 0.5,                                      // Faded when not active.
  },
  // VS / END label container — sits between the two player cards.
  center: {
    paddingHorizontal: THEME.spacing.sm,               // 8 — padding around the label.
  },
  width50: {
    width: 50,                                         // Fixed width for the center label.
  },
});