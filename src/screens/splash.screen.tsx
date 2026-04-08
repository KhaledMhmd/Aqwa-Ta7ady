// ============================================================
// splash.screen.tsx
// First screen shown on app launch.
// Shows the app logo image instead of the emoji + text.
// Auto-navigates to Auth after 2 seconds.
// Angular equivalent: SplashComponent with ngOnInit() timer.
// ============================================================

import React, { useEffect } from 'react';                          // React core + useEffect for timer.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  Image,                                                             // Image component — renders the logo file.
  useWindowDimensions,                                               // FIX — reactive screen dimensions, avoids zoom bugs.
} from 'react-native';
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Nav type.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.

// Navigation type for this screen.
// Angular equivalent: Router type with typed routes.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Access navigation.
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { t } = useLanguage();                                       // Translations.

  // FIX — useWindowDimensions() inside the component body.
  // Updates reactively if screen rotates or layout changes.
  // Dimensions.get('window') at module level caused intermittent zoom bugs.
  // Angular equivalent: HostListener('window:resize') or BreakpointObserver.
  const { width } = useWindowDimensions();

  // Cap logo size so it looks good on both small and large screens.
  // 75% of screen width, capped at 320px for tablets.
  const LOGO_SIZE = Math.min(width * 0.75, 320);

  // Navigate to Auth after 2 seconds.
  // Angular equivalent: ngOnInit() { setTimeout(() => this.router.navigate(['/auth']), 2000); }
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');                                    // Replace so user can't go back to splash.
    }, 2000);
    return () => clearTimeout(timer);                                // Cleanup if component unmounts early.
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* App logo image — the hero of the splash screen. */}
      {/* Angular equivalent: <img [src]="logoPath" [style.width.px]="logoSize"> */}
      <Image
        source={require('../../assets/appLogo2.png')}                // Local asset via require().
        style={{ width: LOGO_SIZE, height: LOGO_SIZE }}              // Dynamic size based on screen width.
        resizeMode="contain"                                         // Fit without cropping.
      />

      {/* Tagline below the logo. */}
      <AppText variant="caption" style={{ color: colors.textSecondary }}>
        {t.common.appTagline}
      </AppText>

    </View>
  );
};

const styles = StyleSheet.create({
  // Full screen centered container.
  container: {
    flex: 1,                                                         // Fill entire screen.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'center',                                        // Center vertically.
    gap: THEME.spacing.md,                                           // 16 — gap between logo and tagline.
  },
});