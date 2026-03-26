// ============================================================
// auth.screen.tsx
// Sign In / Sign Up / Play as Guest screen.
// Phase 1: Only Play as Guest is functional.
// Sign In and Sign Up show Coming Soon alert.
// Angular equivalent: AuthComponent with conditional rendering.
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  // Player name input state.
  const [playerName, setPlayerName] = useState<string>('');

  // Selected avatar state — defaults to first available avatar.
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    TTT_CONFIG.availableAvatars[0]
  );

  // Validates input and navigates to Home.
  const onPlayAsGuest = () => {
    if (playerName.trim().length === 0) {
      Alert.alert('Enter your name', 'Please enter a name to continue.');
      return;
    }
    navigation.replace('Home');
  };

  // Shows Coming Soon alert for Phase 2+ features.
  const onComingSoon = () => {
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <AppText variant="h2" style={{ color: colors.primary }}>
        {APP_CONFIG.name}
      </AppText>

      <AppText variant="caption">Enter your name to get started</AppText>

      {/* Name input */}
      <TextInput
        style={[styles.input, {
          backgroundColor: colors.surfaceLight,
          color: colors.textPrimary,
          borderColor: colors.border,
        }]}
        placeholder="Your name"
        placeholderTextColor={colors.textSecondary}
        value={playerName}
        onChangeText={setPlayerName}
        maxLength={20}
        autoCapitalize="words"
      />

      {/* Avatar selector */}
      <AppText variant="caption" style={styles.avatarLabel}>
        Choose your avatar
      </AppText>

      <View style={styles.avatarRow}>
        {TTT_CONFIG.availableAvatars.map((avatar) => (
          <AppButton
            key={avatar}
            label={avatar}
            onPress={() => setSelectedAvatar(avatar)}
            variant={selectedAvatar === avatar ? 'primary' : 'ghost'}
            style={styles.avatarButton}
          />
        ))}
      </View>

      {/* Play as Guest — Phase 1 */}
      <AppButton
        label="Play as Guest"
        onPress={onPlayAsGuest}
        style={styles.mainButton}
      />

      <AppText variant="caption" style={{ color: colors.textSecondary }}>
        — or —
      </AppText>

      {/* Sign In — Coming Soon */}
      <AppButton
        label="Sign In"
        onPress={onComingSoon}
        variant="secondary"
        style={styles.mainButton}
      />

      {/* Sign Up — Coming Soon */}
      <AppButton
        label="Sign Up"
        onPress={onComingSoon}
        variant="ghost"
        style={styles.mainButton}
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
  input: {
    width: '100%',
    height: 48,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    fontSize: THEME.fontSizes.md,
    borderWidth: 1,
    marginBottom: THEME.spacing.sm,
  },
  avatarLabel: {
    alignSelf: 'flex-start',
    marginBottom: THEME.spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.xs,
    marginBottom: THEME.spacing.md,
    justifyContent: 'center',
  },
  avatarButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: THEME.spacing.sm,
  },
  mainButton: {
    width: '100%',
  },
});