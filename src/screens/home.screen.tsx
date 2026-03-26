// ============================================================
// home.screen.tsx
// The main menu screen — shown after login or guest play.
// Contains: avatar top-left, app logo center, main menu buttons.
// Phase 1: Play and Settings are fully functional.
// Leaderboards and Shop show Coming Soon alert.
// Help shows a basic instructions screen.
// Angular equivalent: a HomeComponent with a menu list
// and Router.navigate() calls on each button press.
// ============================================================

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // onComingSoon is used for all Phase 2+ menu items.
  // Shows a native alert instead of navigating.
  const onComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'This feature will be available in a future update.'
    );
  };

  return (
    <View style={styles.container}>

      {/* App logo */}
      <AppText variant="h1" style={styles.logo}>⚽</AppText>

      {/* App name */}
      <AppText variant="h2" style={styles.title}>
        {APP_CONFIG.name}
      </AppText>

      {/* Menu buttons */}
      <View style={styles.menu}>

        {/* PLAY — navigates to game select screen */}
        <AppButton
          label="Play"
          onPress={() => navigation.navigate('GameSelect')}
          style={styles.menuButton}
        />

        {/* SETTINGS — navigates to settings screen */}
        <AppButton
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
          variant="secondary"
          style={styles.menuButton}
        />

        {/* HELP — navigates to help screen */}
        <AppButton
          label="Help"
          onPress={() => navigation.navigate('Help')}
          variant="secondary"
          style={styles.menuButton}
        />

        {/* LEADERBOARDS — Coming Soon in Phase 1 */}
        <AppButton
          label="Leaderboards"
          onPress={onComingSoon}
          variant="ghost"
          style={styles.menuButton}
        />

        {/* SHOP — Coming Soon in Phase 1 */}
        <AppButton
          label="Shop"
          onPress={onComingSoon}
          variant="ghost"
          style={styles.menuButton}
        />

      </View>

      {/* Version number at the bottom */}
      <AppText variant="label" style={styles.version}>
        v{APP_CONFIG.version}
      </AppText>

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
  logo: {
    fontSize: 60,
  },
  title: {
    color: THEME.colors.primary,
    marginBottom: THEME.spacing.lg,
  },
  menu: {
    width: '100%',
    gap: THEME.spacing.sm,
  },
  menuButton: {
    width: '100%',
  },
  version: {
    position: 'absolute',
    bottom: THEME.spacing.lg,
    color: THEME.colors.textSecondary,
  },
});