// ── React Native ──────────────────────────────────────

// ============================================================
// game.screen.tsx
// The main tic-tac-toe game screen.
// Wires together: TurnIndicator, GameBoard, QuestionModal.
// Uses useGame hook for all game logic.
// Uses useSettings hook for game rules (Steal Cells, Timer).
// Passes win line type to GameBoard for the brush stroke overlay.
// Angular equivalent: a GameComponent that injects GameService
// and SettingsService and orchestrates all child components.
// ============================================================

import React from 'react';                                          // React core — needed for JSX.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  Alert,                                                             // Native alert dialog.
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';      // Safe area — avoids notch.

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.

import { RootStackParamList } from '../../../navigation/app.navigator';        // Route types.
import { useGame } from '../hooks/game.hook';                                  // Game state hook.
import { useSettings } from '../../../core/hooks/settings.hook';               // Settings hook.
import { createGuestPlayer1, createBotPlayer } from '../logic/game.service';   // Player factory functions.
import { TurnIndicator } from '../components/turn-indicator.component';        // Turn indicator UI.
import { GameBoard } from '../components/game-board.component';                // Game board UI.
import { QuestionModal } from '../components/question-modal.component';        // Question modal UI.
import { AppText } from '../../../core/components/app-text.component';         // Themed text.
import { AppButton } from '../../../core/components/app-button.component';     // Themed button.
import { THEME } from '../../../core/theme/theme.config';                      // Static spacing.
import { TTT_CONFIG } from '../config/game.config';                            // Game config.
import { useTheme } from '../../../core/theme/theme.context';                  // Dynamic colours.
import { useLanguage } from '../../../core/i18n/language.context';             // Translations.

// WinLineType — identifies which of the 8 possible lines won.
// Used by GameBoard to position the brush stroke overlay.
// Angular equivalent: an enum or union type in game.types.ts.
type WinLineType =
  | 'row-0' | 'row-1' | 'row-2'                                     // Horizontal wins.
  | 'col-0' | 'col-1' | 'col-2'                                     // Vertical wins.
  | 'diag-main' | 'diag-anti'                                       // Diagonal wins.
  | null;                                                            // No winner yet.

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicTacToe'>;
type RoutePropType = RouteProp<RootStackParamList, 'TicTacToe'>;

export const GameScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Navigate between screens.
  const route = useRoute<RoutePropType>();                           // Read params from previous screen.
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { t } = useLanguage();                                       // Translations.

  // Destructure all three params — playerName, playerAvatar, and difficulty.
  const { playerName, playerAvatar, difficulty } = route.params;

  // Create the player and bot objects using the factory functions.
  const player1 = createGuestPlayer1(playerName, playerAvatar, colors.player1);
  const player2 = createBotPlayer(colors.botColor, difficulty);

  // useSettings gives us the current app settings.
  const { settings } = useSettings();

  // useGame gives us the full game state and all actions.
  const {
    gameState,
    turnState,
    timeLeft,
    onCellPress,
    onAnswerSubmit,
    onModalClose,
    resetGame,
  } = useGame(player1, player2, settings);

  // getWinLine returns both the winning cells AND the line type.
  // The cells are passed to GameBoard for highlighting.
  // The lineType is passed to GameBoard for positioning the brush stroke.
  // Angular equivalent: a getter that returns { cells, lineType } from the service.
  const getWinLine = (): { cells: number[][]; lineType: WinLineType } => {
    if (!gameState.winner) return { cells: [], lineType: null };     // No winner yet.

    // All 8 possible winning lines with their type identifiers.
    const winningLines: { cells: number[][]; lineType: WinLineType }[] = [
      { cells: [[0,0],[0,1],[0,2]], lineType: 'row-0' },            // Top row.
      { cells: [[1,0],[1,1],[1,2]], lineType: 'row-1' },            // Middle row.
      { cells: [[2,0],[2,1],[2,2]], lineType: 'row-2' },            // Bottom row.
      { cells: [[0,0],[1,0],[2,0]], lineType: 'col-0' },            // Left column.
      { cells: [[0,1],[1,1],[2,1]], lineType: 'col-1' },            // Center column.
      { cells: [[0,2],[1,2],[2,2]], lineType: 'col-2' },            // Right column.
      { cells: [[0,0],[1,1],[2,2]], lineType: 'diag-main' },        // Main diagonal ↘.
      { cells: [[0,2],[1,1],[2,0]], lineType: 'diag-anti' },        // Anti diagonal ↙.
    ];

    // Find the line where all 3 cells are owned by the winner.
    const winLine = winningLines.find((line) =>
      line.cells.every(
        ([r, c]) => gameState.board[r][c].claimedBy?.id === gameState.winner?.id
      )
    );

    return winLine || { cells: [], lineType: null };
  };

  // Cache the win line result so we don't recalculate it multiple times per render.
  const winLine = getWinLine();

  // showResultAlert displays the result when the game ends.
  const showResultAlert = () => {
    const winnerName = gameState.winner?.name ?? '';

    const title = gameState.winType === 'line'
      ? t.result.winsLine.replace('{name}', winnerName)
      : t.result.winsPoints.replace('{name}', winnerName);

    const lineMsg = t.result.lineMessage.replace('{name}', winnerName);
    const score = `${t.result.finalScore}\n${player1.name}: ${gameState.cellCounts.player1} ${t.result.cells}\n${player2.name}: ${gameState.cellCounts.player2} ${t.result.cells}`;

    const message = gameState.winType === 'line'
      ? `${lineMsg}\n\n${score}`
      : `${t.result.pointsMessage}\n\n${score}`;

    Alert.alert(title, message, [
      { text: t.result.playAgain, onPress: resetGame },
      {
        text: t.result.home,
        onPress: () => navigation.navigate('Home', {
          playerName: player1.name,
          playerAvatar: player1.avatar,
        }),
        style: 'cancel',
      },
    ]);
  };

  // Show result alert when game ends.
  React.useEffect(() => {
    if (gameState.isGameOver) {
      setTimeout(showResultAlert, 1200);                             // Delay so brush stroke animation plays first.
    }
  }, [gameState.isGameOver]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* ── HEADER ────────────────────────────────────── */}
        <View style={[styles.header, { direction: 'ltr' }]}>
          <AppButton
            label={t.common.back}
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.backButton}
          />
          <AppText variant="h3" style={{ color: colors.primary }}>
            {TTT_CONFIG.name}
          </AppText>
          <View style={styles.backButton} />
        </View>

        {/* ── TURN INDICATOR ────────────────────────────── */}
        <TurnIndicator
          player1={player1}
          player2={player2}
          currentPlayer={gameState.currentPlayer}
          isGameOver={gameState.isGameOver}
          timeLeft={timeLeft}
          timeLimitEnabled={settings.gameRules.timeLimitEnabled}
        />

        {/* ── GAME BOARD ────────────────────────────────── */}
        <GameBoard
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          isGameOver={gameState.isGameOver}
          winningCells={winLine.cells}
          winLineType={winLine.lineType}
          onCellPress={onCellPress}
        />

        {/* ── QUESTION MODAL ────────────────────────────── */}
        <QuestionModal
          isVisible={turnState.isModalVisible}
          question={turnState.currentQuestion}
          isWrongAnswer={turnState.isWrongAnswer}
          isAlreadyUsed={turnState.isAlreadyUsed}
          onSubmit={onAnswerSubmit}
          onClose={onModalClose}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,                                           // Fill the screen.
  },
  container: {
    flex: 1,                                           // Fill available space.
  },
  header: {
    flexDirection: 'row',                              // Back button — title — spacer.
    alignItems: 'center',                              // Vertically centered.
    justifyContent: 'space-between',                   // Spread across the row.
    paddingHorizontal: THEME.spacing.md,               // Side padding.
    paddingVertical: THEME.spacing.sm,                 // Top/bottom padding.
  },
  backButton: {
    minWidth: 70,                                      // Minimum width so the title stays centered.
  },
});