// ── React Native ──────────────────────────────────────

// ============================================================
// game-board.component.tsx
// Full 3x3 grid with club badge headers.
// FotMob-style staggered intro animation on mount.
// Draws an animated brush stroke line across winning cells.
// Uses react-native-svg for the hand-drawn stroke effect.
// Uses useWindowDimensions() for reliable sizing.
// Angular equivalent: GameBoardComponent with @Input(), @Output(),
// and a trigger('boardIntro') animation using query + stagger.
// ============================================================

// ┌─────────────────────────────────────────────────────────────┐
// │ ANGULAR EQUIVALENT — Component Animation Metadata           │
// │                                                             │
// │ @Component({                                                │
// │   animations: [                                             │
// │     trigger('boardIntro', [                                 │
// │       transition(':enter', [                                │
// │         query('.col-header', [                              │
// │           style({ opacity: 0, transform: 'translateY(-20)' }),
// │           stagger(100, animate('350ms ease-out',            │
// │             style({ opacity: 1, transform: 'none' }))),     │
// │         ]),                                                  │
// │         query('.row-header', [                              │
// │           style({ opacity: 0, transform: 'translateX(-20)' }),
// │           stagger(100, animate('350ms ease-out',            │
// │             style({ opacity: 1, transform: 'none' }))),     │
// │         ]),                                                  │
// │         query('.grid-cell', [                               │
// │           style({ opacity: 0, transform: 'scale(0.3)' }),   │
// │           stagger(60, animate('400ms cubic-bezier(          │
// │             0.175, 0.885, 0.32, 1.275)',                    │
// │             style({ opacity: 1, transform: 'scale(1)' }))),│
// │         ]),                                                  │
// │       ]),                                                    │
// │     ]),                                                      │
// │   ],                                                         │
// │ })                                                           │
// │ export class GameBoardComponent implements OnInit { ... }    │
// └─────────────────────────────────────────────────────────────┘

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

// ── INTRO ANIMATION TIMING CONSTANTS ───────────────────
// Controls the FotMob-style stagger animation on mount.
// All values in milliseconds. Tweak to speed up or slow down.
const ANIM_INITIAL_DELAY = 200;       // Pause before anything starts — lets screen settle.
const ANIM_COL_STAGGER = 100;         // Delay between each column header appearing.
const ANIM_COL_DURATION = 350;        // How long each column header takes to appear.
const ANIM_ROW_STAGGER = 100;         // Delay between each row header appearing.
const ANIM_ROW_DURATION = 350;        // How long each row header takes to appear.
const ANIM_CELL_STAGGER = 60;         // Delay between each cell appearing — fast cascade.

// Props type — what GameScreen passes in.
// Angular equivalent: @Input() decorators.
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

  // ── INTRO ANIMATION VALUES ─────────────────────────────
  // Each header and cell gets its own Animated.Value (0 → 1).
  // useRef ensures these persist across re-renders — created once.
  // Angular equivalent: animation state variables on the component class.

  // Column header animations — one per column (3 total).
  const colHeaderAnims = useRef(
    COL_HEADERS.map(() => new Animated.Value(0))                     // [Value(0), Value(0), Value(0)] — all start invisible.
  ).current;

  // Row header animations — one per row (3 total).
  const rowHeaderAnims = useRef(
    ROW_HEADERS.map(() => new Animated.Value(0))                     // Same pattern — one per row.
  ).current;

  // Cell animations — one per cell in the 3x3 grid (9 total), flat array.
  // Index mapping: cell[row][col] → flatIndex = row * gridSize + col.
  const cellAnims = useRef(
    Array.from(
      { length: TTT_CONFIG.gridSize * TTT_CONFIG.gridSize },         // 9 slots.
      () => new Animated.Value(0)                                    // Each starts at 0 (invisible).
    )
  ).current;

  // ── INTRO ANIMATION SEQUENCE ─────────────────────────────
  // Runs once on mount. Plays the full FotMob-style reveal:
  // 1. Column headers slide down from top (staggered left→right)
  // 2. Row headers slide in from left (staggered top→bottom)
  // 3. Grid cells scale+fade in cascade (top-left→bottom-right)
  // Angular equivalent: ngOnInit() with trigger('boardIntro').
  useEffect(() => {
    // Step 1: Column headers — opacity 0→1, translateY -20→0.
    const colSequence = Animated.stagger(
      ANIM_COL_STAGGER,                                              // 100ms between each.
      colHeaderAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,                                                // Animate 0 → 1.
          duration: ANIM_COL_DURATION,                               // 350ms each.
          useNativeDriver: true,                                     // Native thread for 60fps.
        })
      )
    );

    // Step 2: Row headers — opacity 0→1, translateX -20→0.
    const rowSequence = Animated.stagger(
      ANIM_ROW_STAGGER,                                              // 100ms between each.
      rowHeaderAnims.map((anim) =>
        Animated.timing(anim, {
          toValue: 1,                                                // Animate 0 → 1.
          duration: ANIM_ROW_DURATION,                               // 350ms each.
          useNativeDriver: true,                                     // Native thread.
        })
      )
    );

    // Step 3: Cells — opacity 0→1, scale 0.3→1 with spring bounce.
    const cellSequence = Animated.stagger(
      ANIM_CELL_STAGGER,                                             // 60ms between each — fast cascade.
      cellAnims.map((anim) =>
        Animated.spring(anim, {
          toValue: 1,                                                // Animate 0 → 1.
          tension: 120,                                              // Snappy spring — gives the "pop" feel.
          friction: 8,                                               // Subtle bounce — not rubbery.
          useNativeDriver: true,                                     // Native thread.
        })
      )
    );

    // Chain all three steps with initial delay.
    Animated.sequence([
      Animated.delay(ANIM_INITIAL_DELAY),                            // 200ms pause.
      colSequence,                                                   // Columns fly in.
      rowSequence,                                                   // Rows slide in.
      cellSequence,                                                  // Cells pop in.
    ]).start();
  }, []);                                                            // Empty deps = mount only.

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
  // Returns pixel start/end points for the brush stroke line.
  const getWinLineCoords = (): { x1: number; y1: number; x2: number; y2: number } | null => {
    if (!winLineType) return null;

    const halfCell = cellSize / 2;                                   // Center of a cell.
    const overshoot = 0;                                // Line extends slightly past the grid.

    switch (winLineType) {
      case 'row-0': return {
        x1: ROW_HEADER_WIDTH - overshoot, y1: halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot, y2: halfCell,
      };
      case 'row-1': return {
        x1: ROW_HEADER_WIDTH - overshoot, y1: cellSize + halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot, y2: cellSize + halfCell,
      };
      case 'row-2': return {
        x1: ROW_HEADER_WIDTH - overshoot, y1: (cellSize * 2) + halfCell,
        x2: ROW_HEADER_WIDTH + (cellSize * 3) + overshoot, y2: (cellSize * 2) + halfCell,
      };
      case 'col-0': return {
        x1: ROW_HEADER_WIDTH + halfCell, y1: -overshoot,
        x2: ROW_HEADER_WIDTH + halfCell, y2: (cellSize * 3) + overshoot,
      };
      case 'col-1': return {
        x1: ROW_HEADER_WIDTH + cellSize + halfCell, y1: -overshoot,
        x2: ROW_HEADER_WIDTH + cellSize + halfCell, y2: (cellSize * 3) + overshoot,
      };
      case 'col-2': return {
        x1: ROW_HEADER_WIDTH + (cellSize * 2) + halfCell, y1: -overshoot,
        x2: ROW_HEADER_WIDTH + (cellSize * 2) + halfCell, y2: (cellSize * 3) + overshoot,
      };
      // Diagonals use halfCell offset instead of overshoot — they're already
      // longer than rows/columns so less extension is needed to look right.
      case 'diag-main': return {                                     // Top-left → bottom-right ↘.
        x1: ROW_HEADER_WIDTH + halfCell * 0.3,                      // Start just inside top-left cell center.
        y1: halfCell * 0.3,                                          // Slight inset from top edge.
        x2: ROW_HEADER_WIDTH + (cellSize * 3) - halfCell * 0.3,     // End just inside bottom-right cell center.
        y2: (cellSize * 3) - halfCell * 0.3,                         // Slight inset from bottom edge.
      };
      case 'diag-anti': return {                                     // Top-right → bottom-left ↙.
        x1: ROW_HEADER_WIDTH + (cellSize * 3) - halfCell * 0.3,     // Start just inside top-right cell center.
        y1: halfCell * 0.3,                                          // Slight inset from top edge.
        x2: ROW_HEADER_WIDTH + halfCell * 0.3,                      // End just inside bottom-left cell center.
        y2: (cellSize * 3) - halfCell * 0.3,                         // Slight inset from bottom edge.
      };
      default: return null;
    }
  };

  // ── BRUSH PATH BUILDER ───────────────────────────────
  // Creates an SVG cubic Bezier path that looks hand-drawn.
  const buildBrushPath = (x1: number, y1: number, x2: number, y2: number): string => {
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const wobble = Math.min(length * 0.02, 8); 
    const dx = (x2 - x1) / length;
    const dy = (y2 - y1) / length;
    const px = -dy;
    const py = dx;
    const cp1x = x1 + (x2 - x1) * 0.33 + px * wobble;
    const cp1y = y1 + (y2 - y1) * 0.33 + py * wobble;
    const cp2x = x1 + (x2 - x1) * 0.66 - px * wobble * 0.7;
    const cp2y = y1 + (y2 - y1) * 0.66 - py * wobble * 0.7;
    return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
  };

  // ── RENDER THE WIN LINE SVG ──────────────────────────
  const renderWinLine = () => {
    if (!winLineType) return null;

    const coords = getWinLineCoords();
    if (!coords) return null;

    const path = buildBrushPath(coords.x1, coords.y1, coords.x2, coords.y2);
    const pathLength = Math.sqrt(
      (coords.x2 - coords.x1) ** 2 + (coords.y2 - coords.y1) ** 2
    ) * 1.1;

    const dashOffset = lineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, pathLength],
    });

    const opacity = lineAnim.interpolate({
      inputRange: [0, 0.7, 1],
      outputRange: [1, 0.6, 0],
    });

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
          {/* Layer 1: Glow */}
          <AnimatedPath
            d={path}
            stroke={colors.tertiary}
            strokeWidth={16}
            strokeLinecap="round"
            fill="none"
            opacity={0.2}
            strokeDasharray={`${pathLength}`}
            strokeDashoffset={dashOffset}
          />
          {/* Layer 2: Main stroke */}
          <AnimatedPath
            d={path}
            stroke={colors.tertiary}
            strokeWidth={7}
            strokeLinecap="round"
            fill="none"
            opacity={0.85}
            strokeDasharray={`${pathLength}`}
            strokeDashoffset={dashOffset}
          />
          {/* Layer 3: Highlight */}
          <AnimatedPath
            d={path}
            stroke="#FFFFFF"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            opacity={0.2}
            strokeDasharray={`${pathLength}`}
            strokeDashoffset={dashOffset}
          />
        </Svg>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>

      {/* ── TOP HEADER ROW — empty corner + animated column badges ── */}
      <View style={styles.row}>
        {/* Empty spacer matching row header width */}
        <View style={{ width: ROW_HEADER_WIDTH }} />

        {/* Column headers — each wrapped in Animated.View for fly-in effect. */}
        {COL_HEADERS.map((header, index) => (
          <Animated.View
            key={header.id}                                          // Unique key — same as Angular's trackBy.
            style={[
              styles.colHeader,                                      // Base styling — centering + padding.
              { width: cellSize },                                   // Dynamic size matching cells.
              {
                opacity: colHeaderAnims[index],                      // Fades from 0 to 1.
                transform: [{
                  translateY: colHeaderAnims[index].interpolate({
                    inputRange: [0, 1],                              // Maps 0→1 to -20→0.
                    outputRange: [-20, 0],                           // Starts 20dp above, ends at natural position.
                  }),
                }],
              },
            ]}
          >
            <Image
              source={{ uri: header.image }}                         // Club badge URL.
              style={{ width: badgeSize, height: badgeSize }}
              resizeMode="contain"
            />
            <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
              {header.label}
            </AppText>
          </Animated.View>
        ))}
      </View>

      {/* ── GRID ROWS + WIN LINE OVERLAY ── */}
      <View style={styles.gridContainer}>

        {/* The 3x3 grid of cells with animated row headers */}
        {board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>

            {/* Row header — animates in from the left. */}
            <Animated.View
              style={[
                styles.rowHeader,                                    // Base styling.
                { width: ROW_HEADER_WIDTH },                         // Fixed width.
                {
                  opacity: rowHeaderAnims[rowIndex],                 // Fades from 0 to 1.
                  transform: [{
                    translateX: rowHeaderAnims[rowIndex].interpolate({
                      inputRange: [0, 1],                            // Maps 0→1 to -20→0.
                      outputRange: [-20, 0],                         // Starts 20dp left, ends at natural position.
                    }),
                  }],
                },
              ]}
            >
              <Image
                source={{ uri: ROW_HEADERS[rowIndex].image }}        // Club badge URL.
                style={{ width: badgeSize, height: badgeSize }}
                resizeMode="contain"
              />
              <AppText variant="label" style={[styles.headerLabel, { color: colors.textSecondary }] as any}>
                {ROW_HEADERS[rowIndex].label}
              </AppText>
            </Animated.View>

            {/* Grid cells — each wrapped in Animated.View for scale+fade cascade. */}
            {row.map((cellState, colIndex) => {
              const flatIndex = rowIndex * TTT_CONFIG.gridSize + colIndex; // Row 0 Col 0 → 0, Row 2 Col 2 → 8.

              return (
                <Animated.View
                  key={colIndex}                                     // Unique key per cell.
                  style={{
                    opacity: cellAnims[flatIndex],                   // Fades from 0 to 1.
                    transform: [{
                      scale: cellAnims[flatIndex].interpolate({
                        inputRange: [0, 1],                          // Maps 0→1 to 0.3→1.
                        outputRange: [0.3, 1],                       // Starts at 30% size, pops to 100%.
                      }),
                    }],
                  }}
                >
                  <GameCell
                    cellState={cellState}                            // Cell state — who owns it.
                    cellSize={cellSize}                               // Width + height from GameBoard.
                    onPress={() => onCellPress(rowIndex, colIndex)}   // Tap handler.
                    isGameOver={isGameOver}                           // Disables press when game ended.
                    isWinningCell={isWinningCell(rowIndex, colIndex)} // Highlights winning cells.
                  />
                </Animated.View>
              );
            })}
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
  // Wrapper around the cell rows — position: relative for SVG overlay.
  gridContainer: {
    position: 'relative',                              // Enables absolute positioning for SVG.
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