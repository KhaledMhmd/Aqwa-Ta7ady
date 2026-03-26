// ============================================================
// turn-indicator.component.tsx
// Shows both players with the active one highlighted.
// Uses useTheme() for dynamic colours.
// Angular equivalent: TurnIndicatorComponent with @Input() props.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Player } from '../../../core/types/player.types';
import { AppText } from '../../../core/components/app-text.component';
import { AppAvatar } from '../../../core/components/app-avatar.component';
import { useTheme } from '../../../core/theme/theme.context';
import { THEME } from '../../../core/theme/theme.config';

type Props = {
  player1: Player;
  player2: Player;
  currentPlayer: Player;
  isGameOver: boolean;
};

export const TurnIndicator = ({
  player1,
  player2,
  currentPlayer,
  isGameOver,
}: Props) => {
  const { colors } = useTheme();

  // True if the given player is the active one.
  const isActive = (player: Player) => player.id === currentPlayer.id;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>

      {/* Player 1 card */}
      <View style={[
        styles.playerCard,
        { backgroundColor: isActive(player1) ? colors.surfaceLight : 'transparent' },
        !isActive(player1) && styles.inactiveCard,
      ]}>
        <AppAvatar avatar={player1.avatar} color={player1.color} size="sm" />
        <AppText
          variant="caption"
          style={{ fontWeight: THEME.fontWeights.bold, color: isActive(player1) ? colors.textPrimary : colors.textSecondary }}
        >
          {player1.name}
        </AppText>
        {isActive(player1) && !isGameOver && (
          <AppText variant="label" style={{ color: colors.primary, fontWeight: THEME.fontWeights.bold }}>
            Your turn
          </AppText>
        )}
      </View>

      {/* Center VS / END */}
      <View style={styles.center}>
        <AppText variant="caption" style={{ color: colors.textSecondary, fontWeight: THEME.fontWeights.bold }}>
          {isGameOver ? 'END' : 'VS'}
        </AppText>
      </View>

      {/* Player 2 / Bot card */}
      <View style={[
        styles.playerCard,
        { backgroundColor: isActive(player2) ? colors.surfaceLight : 'transparent' },
        !isActive(player2) && styles.inactiveCard,
      ]}>
        <AppAvatar avatar={player2.avatar} color={player2.color} size="sm" />
        <AppText
          variant="caption"
          style={{ fontWeight: THEME.fontWeights.bold, color: isActive(player2) ? colors.textPrimary : colors.textSecondary }}
        >
          {player2.name}
        </AppText>
        {isActive(player2) && !isGameOver && (
          <AppText variant="label" style={{ color: colors.primary, fontWeight: THEME.fontWeights.bold }}>
            {player2.type === 'bot' ? 'Thinking...' : 'Your turn'}
          </AppText>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: THEME.borderRadius.lg,
    marginHorizontal: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
  },
  playerCard: {
    flex: 1,
    alignItems: 'center',
    gap: THEME.spacing.xs,
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.sm,
  },
  inactiveCard: {
    opacity: 0.5,
  },
  center: {
    paddingHorizontal: THEME.spacing.sm,
  },
});