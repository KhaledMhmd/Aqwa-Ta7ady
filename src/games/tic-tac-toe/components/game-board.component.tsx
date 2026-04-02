// ── React Native ──────────────────────────────────────

// ============================================================
// game-board.component.tsx
// Full 3x3 grid with club badge headers.
// Column badges are centered above their cells.
// Row badges are centered beside their rows.
// Uses useWindowDimensions() for reliable sizing.
// Angular equivalent: GameBoardComponent with @Input() and @Output().
// ============================================================

import React from 'react';                                          // React core — needed for JSX.
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native'; // Layout and image components.
import { CellState } from '../types/game.types';                    // Type for each cell.
import { Player } from '../../../core/types/player.types';          // Player type.
import { GameCell } from './game-cell.component';                   // Single cell component.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing.
import { TTT_CONFIG } from '../config/game.config';                 // Grid size config.
import { ROW_HEADERS, COL_HEADERS } from '../data/questions.data';  // Club badge data.

// Props type — what the parent (GameScreen) passes in.
type Props = {
  board: CellState[][];                                              // 3x3 board state.
  currentPlayer: Player;                                             // Whose turn it is.
  isGameOver: boolean;                                               // Whether game has ended.
  winningCells: number[][];                                          // Cells in the winning line.
  onCellPress: (row: number, col: number) => void;                   // Callback when cell is tapped.
};

// Fixed width for the row header column (badge + label on the left).
// This is separate from cell width so badges and cells align independently.
const ROW_HEADER_WIDTH = 60;

export const GameBoard = ({
  board,
  currentPlayer,
  isGameOver,
  winningCells,
  onCellPress,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.

  // useWindowDimensions — always has the correct width, even during initial load.
  // Angular equivalent: @HostListener('window:resize') or ResizeObserver.
  const { width } = useWindowDimensions();

  // Cell width = available space after row header and padding, divided by 3.
  // This is the SAME width used by column headers AND cells — perfect alignment.
  // Angular equivalent: calc((100% - row-header-width - padding) / 3) in CSS grid.
  const cellSize = (width - ROW_HEADER_WIDTH - (THEME.spacing.md * 2)) / TTT_CONFIG.gridSize;

  // Badge image size — 60% of cell width, capped for readability.
  const badgeSize = Math.min(cellSize * 0.5, 40);

  // Checks if a cell is part of the winning line.
  const isWinningCell = (row: number, col: number): boolean =>
    winningCells.some(([r, c]) => r === row && c === col);

  return (
    <View style={styles.container}>

      {/* ── TOP HEADER ROW — empty corner + column badges ── */}
      <View style={styles.row}>
        {/* Empty corner — same width as row headers to keep alignment. */}
        <View style={{ width: ROW_HEADER_WIDTH }} />

        {/* Column badges — each one has the SAME width as the cell below it. */}
        {/* This guarantees the badge is perfectly centered above its column. */}
        {COL_HEADERS.map((header) => (
          <View
            key={header.id}
            style={[
              styles.colHeader,
              { width: cellSize },                                   // Same width as the game cell below.
            ]}
          >
            {/* Club badge image */}
            <Image
              source={{ uri: header.image }}                                  // Local require() or remote URL.
              style={{ width: badgeSize, height: badgeSize }}        // Responsive badge size.
              resizeMode="contain"                                   // Fit without cropping.
            />
            {/* Club name label */}
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {header.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── GRID ROWS — row badge + 3 cells per row ── */}
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>

          {/* Row badge — fixed width, vertically centered beside the cells. */}
          <View style={[styles.rowHeader, { width: ROW_HEADER_WIDTH }]}>
            <Image
              source={{ uri: ROW_HEADERS[rowIndex].image }}                  // Local require() or remote URL.
              style={{ width: badgeSize, height: badgeSize }}        // Same badge size as columns.
              resizeMode="contain"
            />
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {ROW_HEADERS[rowIndex].label}
            </AppText>
          </View>

          {/* 3 game cells in this row — each uses cellSize for width. */}
          {row.map((cellState, colIndex) => (
            <GameCell
              key={colIndex}
              cellState={cellState}
              cellSize={cellSize}                                    // Pass calculated size to cell.
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
  // Board container — centers the grid on screen.
  container: {
    alignItems: 'center',                              // Center grid horizontally.
    paddingHorizontal: THEME.spacing.md,               // 16 — side padding.
  },
  // One row — header + cells laid out horizontally.
  row: {
    flexDirection: 'row',                              // Left to right layout.
    alignItems: 'center',                              // Vertically center all items in the row.
  },
  // Column header — centered above its cell.
  colHeader: {
    justifyContent: 'center',                          // Center badge vertically.
    alignItems: 'center',                              // Center badge horizontally.
    paddingVertical: THEME.spacing.xs,                 // 4 — small top/bottom padding.
    gap: 2,                                            // Tiny gap between badge and label.
  },
  // Row header — centered beside its row of cells.
  rowHeader: {
    justifyContent: 'center',                          // Center badge vertically.
    alignItems: 'center',                              // Center badge horizontally.
    gap: 2,                                            // Tiny gap between badge and label.
  },
  // Club name label — small centered text.
  headerLabel: {
    textAlign: 'center',                               // Center the label text.
    fontSize: 9,                                       // Very small — just for identification.
  },
});