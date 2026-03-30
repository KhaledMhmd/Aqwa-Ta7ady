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
import { useTheme } from '../../../core/theme/theme.context';
import { useLanguage } from '../../../core/i18n/language.context';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TicTacToe'>;
type RoutePropType = RouteProp<RootStackParamList, 'TicTacToe'>;

export const GameScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // useRoute gives us the parameters passed when navigating to this screen.
  // Angular equivalent: ActivatedRoute.snapshot.params
  const route = useRoute<RoutePropType>();
  const { colors } = useTheme();
  const { t } = useLanguage();
// Destructure all three params — playerName, playerAvatar, and difficulty.
const { playerName, playerAvatar, difficulty } = route.params;

  // Create the player and bot objects using the factory functions.
  // These are created once — they never change during a game session.
  const player1 = createGuestPlayer1(playerName, playerAvatar, colors.player1);
// Pass the selected difficulty to the bot player.
// getBotMove() uses this to decide its strategy.
const player2 = createBotPlayer(colors.botColor, difficulty);
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
 // showResultAlert displays the result when the game ends.
// Always shows a winner — no draw possible with this rule set.
const showResultAlert = () => {
  const winnerName = gameState.winner?.name ?? '';

  // Replace {name} placeholder with actual winner name.
  // Angular equivalent: using the translate pipe with parameters.
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
            label={t.common.back}
            onPress={() => navigation.goBack()}
            variant="ghost"
            style={styles.backButton}
          />
          {/* Game title */}
          <AppText variant="h3" style={{ color: colors.primary }}>
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
  isAlreadyUsed={turnState.isAlreadyUsed}  // Add this line.
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
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  backButton: {
    minWidth: 70,
  },
});
