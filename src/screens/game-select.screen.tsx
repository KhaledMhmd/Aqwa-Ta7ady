// ============================================================
// game-select.screen.tsx
// Shows the list of available games.
// Phase 1: Only Tic-Tac-Toe is available.
// Snakes & Ladders and Hangman show Coming Soon.
// ============================================================

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { THEME } from '../core/theme/theme.config';
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

export const GameSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const onComingSoon = () => {
    Alert.alert('Coming Soon', 'This game will be available in a future update.');
  };

  return (
    <View style={styles.container}>
      <AppText variant="h2" style={styles.title}>Choose a Game</AppText>

      {/* Tic-Tac-Toe — fully functional in Phase 1 */}
      <AppButton
        label={TTT_CONFIG.name}
        onPress={() => navigation.navigate('TicTacToe', {
          playerName: 'Player',
          playerAvatar: '⚽',
        })}
        style={styles.gameButton}
      />

      {/* Snakes & Ladders — Coming Soon */}
      <AppButton
        label="Snakes & Ladders"
        onPress={onComingSoon}
        variant="ghost"
        style={styles.gameButton}
      />

      {/* Hangman — Coming Soon */}
      <AppButton
        label="Hangman"
        onPress={onComingSoon}
        variant="ghost"
        style={styles.gameButton}
      />

      {/* Back button */}
      <AppButton
        label="Back"
        onPress={() => navigation.goBack()}
        variant="ghost"
        style={styles.gameButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  gameButton: {
    width: '100%',
  },
});