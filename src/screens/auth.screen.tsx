// ============================================================
// auth.screen.tsx
// Sign In / Sign Up / Play as Guest screen.
// Phase 1: Only "Play as Guest" is fully functional.
// Sign In and Sign Up buttons show "Coming Soon" overlay.
// Angular equivalent: an AuthComponent with conditional rendering
// based on feature flags.
// ============================================================

import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,   // Text input field. Equivalent to <input type="text">.
  Alert,       // Shows a native alert dialog. Equivalent to window.alert() but native.
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // playerName holds what the user is typing in the name input.
  // useState('') initialises it as an empty string.
  // Angular equivalent: a FormControl or [(ngModel)] binding.
  const [playerName, setPlayerName] = useState<string>('');

  // selectedAvatar holds the emoji the player chose.
  // Defaults to the first avatar in the available list.
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    TTT_CONFIG.availableAvatars[0]
  );

  // onPlayAsGuest validates the input and navigates to Home.
  // Angular equivalent: onSubmit() in a reactive form component.
  const onPlayAsGuest = () => {
    // Trim whitespace and check the name is not empty.
    if (playerName.trim().length === 0) {
      // Show a native alert if name is empty.
      // Angular equivalent: setting a form validation error.
      Alert.alert('Enter your name', 'Please enter a name to continue.');
      return;
    }

    // Navigate to Home screen.
    // We do not pass playerName here — it gets passed when
    // the player actually starts a game from the Game Select screen.
    navigation.replace('Home');
  };

  // onComingSoon shows an alert for Phase 2+ features.
  // Called by Sign In and Sign Up buttons.
  const onComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'This feature will be available in a future update.'
    );
  };

  return (
    <View style={styles.container}>

      {/* App name header */}
      <AppText variant="h2" style={styles.title}>
        {APP_CONFIG.name}
      </AppText>

      <AppText variant="caption" style={styles.subtitle}>
        Enter your name to get started
      </AppText>

      {/* Name input field */}
      <TextInput
        style={styles.input}
        // placeholder text shown when the input is empty.
        placeholder="Your name"
        placeholderTextColor={THEME.colors.textSecondary}
        // value and onChangeText together create a controlled input.
        // Angular equivalent: [(ngModel)]="playerName"
        value={playerName}
        onChangeText={setPlayerName}  // Called on every keystroke.
        maxLength={20}                // Limit name to 20 characters.
        autoCapitalize="words"        // Auto-capitalise first letter of each word.
      />

      {/* Avatar selector */}
      <AppText variant="caption" style={styles.avatarLabel}>
        Choose your avatar
      </AppText>

      {/* Row of avatar options */}
      <View style={styles.avatarRow}>
        {TTT_CONFIG.availableAvatars.map((avatar) => (
          // For each available avatar, render a pressable circle.
          // key={avatar} is required by React when rendering lists —
          // it helps React track which item is which.
          // Angular equivalent: *ngFor="let avatar of availableAvatars"
          <AppButton
            key={avatar}
            label={avatar}
            onPress={() => setSelectedAvatar(avatar)}
            variant={selectedAvatar === avatar ? 'primary' : 'ghost'}
            style={styles.avatarButton}
          />
        ))}
      </View>

      {/* Play as Guest — fully functional in Phase 1 */}
      <AppButton
        label="Play as Guest"
        onPress={onPlayAsGuest}
        style={styles.mainButton}
      />

      {/* Divider */}
      <AppText variant="caption" style={styles.orText}>— or —</AppText>

      {/* Sign In — Coming Soon in Phase 1 */}
      <AppButton
        label="Sign In"
        onPress={onComingSoon}
        variant="secondary"
        style={styles.mainButton}
      />

      {/* Sign Up — Coming Soon in Phase 1 */}
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
    backgroundColor: THEME.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.xl,
    gap: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.xs,
  },
  subtitle: {
    marginBottom: THEME.spacing.md,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: THEME.colors.surfaceLight,
    borderRadius: THEME.borderRadius.md,
    paddingHorizontal: THEME.spacing.md,
    color: THEME.colors.textPrimary,
    fontSize: THEME.fontSizes.md,
    marginBottom: THEME.spacing.sm,
  },
  avatarLabel: {
    alignSelf: 'flex-start',
    marginBottom: THEME.spacing.xs,
  },
  avatarRow: {
    flexDirection: 'row',   // Line up avatars horizontally.
    flexWrap: 'wrap',       // Wrap to next line if they overflow.
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
  orText: {
    color: THEME.colors.textSecondary,
    marginVertical: THEME.spacing.xs,
  },
});