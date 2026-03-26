// ============================================================
// turn-indicator.component.tsx
// Displays both players at the top of the game screen.
// The active player is highlighted, the inactive one is dimmed.
// Angular equivalent: a TurnIndicatorComponent with @Input()
// for player1, player2, and currentPlayer.
// ============================================================

import React from 'react';
import {
  View,       // Layout container. Equivalent to <div>.
  StyleSheet, // Styles definition. Equivalent to .scss file.
} from 'react-native';

import { Player } from '../../../core/types/player.types';
import { AppText } from '../../../core/components/app-text.component';
import { AppAvatar } from '../../../core/components/app-avatar.component';
import { THEME } from '../../../core/theme/theme.config';

// Props this component receives from its parent (game.screen.tsx).
// Angular equivalent: @Input() properties on the component class.
type Props = {
  player1: Player;       // The first player — always human in Phase 1.
  player2: Player;       // The second player — always Bot in Phase 1.
  currentPlayer: Player; // Whoever's turn it is right now.
  isGameOver: boolean;   // When true, show "Game Over" instead of turn info.
};

export const TurnIndicator = ({
  player1,
  player2,
  currentPlayer,
  isGameOver,
}: Props) => {

  // Helper that returns true if the given player is the active one.
  // Used to apply active/inactive styles to each player card.
  // Angular equivalent: a method called from [class.active] binding.
  const isActive = (player: Player) =>
    player.id === currentPlayer.id;

  return (
    <View style={styles.container}>

      {/* Player 1 card */}
      <View style={[
        styles.playerCard,
        // Apply active style if it is player 1's turn, inactive if not.
        // Angular equivalent: [class.active]="isActive(player1)"
        isActive(player1) ? styles.activeCard : styles.inactiveCard,
      ]}>
        {/* Avatar with player's colour */}
        <AppAvatar
          avatar={player1.avatar}
          color={player1.color}
          size="sm"
        />
        {/* Player name */}
        <AppText
  variant="caption"
  style={[
    styles.playerName,
    !isActive(player2) && styles.inactiveText,
  ] as any}
>
          {player1.name}
        </AppText>
        {/* "Your turn" label — only visible on the active player's card */}
        {isActive(player1) && !isGameOver && (
          <AppText variant="label" style={styles.turnLabel}>
            Your turn
          </AppText>
        )}
      </View>

      {/* Center divider — shows VS or Game Over */}
      <View style={styles.center}>
        <AppText variant="caption" style={styles.vsText}>
          {isGameOver ? 'END' : 'VS'}
        </AppText>
      </View>

      {/* Player 2 / Bot card */}
      <View style={[
        styles.playerCard,
        isActive(player2) ? styles.activeCard : styles.inactiveCard,
      ]}>
        <AppAvatar
          avatar={player2.avatar}
          color={player2.color}
          size="sm"
        />
        <AppText
  variant="caption"
  style={[
    styles.playerName,
    !isActive(player2) && styles.inactiveText,
  ] as any}
>
          {player2.name}
        </AppText>
        {isActive(player2) && !isGameOver && (
          <AppText variant="label" style={styles.turnLabel}>
            {/* Show "Thinking..." for bot, "Your turn" for human */}
            {player2.type === 'bot' ? 'Thinking...' : 'Your turn'}
          </AppText>
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  // Outer container — both player cards sit side by side.
  container: {
    flexDirection: 'row',          // Line up children horizontally.
    alignItems: 'center',          // Center vertically.
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.borderRadius.lg,
    marginHorizontal: THEME.spacing.md,
    marginVertical: THEME.spacing.sm,
  },

  // Each player card takes equal space on either side.
  playerCard: {
    flex: 1,                       // Each card takes half the container width.
    alignItems: 'center',          // Center content horizontally.
    gap: THEME.spacing.xs,         // Small gap between avatar, name, label.
    paddingVertical: THEME.spacing.xs,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.sm,
  },

  // Active player card — highlighted background.
  activeCard: {
    backgroundColor: THEME.colors.surfaceLight,
  },

  // Inactive player card — no background, dimmed.
  inactiveCard: {
    backgroundColor: 'transparent',
    opacity: 0.5,                  // Dim the inactive player.
  },

  playerName: {
    color: THEME.colors.textPrimary,
    fontWeight: THEME.fontWeights.bold,
    textAlign: 'center',
  },

  inactiveText: {
    color: THEME.colors.textSecondary,
  },

  // "Your turn" / "Thinking..." label under the active player's name.
  turnLabel: {
    color: THEME.colors.primary,
    fontWeight: THEME.fontWeights.bold,
  },

  // VS / END text in the center between both cards.
  center: {
    paddingHorizontal: THEME.spacing.sm,
  },

  vsText: {
    color: THEME.colors.textSecondary,
    fontWeight: THEME.fontWeights.bold,
  },
});