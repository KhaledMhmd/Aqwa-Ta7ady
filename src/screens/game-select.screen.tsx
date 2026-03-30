// ============================================================
// game-select.screen.tsx
// List of available games.
// Phase 1: Tic-Tac-Toe only. Others show Coming Soon.
// Angular equivalent: GameSelectComponent with Router.navigate().
// ============================================================

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config';
import { useLanguage } from '../core/i18n/language.context';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

// Add this line:
type RoutePropType = RouteProp<RootStackParamList, 'GameSelect'>;

export const GameSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();
  const route = useRoute<RoutePropType>();

// Read player info passed from HomeScreen.
// Angular equivalent: ActivatedRoute.snapshot.params
const { playerName, playerAvatar } = route.params;


  const onComingSoon = () => {
    Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <AppText variant="h2" style={{ color: colors.primary }}>
        {t.gameSelect.title}
      </AppText>

      {/* Tic-Tac-Toe — Phase 1 */}
      <AppButton
        label={TTT_CONFIG.name}
        // Navigate to mode select first — player picks difficulty before the game starts.
onPress={() => navigation.navigate('TicTacToeModeSelect', { playerName, playerAvatar })}
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  gameButton: {
    width: '100%',
  },
});