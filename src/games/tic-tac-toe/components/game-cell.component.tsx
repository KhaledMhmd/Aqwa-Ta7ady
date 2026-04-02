// ── React Native ──────────────────────────────────────

// ============================================================
// game-cell.component.tsx
// A single pressable cell in the tic-tac-toe grid.
// Size is passed from GameBoard to guarantee alignment with headers.
// Uses useTheme() for dynamic colours.
// Angular equivalent: GameCellComponent with @Input() and @Output().
// ============================================================

import React, { useEffect, useRef } from 'react';                   // React core + hooks.
import {
  TouchableOpacity,                                                  // Pressable wrapper.
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  Animated,                                                          // Animation API.
} from 'react-native';
import { CellState } from '../types/game.types';                    // Cell state type.
import { AppAvatar } from '../../../core/components/app-avatar.component'; // Avatar component.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { THEME } from '../../../core/theme/theme.config';           // Static values.

// Props type — what GameBoard passes in.
type Props = {
  cellState: CellState;                                              // Who owns this cell + used answer.
  cellSize: number;                                                  // Width and height — from GameBoard.
  onPress: () => void;                                               // Tap handler.
  isGameOver: boolean;                                               // Whether the game has ended.
  isWinningCell: boolean;                                            // Whether this cell is in the winning line.
};

export const GameCell = ({
  cellState,
  cellSize,
  onPress,
  isGameOver,
  isWinningCell,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.

  // Is this cell claimed by a player?
  const isClaimed = cellState.claimedBy !== null;

  // Scale animation — plays when cell is first claimed.
  // Animated.Value(0) starts invisible, springs to 1 (full size).
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation — plays on winning cells after game ends.
  // Animated.Value(1) starts at normal size, pulses between 1 and 1.1.
  const winAnim = useRef(new Animated.Value(1)).current;

  // Trigger scale-in animation when cell gets claimed.
  // Angular equivalent: a CSS transition triggered by [class.claimed].
  useEffect(() => {
    if (isClaimed) {
      Animated.spring(scaleAnim, {
        toValue: 1,                                                  // Scale to full size.
        useNativeDriver: true,                                       // Run on native thread for performance.
        tension: 100,                                                // Spring stiffness.
        friction: 8,                                                 // Spring damping.
      }).start();
    }
  }, [isClaimed]);

  // Trigger pulse animation on winning cells.
  // Angular equivalent: a CSS @keyframes pulse animation.
  useEffect(() => {
    if (isWinningCell) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(winAnim, { toValue: 1.1, duration: 400, useNativeDriver: true }),
          Animated.timing(winAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [isWinningCell]);

  // Disable the cell if the game is over or it's already claimed.
  const isDisabled = isGameOver || isClaimed;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        {
          width: cellSize,                                           // Size from GameBoard — matches column header width.
          height: cellSize,                                          // Square cell.
          backgroundColor: colors.surface,                           // Default cell background.
          borderColor: colors.border,                                // Subtle border.
        },
        isClaimed && !isWinningCell && { backgroundColor: colors.surfaceLight }, // Claimed cells slightly lighter.
        isWinningCell && {
  backgroundColor: colors.surfaceLight,
},
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}                                            // Slight dim on press.
    >
      {isClaimed ? (
        // Claimed cell — show the player's avatar with animation.
        <Animated.View style={{ transform: [{ scale: isWinningCell ? winAnim : scaleAnim }] }}>
          <AppAvatar
            avatar={cellState.claimedBy!.avatar}                     // Player's emoji avatar.
            color={cellState.claimedBy!.color}                       // Player's theme colour.
            size="md"                                                // Medium avatar size.
          />
        </Animated.View>
      ) : (
        // Empty cell — show a small dot as a tap target hint.
        <View style={[styles.emptyDot, { backgroundColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Cell base styles — border and centering.
  // Width and height are set dynamically via cellSize prop.
  cell: {
    borderWidth: 1,                                    // Subtle border around each cell.
    justifyContent: 'center',                          // Center avatar vertically.
    alignItems: 'center',                              // Center avatar horizontally.
  },
  // Small dot shown in empty cells — visual hint that the cell is tappable.
  emptyDot: {
    width: 6,                                          // Tiny dot.
    height: 6,
    borderRadius: 3,                                   // Perfect circle.
  },
});