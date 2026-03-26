// ============================================================
// game-board.component.tsx
// Full 3x3 grid with club badge headers.
// Uses useTheme() for dynamic colours.
// Angular equivalent: GameBoardComponent with @Input() and @Output().
// ============================================================

import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { CellState } from '../types/game.types';
import { Player } from '../../../core/types/player.types';
import { GameCell } from './game-cell.component';
import { AppText } from '../../../core/components/app-text.component';
import { useTheme } from '../../../core/theme/theme.context';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';
import { ROW_HEADERS, COL_HEADERS } from '../data/questions.data';

const { width } = Dimensions.get('window');
const HEADER_SIZE = (width - 80) / (TTT_CONFIG.gridSize + 1);

type Props = {
  board: CellState[][];
  currentPlayer: Player;
  isGameOver: boolean;
  winningCells: number[][];
  onCellPress: (row: number, col: number) => void;
};

export const GameBoard = ({
  board,
  currentPlayer,
  isGameOver,
  winningCells,
  onCellPress,
}: Props) => {
  const { colors } = useTheme();

  // Checks if a cell is part of the winning line.
  const isWinningCell = (row: number, col: number): boolean =>
    winningCells.some(([r, c]) => r === row && c === col);

  return (
    <View style={styles.container}>

      {/* Top header row — empty corner + column badges */}
      <View style={styles.row}>
        <View style={[styles.cornerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]} />
        {COL_HEADERS.map((header) => (
          <View key={header.id} style={[styles.headerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]}>
            <Image source={{ uri: header.image }} style={styles.badgeImage} resizeMode="contain" />
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {header.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* Grid rows — row badge + 3 cells */}
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          <View style={[styles.headerCell, { width: HEADER_SIZE, height: HEADER_SIZE }]}>
            <Image source={{ uri: ROW_HEADERS[rowIndex].image }} style={styles.badgeImage} resizeMode="contain" />
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {ROW_HEADERS[rowIndex].label}
            </AppText>
          </View>
          {row.map((cellState, colIndex) => (
            <GameCell
              key={colIndex}
              cellState={cellState}
              onPress={() => onCellPress(rowIndex, colIndex)}
              isGameOver={isGameOver}
              isWinningCell={isWinningCell(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xs,
    gap: 2,
  },
  cornerCell: {},
  badgeImage: {
    width: HEADER_SIZE * 0.6,
    height: HEADER_SIZE * 0.6,
  },
  headerLabel: {
    textAlign: 'center',
    fontSize: 9,
  },
});