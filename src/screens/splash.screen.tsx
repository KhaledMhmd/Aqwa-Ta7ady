// ============================================================
// splash.screen.tsx
// First screen shown on app launch.
// Auto-navigates to Auth after 2 seconds.
// Angular equivalent: SplashComponent using Router.navigate()
// inside ngOnInit() after a setTimeout.
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { APP_CONFIG } from '../core/config/app.config';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  // Get active colours from ThemeContext.
  const { colors } = useTheme();

  // Navigate to Auth after 2 seconds.
  // Angular equivalent: ngOnInit() { setTimeout(() => this.router.navigate(['/auth']), 2000) }
  useEffect(() => {
    const timer = setTimeout(() => {
      // replace() removes Splash from the stack so back button skips it.
      navigation.replace('Auth');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppText variant="h1" style={styles.logo}>⚽</AppText>
      <AppText variant="h2" style={{ color: colors.primary }}>
        {APP_CONFIG.name}
      </AppText>
      <AppText variant="caption">
        {APP_CONFIG.tagline}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: THEME.spacing.md,
  },
  logo: {
    fontSize: 80,
    marginBottom: THEME.spacing.sm,
  },
});