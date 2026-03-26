// ============================================================
// home.screen.tsx
// Main menu screen.
// Play and Settings are fully functional.
// Leaderboards and Shop show Coming Soon.
// Angular equivalent: HomeComponent with Router.navigate() calls.
// ============================================================

import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

  const onComingSoon = () => {
    Alert.alert('Coming Soon', 'This feature will be available in a future update.');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      <AppText variant="h1" style={styles.logo}>⚽</AppText>

      <AppText variant="h2" style={{ color: colors.primary }}>
        {APP_CONFIG.name}
      </AppText>

      <View style={styles.menu}>

        <AppButton
          label="Play"
          onPress={() => navigation.navigate('GameSelect')}
          style={styles.menuButton}
        />

        <AppButton
          label="Settings"
          onPress={() => navigation.navigate('Settings')}
          variant="secondary"
          style={styles.menuButton}
        />

        <AppButton
          label="Help"
          onPress={() => navigation.navigate('Help')}
          variant="secondary"
          style={styles.menuButton}
        />

        <AppButton
          label="Leaderboards"
          onPress={onComingSoon}
          variant="ghost"
          style={styles.menuButton}
        />

        <AppButton
          label="Shop"
          onPress={onComingSoon}
          variant="ghost"
          style={styles.menuButton}
        />

      </View>

      <AppText variant="label" style={[styles.version, { color: colors.textSecondary }] as any}>
        v{APP_CONFIG.version}
      </AppText>

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
  logo: {
    fontSize: 60,
  },
  menu: {
    width: '100%',
    gap: THEME.spacing.sm,
    marginTop: THEME.spacing.lg,
  },
  menuButton: {
    width: '100%',
  },
  version: {
    position: 'absolute',
    bottom: THEME.spacing.lg,
  },
});