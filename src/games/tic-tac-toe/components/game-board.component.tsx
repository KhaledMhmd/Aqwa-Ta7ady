// ── React Native ──────────────────────────────────────

// ============================================================
// game-board.component.tsx
// Full 3x3 grid with club badge headers.
// Draws an animated brush stroke line across winning cells.
// Uses react-native-svg for the hand-drawn stroke effect.
// Uses useWindowDimensions() for reliable sizing.
// Angular equivalent: GameBoardComponent with @Input() and @Output().
// ============================================================

import React, { useEffect, useRef } from 'react';                   // React core + hooks for animation.
import {
  View,                                                              // Container element.
  Image,                                                             // Image component.
  StyleSheet,                                                        // Style creation.
  useWindowDimensions,                                               // Reactive screen dimensions.
  Animated,                                                          // Animation API.
} from 'react-native';
import Svg, { Path } from 'react-native-svg';                       // SVG for the brush stroke line.
import { CellState } from '../types/game.types';                    // Cell state type.
import { Player } from '../../../core/types/player.types';          // Player type.
import { GameCell } from './game-cell.component';                   // Single cell component.
import { AppText } from '../../../core/components/app-text.component'; // Themed text.
import { useTheme } from '../../../core/theme/theme.context';       // Dynamic colours.
import { THEME } from '../../../core/theme/theme.config';           // Static spacing.
import { TTT_CONFIG } from '../config/game.config';                 // Grid size config.
import { ROW_HEADERS, COL_HEADERS } from '../data/questions.data';  // Club badge data.

// Create an animated version of the SVG Path component.
// Allows Animated values to drive strokeDashoffset for the drawing effect.
// Angular equivalent: CSS @keyframes animation on stroke-dashoffset.
const AnimatedPath = Animated.createAnimatedComponent(Path);

// WinLineType — identifies which of the 8 possible lines won.
type WinLineType =
  | 'row-0' | 'row-1' | 'row-2'
  | 'col-0' | 'col-1' | 'col-2'
  | 'diag-main' | 'diag-anti'
  | null;

// Props type — what GameScreen passes in.
type Props = {
  board: CellState[][];                                              // 3x3 board state.
  currentPlayer: Player;                                             // Whose turn it is.
  isGameOver: boolean;                                               // Whether game ended.
  winningCells: number[][];                                          // Cells in the winning line.
  winLineType: WinLineType;                                          // Which line won — positions the brush stroke.
  onCellPress: (row: number, col: number) => void;                   // Callback when cell is tapped.
};

// Fixed width for the row header column.
const ROW_HEADER_WIDTH = 60;

export const GameBoard = ({
  board,
  currentPlayer,
  isGameOver,
  winningCells,
  winLineType,
  onCellPress,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { width } = useWindowDimensions();                           // Reactive screen width.

  // Cell size — same width for column headers and game cells.
  const cellSize = (width - ROW_HEADER_WIDTH - (THEME.spacing.md * 2)) / TTT_CONFIG.gridSize;

  // Badge image size — 50% of cell, capped at 40.
  const badgeSize = Math.min(cellSize * 0.5, 40);

  // ── BRUSH STROKE ANIMATION ───────────────────────────
  // Drives strokeDashoffset from full length (hidden) to 0 (fully drawn).
  // Creates a "someone is drawing a line" effect.
  const lineAnim = useRef(new Animated.Value(1)).current;            // 1 = hidden, 0 = drawn.

  // Start the drawing animation when a win line appears.
  useEffect(() => {
    if (winLineType) {
      lineAnim.setValue(1);                                          // Reset to fully hidden.
      Animated.timing(lineAnim, {
        toValue: 0,                                                  // Animate to fully drawn.
        duration: 600,                                               // 0.6s — quick hand stroke feel.
        useNativeDriver: false,                                      // strokeDashoffset can't use native driver.
      }).start();
    }
  }, [winLineType]);

  // Checks if a cell is part of the winning line.
  const isWinningCell = (row: number, col: number): boolean =>
    winningCells.some(([r, c]) => r === row && c === col);

  // ── WIN LINE COORDINATES ─────────────────────────────
  // Returns pixel start/end points for the brush stroke line
  // based on which of the 8 possible lines won.
  // All X positions are offset by ROW_HEADER_WIDTH so the line
  // sits over the cells, not over the row badges.
  const getWinLineCoords = (): { x1: number; y1: number; x2: number; y2: number } | null => {
    if (!winLineType) return null;

    const halfCell = cellSize / 2;                                   // Center of a cell.
    const overshoot = cellSize * 0.2;                                // Line extends slightly past the grid.

    switch (winLineType) {
      // ── HORIZONTAL — line goes left to right through the row ──
      case 'row-0': return {                                         // Top row.
        x1: ROW_HEADER_WIDTH - overshoot,
        y1: halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot,
        y2: halfCell,
      };
      case 'row-1': return {                                         // Middle row.
        x1: ROW_HEADER_WIDTH - overshoot,
        y1: cellSize + halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot,
        y2: cellSize + halfCell,
      };
      case 'row-2': return {                                         // Bottom row.
        x1: ROW_HEADER_WIDTH - overshoot,
        y1: (cellSize * 2) + halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot,
        y2: (cellSize * 2) + halfCell,
      };

      // ── VERTICAL — line goes top to bottom through the column ──
      case 'col-0': return {                                         // Left column.
        x1: ROW_HEADER_WIDTH + halfCell,
        y1: -overshoot,
        x2: ROW_HEADER_WIDTH + halfCell,
        y2: (cellSize * 3) + overshoot,
      };
      case 'col-1': return {                                         // Center column.
        x1: ROW_HEADER_WIDTH + cellSize + halfCell,
        y1: -overshoot,
        x2: ROW_HEADER_WIDTH + cellSize + halfCell,
        y2: (cellSize * 3) + overshoot,
      };
      case 'col-2': return {                                         // Right column.
        x1: ROW_HEADER_WIDTH + (cellSize * 2) + halfCell,
        y1: -overshoot,
        x2: ROW_HEADER_WIDTH + (cellSize * 2) + halfCell,
        y2: (cellSize * 3) + overshoot,
      };

      // ── DIAGONAL — line goes corner to corner ──
      case 'diag-main': return {                                     // Top-left → bottom-right ↘.
        x1: ROW_HEADER_WIDTH - overshoot,
        y1: -overshoot,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot,
        y2: (cellSize * 3) + overshoot,
      };
      case 'diag-anti': return {                                     // Top-right → bottom-left ↙.
        x1: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot,
        y1: -overshoot,
        x2: ROW_HEADER_WIDTH - overshoot,
        y2: (cellSize * 3) + overshoot,
      };

      default: return null;
    }
  };

  // ── BRUSH PATH BUILDER ───────────────────────────────
  // Creates an SVG cubic Bezier path that looks hand-drawn.
  // Instead of a straight line, it wobbles slightly using
  // control points offset perpendicular to the line direction.
  // This gives it an organic, brush-stroke feel.
  const buildBrushPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);     // Line length.
    const wobble = length * 0.03;                                    // Wobble amount — 3% of length.

    // Direction vector of the line, normalised.
    const dx = (x2 - x1) / length;
    const dy = (y2 - y1) / length;

    // Perpendicular vector — rotated 90° for offsetting control points.
    const px = -dy;
    const py = dx;

    // Control point 1 — 1/3 along the line, offset up by wobble.
    const cp1x = x1 + (x2 - x1) * 0.33 + px * wobble;
    const cp1y = y1 + (y2 - y1) * 0.33 + py * wobble;

    // Control point 2 — 2/3 along the line, offset down by wobble.
    const cp2x = x1 + (x2 - x1) * 0.66 - px * wobble * 0.7;
    const cp2y = y1 + (y2 - y1) * 0.66 - py * wobble * 0.7;

    // SVG cubic Bezier: M = move to start, C = curve to end via control points.
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  };

  // ── RENDER THE WIN LINE SVG ──────────────────────────
  // Returns the SVG brush stroke overlay or null if no winner.
  const renderWinLine = () => {
    if (!winLineType) return null;                                   // No winner — no line.

    const coords = getWinLineCoords();
    if (!coords) return null;

    // Build the wobbly Bezier path from start to end.
    const path = buildBrushPath(coords.x1, coords.y1, coords.x2, coords.y2);

    // Approximate path length for the dash animation.
    const pathLength = Math.sqrt(
      (coords.x2 - coords.x1) ** 2 + (coords.y2 - coords.y1) ** 2
    ) * 1.1;                                                         // 10% extra for the curve.

    // strokeDashoffset: pathLength (hidden) → 0 (drawn).
    const dashOffset = lineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, pathLength],
    });

    // Opacity fades in during the drawing.
    const opacity = lineAnim.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [1, 0.6, 0],
    });

    // SVG canvas size — covers the full grid plus overshoot.
    const svgWidth = ROW_HEADER_WIDTH + (cellSize * 3) + (cellSize * 0.5);
    const svgHeight = (cellSize * 3) + (cellSize * 0.5);

    return (
      <Animated.View
        style={{
          position: 'absolute',                                      // Overlay on top of the grid.
          top: -(cellSize * 0.2),                                    // Offset for overshoot above.
          left: -(cellSize * 0.2),                                   // Offset for overshoot left.
          opacity: opacity,                                          // Animated fade-in.
        }}
      >
        <Svg width={svgWidth} height={svgHeight}>

          {/* Layer 1: Glow — thick, semi-transparent background stroke. */}
          {/* Creates a soft halo behind the main line for depth. */}
          <AnimatedPath
            d={path}
            stroke={colors.tertiary}                                 // Tertiary colour (cyan).
            strokeWidth={16}                                         // Thick glow.
            strokeLinecap="round"                                    // Rounded ends like a real brush.
            fill="none"
            opacity={0.2}                                            // Very subtle glow.
            strokeDasharray={`${pathLength}`}                        // Full length as one dash.
            strokeDashoffset={dashOffset}                            // Animated: hidden → drawn.
          />

          {/* Layer 2: Main stroke — the primary visible brush line. */}
          <AnimatedPath
            d={path}
            stroke={colors.tertiary}                                 // Tertiary colour.
            strokeWidth={7}                                          // Medium thickness.
            strokeLinecap="round"                                    // Rounded brush ends.
            fill="none"
            opacity={0.85}                                           // Slightly translucent for painted feel.
            strokeDasharray={`${pathLength}`}
            strokeDashoffset={dashOffset}
          />

          {/* Layer 3: Highlight — thin bright center line for depth. */}
          <AnimatedPath
            d={path}
            stroke="#FFFFFF"                                          // White highlight.
            strokeWidth={2}                                          // Very thin.
            strokeLinecap="round"
            fill="none"
            opacity={0.2}                                            // Very subtle.
            strokeDasharray={`${pathLength}`}
            strokeDashoffset={dashOffset}
          />

        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>

      {/* ── TOP HEADER ROW — empty corner + column badges ── */}
      <View style={styles.row}>
        <View style={{ width: ROW_HEADER_WIDTH }} />
        {COL_HEADERS.map((header) => (
          <View key={header.id} style={[styles.colHeader, { width: cellSize }]}>
            <Image
              source={{ uri: header.image }}
              style={{ width: badgeSize, height: badgeSize }}
              resizeMode="contain"
            />
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {header.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── GRID ROWS + WIN LINE OVERLAY ── */}
      {/* gridContainer has position: relative so the SVG overlays correctly. */}
      <View style={styles.gridContainer}>

        {/* The 3x3 grid of cells with row headers */}
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            <View style={[styles.rowHeader, { width: ROW_HEADER_WIDTH }]}>
              <Image
                source={{ uri: ROW_HEADERS[rowIndex].image }}
                style={{ width: badgeSize, height: badgeSize }}
                resizeMode="contain"
              />
              <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
                {ROW_HEADERS[rowIndex].label}
              </AppText>
            </View>
            {row.map((cellState, colIndex) => (
              <GameCell
                key={colIndex}
                cellState={cellState}
                cellSize={cellSize}
                onPress={() => onCellPress(rowIndex, colIndex)}
                isGameOver={isGameOver}
                isWinningCell={isWinningCell(rowIndex, colIndex)}
              />
            ))}
          </View>
        ))}

        {/* Animated brush stroke line drawn over the winning cells. */}
        {renderWinLine()}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Board container — centers the grid on screen.
  container: {
    alignItems: 'center',                              // Center grid horizontally.
    paddingHorizontal: THEME.spacing.md,               // 16 — side padding.
  },
  // Wrapper around the cell rows — needed for position: relative
  // so the SVG overlay can be positioned absolutely on top.
  gridContainer: {
    position: 'relative',                              // Enables absolute positioning for the SVG.
  },
  // One row — header + cells side by side.
  row: {
    flexDirection: 'row',                              // Left to right layout.
    alignItems: 'center',                              // Vertically center items.
  },
  // Column header — centered above its cell.
  colHeader: {
    justifyContent: 'center',                          // Center badge vertically.
    alignItems: 'center',                              // Center badge horizontally.
    paddingVertical: THEME.spacing.xs,                 // Small top/bottom padding.
    gap: 2,                                            // Tiny gap between badge and label.
  },
  // Row header — centered beside its row.
  rowHeader: {
    justifyContent: 'center',                          // Center badge vertically.
    alignItems: 'center',                              // Center badge horizontally.
    gap: 2,                                            // Tiny gap between badge and label.
  },
  // Club name label.
  headerLabel: {
    textAlign: 'center',                               // Center the label text.
    fontSize: 9,                                       // Very small.
  },
});