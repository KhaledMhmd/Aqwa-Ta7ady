// ============================================================
// game.screen.tsx
// The main tic-tac-toe game screen.
// Wires together: TurnIndicator, GameBoard, QuestionModal.
// Uses useGame hook for all game logic.
// Uses useSettings hook for game rules (Steal Cells, Timer).
// Angular equivalent: a GameComponent that injects GameService
// and SettingsService and orchestrates all child components.
// ============================================================

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,  // Respects the iPhone notch and status bar.
                 // Equivalent to padding-top: env(safe-area-inset-top) in CSS.
  Alert,
} from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/app.navigator';
import { useGame } from '../hooks/game.hook';
import { useSettings } from '../../../core/hooks/settings.hook';
import { createGuestPlayer1, createBotPlayer } from '../logic/game.service';
import { TurnIndicator } from '../components/turn-indicator.component';
import { GameBoard } from '../components/game-board.component';
import { QuestionModal } from '../components/question-modal.component';
import { AppText } from '../../../core/components/app-text.component';
import { AppButton } from '../../../core/components/app-button.component';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicTacToe'>;
type RoutePropType = RouteProp<RootStackParamList, 'TicTacToe'>;

export const GameScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // useRoute gives us the parameters passed when navigating to this screen.
  // Angular equivalent: ActivatedRoute.snapshot.params
  const route = useRoute<RoutePropType>();

  // Extract playerName and playerAvatar from route params.
  const { playerName, playerAvatar } = route.params;

  // Create the player and bot objects using the factory functions.
  // These are created once — they never change during a game session.
  const player1 = createGuestPlayer1(playerName, playerAvatar);
  const player2 = createBotPlayer();

  // useSettings gives us the current app settings.
  // Angular equivalent: injecting SettingsService.
  const { settings } = useSettings();

  // useGame gives us the full game state and all actions.
  // Angular equivalent: injecting GameService and getting state via observables.
  const {
    gameState,
    turnState,
    onCellPress,
    onAnswerSubmit,
    onModalClose,
    resetGame,
  } = useGame(player1, player2, settings);

  // Finds the winning cells to highlight on the board.
  // Returns empty array if no winner yet.
  // Angular equivalent: a getter that calls gameService.getWinningCells().
  const getWinningCells = (): number[][] => {
    if (!gameState.winner) return [];

    // All 8 possible winning lines.
    const winningLines = [
      [[0,0],[0,1],[0,2]],
      [[1,0],[1,1],[1,2]],
      [[2,0],[2,1],[2,2]],
      [[0,0],[1,0],[2,0]],
      [[0,1],[1,1],[2,1]],
      [[0,2],[1,2],[2,2]],
      [[0,0],[1,1],[2,2]],
      [[0,2],[1,1],[2,0]],
    ];

    // Find the line where all 3 cells are owned by the winner.
    const winningLine = winningLines.find((line) =>
      line.every(
        ([r, c]) =>
          gameState.board[r][c].claimedBy?.id === gameState.winner?.id
      )
    );

    return winningLine || [];
  };

  // onGameOver is called when the game ends — shows a result alert.
  // Angular equivalent: a method triggered by a game over event from the service.
  const showResultAlert = () => {
    const title = gameState.isDraw
      ? "It's a Draw!"
      : `${gameState.winner?.name} Wins!`;

    const message = gameState.isDraw
      ? 'Nobody wins this time. Play again?'
      : `${gameState.winner?.name} got 3 in a row!`;

    Alert.alert(title, message, [
      {
        text: 'Play Again',
        onPress: resetGame,
      },
      {
        text: 'Home',
        onPress: () => navigation.navigate('Home'),
        style: 'cancel',
      },
    ]);
  };

  // Show result alert when game ends.
  // useEffect watches isGameOver — fires when the game finishes.
  React.useEffect(() => {
    if (gameState.isGameOver) {
      // Small delay so the winning animation plays before the alert.
      setTimeout(showResultAlert, 800);
    }
  }, [gameState.isGameOver]);

  return (
    // SafeAreaView prevents content from going behind the iPhone notch.
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ── HEADER ────────────────────────────────────── */}
        <View style={styles.header}>
          {/* Back button */}
          <AppButton
            label="← Back"
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.backButton}
            labelStyle={styles.backLabel}
          />
          {/* Game title */}
          <AppText variant="h3" style={styles.gameTitle}>
            {TTT_CONFIG.name}
          </AppText>
          {/* Placeholder to balance the header flex layout */}
          <View style={styles.backButton} />
        </View>

        {/* ── TURN INDICATOR ────────────────────────────── */}
        <TurnIndicator
          player1={player1}
          player2={player2}
          currentPlayer={gameState.currentPlayer}
          isGameOver={gameState.isGameOver}
        />

        {/* ── GAME BOARD ────────────────────────────────── */}
        <GameBoard
          board={gameState.board}
          currentPlayer={gameState.currentPlayer}
          isGameOver={gameState.isGameOver}
          winningCells={getWinningCells()}
          onCellPress={onCellPress}
        />

        {/* ── QUESTION MODAL ────────────────────────────── */}
        <QuestionModal
          isVisible={turnState.isModalVisible}
          question={turnState.currentQuestion}
          isWrongAnswer={turnState.isWrongAnswer}
          timeLimitEnabled={settings.gameRules.timeLimitEnabled}
          onSubmit={onAnswerSubmit}
          onClose={onModalClose}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  gameTitle: {
    color: THEME.colors.primary,
  },
  backButton: {
    minWidth: 70,
  },
  backLabel: {
    fontSize: THEME.fontSizes.sm,
  },
});
