// ============================================================
// game-board.component.tsx
// The full game board — header row, header column, and 3x3 grid.
// Renders the club badges as headers and GameCell for each cell.
// Angular equivalent: a GameBoardComponent with @Input() for
// board, headers, currentPlayer, and @Output() for cellPress.
// ============================================================

import React from 'react';
import {
  View,
  Image,      // Displays images. Equivalent to <img> in HTML.
  StyleSheet,
  Dimensions,
} from 'react-native';

import { CellState, GridHeader } from '../types/game.types';
import { Player } from '../../../core/types/player.types';
import { GameCell } from './game-cell.component';
import { AppText } from '../../../core/components/app-text.component';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';
import { ROW_HEADERS, COL_HEADERS } from '../data/questions.data';

const { width } = Dimensions.get('window');

// Header size — the club badge squares in the top row and left column.
const HEADER_SIZE = (width - 80) / (TTT_CONFIG.gridSize + 1);

// Cell size — same calculation as game-cell.component.tsx.
const CELL_SIZE = (width - 80) / TTT_CONFIG.gridSize;

type Props = {
  board: CellState[][];      // The 3x3 board state from game.hook.ts.
  currentPlayer: Player;     // Used to pass down to cells for accessibility.
  isGameOver: boolean;       // Disables all cells when game ends.
  winningCells: number[][];  // Array of [row, col] pairs for winning line.
  onCellPress: (row: number, col: number) => void; // Called when cell tapped.
};

export const GameBoard = ({
  board,
  currentPlayer,
  isGameOver,
  winningCells,
  onCellPress,
}: Props) => {

  // Helper — checks if a given cell is part of the winning line.
  // Used to pass isWinningCell prop to each GameCell.
  // Angular equivalent: a method called from [isWinningCell] binding.
  const isWinningCell = (row: number, col: number): boolean => {
    return winningCells.some(
      ([r, c]) => r === row && c === col
    );
  };

  return (
    <View style={styles.container}>

      {/* ── TOP HEADER ROW ────────────────────────────────── */}
      {/* First row: empty corner cell + one badge per column */}
      <View style={styles.row}>

        {/* Empty corner cell — top-left, no content */}
        <View style={styles.cornerCell} />

        {/* Column header badges — one per column */}
        {COL_HEADERS.map((header) => (
          <View key={header.id} style={styles.headerCell}>
            {/* Club badge image */}
            <Image
              source={{ uri: header.image }}
              style={styles.badgeImage}
              // resizeMode='contain' scales the image to fit without cropping.
              // Angular equivalent: object-fit: contain in CSS.
              resizeMode="contain"
            />
            {/* Club name label under the badge */}
            <AppText variant="label" style={styles.headerLabel}>
              {header.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── GRID ROWS ─────────────────────────────────────── */}
      {/* For each row in the board, render a row header + 3 cells */}
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>

          {/* Row header badge — left side of each row */}
          <View style={styles.headerCell}>
            <Image
              source={{ uri: ROW_HEADERS[rowIndex].image }}
              style={styles.badgeImage}
              resizeMode="contain"
            />
            <AppText variant="label" style={styles.headerLabel}>
              {ROW_HEADERS[rowIndex].label}
            </AppText>
          </View>

          {/* 3 cells per row */}
          {row.map((cellState, colIndex) => (
            <GameCell
              key={colIndex}
              cellState={cellState}
              // Arrow function passes the row and col to onCellPress.
              // Angular equivalent: (cellPress)="onCellPress($event)"
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

  // Each row is a horizontal line of cells.
  row: {
    flexDirection: 'row', // Line up children horizontally.
  },

  // Header cell — holds a club badge and label.
  headerCell: {
    width: HEADER_SIZE,
    height: HEADER_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.xs,
    gap: 2,
  },

  // Empty top-left corner cell.
  cornerCell: {
    width: HEADER_SIZE,
    height: HEADER_SIZE,
  },

  // Club badge image inside each header cell.
  badgeImage: {
    width: HEADER_SIZE * 0.6,  // Badge takes 60% of the header cell size.
    height: HEADER_SIZE * 0.6,
  },

  // Club name label under the badge.
  headerLabel: {
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    fontSize: 9,               // Very small to fit under the badge.
  },
});