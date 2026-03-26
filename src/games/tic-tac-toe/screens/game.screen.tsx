// ============================================================
// game.screen.tsx
// The main tic-tac-toe game screen.
// Placeholder for now — full implementation in next step.
// ============================================================

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../../../core/components/app-text.component';
import { AppButton } from '../../../core/components/app-button.component';
import { THEME } from '../../../core/theme/theme.config';
import { TTT_CONFIG } from '../config/game.config';

export const GameScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <AppText variant="h2" style={styles.title}>
        {TTT_CONFIG.name}
      </AppText>
      <AppText variant="caption">Game coming in next step...</AppText>
      <AppButton
        label="Back"
        onPress={() => navigation.goBack()}
        variant="ghost"
        style={styles.button}
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
    gap: THEME.spacing.md,
  },
  title: { color: THEME.colors.primary },
  button: { marginTop: THEME.spacing.lg },
});