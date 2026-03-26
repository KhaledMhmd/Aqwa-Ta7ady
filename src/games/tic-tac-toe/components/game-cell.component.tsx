// ============================================================
// game-cell.component.tsx
// A single pressable cell in the tic-tac-toe grid.
// Uses useTheme() for dynamic colours.
// Angular equivalent: GameCellComponent with @Input() and @Output().
// ============================================================

import React, { useEffect, useRef } from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { CellState } from '../types/game.types';
import { AppAvatar } from '../../../core/components/app-avatar.component';
import { useTheme } from '../../../core/theme/theme.context';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 80) / TTT_CONFIG.gridSize;

type Props = {
  cellState: CellState;
  onPress: () => void;
  isGameOver: boolean;
  isWinningCell: boolean;
};

export const GameCell = ({
  cellState,
  onPress,
  isGameOver,
  isWinningCell,
}: Props) => {
  const { colors } = useTheme();

  const isClaimed = cellState.claimedBy !== null;

  // Scale animation — plays when cell is claimed.
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Pulse animation — plays on winning cells.
  const winAnim = useRef(new Animated.Value(1)).current;

  // Animate scale-in when cell gets claimed.
  useEffect(() => {
    if (isClaimed) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [isClaimed]);

  // Animate pulse on winning cells.
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

  const isDisabled = isGameOver || isClaimed;

  return (
    <TouchableOpacity
      style={[
        styles.cell,
        { backgroundColor: colors.surface, borderColor: colors.border },
        isClaimed && !isWinningCell && { backgroundColor: colors.surfaceLight },
        isWinningCell && { backgroundColor: colors.surfaceLight, borderColor: colors.warning, borderWidth: 2 },
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {isClaimed ? (
        <Animated.View style={{ transform: [{ scale: isWinningCell ? winAnim : scaleAnim }] }}>
          <AppAvatar
            avatar={cellState.claimedBy!.avatar}
            color={cellState.claimedBy!.color}
            size="md"
          />
        </Animated.View>
      ) : (
        <View style={[styles.emptyDot, { backgroundColor: colors.border }]} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});