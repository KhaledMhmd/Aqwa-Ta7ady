// ============================================================
// game-cell.component.tsx
// A single pressable cell in the tic-tac-toe grid.
// Shows empty, player 1 claimed, or player 2 claimed state.
// Angular equivalent: a GameCellComponent with @Input() for
// cellState, onPress, and isGameOver, and @Output() for press.
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity, // Pressable wrapper that dims on touch.
  View,
  StyleSheet,
  Animated,         // React Native's built-in animation library.
                    // Animated.Value holds a value that can be
                    // smoothly changed over time.
                    // Angular equivalent: Angular Animations with
                    // trigger(), state(), animate().
  Dimensions,       // Gives us the device screen dimensions.
} from 'react-native';

import { CellState } from '../types/game.types';
import { AppAvatar } from '../../../core/components/app-avatar.component';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

// Get the device screen width to calculate cell size.
const { width } = Dimensions.get('window');

// Calculate cell size so 3 cells + headers fill the screen width.
// 80 = total horizontal padding + header column width reserved.
// Dividing remaining width by gridSize gives each cell equal space.
const CELL_SIZE = (width - 80) / TTT_CONFIG.gridSize;

type Props = {
  cellState: CellState;   // The state of this cell — claimed or empty.
  onPress: () => void;    // Called when this cell is tapped.
  isGameOver: boolean;    // Disables all cells when game ends.
  isWinningCell: boolean; // True if this cell is part of the winning line.
};

export const GameCell = ({
  cellState,
  onPress,
  isGameOver,
  isWinningCell,
}: Props) => {

  const isClaimed = cellState.claimedBy !== null;

  // scaleAnim is an Animated.Value starting at 0.
  // When a cell is claimed, we animate it from 0 to 1 (scale up).
  // Angular equivalent: a trigger('claimAnimation') in @Component animations.
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // winAnim pulses the winning cells.
  const winAnim = useRef(new Animated.Value(1)).current;

  // useEffect watches isClaimed — when it becomes true,
  // trigger the scale-in animation.
  // Angular equivalent: ngOnChanges() reacting to cellState changing.
  useEffect(() => {
    if (isClaimed) {
      // Animated.spring creates a bouncy spring animation.
      // toValue: 1 = scale up to full size.
      // useNativeDriver: true = runs on the UI thread, not JS thread.
      // This makes it buttery smooth — never set this to false.
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,   // How stiff the spring is — higher = snappier.
        friction: 8,    // How much the spring bounces — lower = bouncier.
      }).start();
    }
  }, [isClaimed]);

  // useEffect watches isWinningCell — when true, start the pulse animation.
  useEffect(() => {
    if (isWinningCell) {
      // Animated.loop repeats the animation forever.
      // Animated.sequence plays animations one after another.
      Animated.loop(
        Animated.sequence([
          // Pulse up to 1.1x size.
          Animated.timing(winAnim, {
            toValue: 1.1,
            duration: 400,
            useNativeDriver: true,
          }),
          // Pulse back to normal size.
          Animated.timing(winAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isWinningCell]);

  // Determine if this cell can be pressed.
  // Cannot press if: game is over, cell is claimed (unless Steal Cells —
  // that logic lives in the hook, not here).
  const isDisabled = isGameOver || isClaimed;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        // Highlight winning cells with a gold border.
        isWinningCell && styles.winningCell,
        // Dim claimed cells slightly so empty cells stand out.
        isClaimed && !isWinningCell && styles.claimedCell,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isClaimed ? (
        // Animated.View wraps the avatar so the scale animation applies to it.
        // Angular equivalent: [@claimAnimation]="'claimed'" on the element.
        <Animated.View
          style={{
            transform: [
              // Apply both the claim scale and the win pulse scale.
              { scale: isWinningCell ? winAnim : scaleAnim },
            ],
          }}
        >
          <AppAvatar
            avatar={cellState.claimedBy!.avatar}
            color={cellState.claimedBy!.color}
            size="md"
          />
        </Animated.View>
      ) : (
        // Empty cell — just a subtle dot in the center.
        <View style={styles.emptyDot} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.surface,
  },

  // Claimed cell — slightly different background so it reads as owned.
  claimedCell: {
    backgroundColor: THEME.colors.surfaceLight,
  },

  // Winning cell — gold border to highlight the winning line.
  winningCell: {
    backgroundColor: THEME.colors.surfaceLight,
    borderColor: THEME.colors.warning,
    borderWidth: 2,
  },

  // Small dot shown in empty cells — subtle visual cue.
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.colors.border,
  },
});