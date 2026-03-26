// ============================================================
// splash.screen.tsx
// The first screen the user sees when the app opens.
// Shows the app logo and name for 2 seconds then navigates
// automatically to the Auth screen.
// Angular equivalent: a SplashComponent that uses Router.navigate()
// inside ngOnInit() after a setTimeout.
// ============================================================

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

// useNavigation gives this screen access to the navigation object.
// Used to navigate to the next screen programmatically.
// Angular equivalent: injecting Router via constructor(private router: Router)
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { APP_CONFIG } from '../core/config/app.config';
import { THEME } from '../core/theme/theme.config';

// Type the navigation prop so TypeScript knows which screens
// we can navigate to from here.
// Angular equivalent: typed Router navigate calls.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {

  // useNavigation returns the navigation object for this screen.
  // Angular equivalent: private router = inject(Router)
  const navigation = useNavigation<NavigationProp>();

  // useEffect with [] runs once when the splash screen first mounts.
  // Waits 2 seconds then navigates to Auth.
  // Angular equivalent: ngOnInit() { setTimeout(() => this.router.navigate(['/auth']), 2000) }
  useEffect(() => {
    const timer = setTimeout(() => {
      // replace() navigates to Auth AND removes Splash from the stack.
      // This means pressing back on Auth does not go back to Splash.
      // Angular equivalent: this.router.navigate(['/auth'], { replaceUrl: true })
      navigation.replace('Auth');
    }, 12000); // 1000 milliseconds = 1 second.

    // Cleanup — cancel the timer if the component unmounts early.
    // Angular equivalent: ngOnDestroy() { clearTimeout(this.timer) }
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* App logo placeholder — replace with real logo image in later phase. */}
      <AppText variant="h1" style={styles.logo}>⚽</AppText>

      {/* App name from config — changing APP_CONFIG.name updates this. */}
      <AppText variant="h2" style={styles.title}>
        {APP_CONFIG.name}
      </AppText>

      {/* Tagline from config. */}
      <AppText variant="caption" style={styles.tagline}>
        {APP_CONFIG.tagline}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                                    // Fill the entire screen.
    backgroundColor: THEME.colors.background,  // Dark background from theme.
    alignItems: 'center',                       // Center children horizontally.
    justifyContent: 'center',                   // Center children vertically.
    gap: THEME.spacing.md,                      // Spacing between elements.
  },
  logo: {
    fontSize: 80,                               // Large logo emoji.
    marginBottom: THEME.spacing.sm,
  },
  title: {
    color: THEME.colors.primary,               // Red app name.
    letterSpacing: 1,
  },
  tagline: {
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: THEME.spacing.xl,
  },
});