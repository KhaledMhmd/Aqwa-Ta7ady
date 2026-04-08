// ============================================================
// splash.screen.tsx
// First screen shown on app launch.
// Shows the app logo image instead of the emoji + text.
// Auto-navigates to Auth after 2 seconds.
// ============================================================

import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,        // Image component — renders the logo file.
  Dimensions,   // Gets screen dimensions for responsive sizing.
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { useTheme } from '../core/theme/theme.context';
import { useLanguage } from '../core/i18n/language.context';
import { THEME } from '../core/theme/theme.config';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

// Get screen width to size the logo responsively.
const { width } = Dimensions.get('window');

// Cap logo size so it looks good on both small and large screens.
const LOGO_SIZE = Math.min(width * 0.75, 320);

export const SplashScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const { t } = useLanguage();

  // Navigate to Auth after 2 seconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* App logo image — replaces the old emoji + text combination. */}
      <Image
        // require() loads a local asset from the project folder. 
        // The path is relative to this file's location.
        // Angular equivalent: <img [src]="logoPath"> with an assets path.
        source={require('../../assets/appLogo2.png')}
        style={styles.logo}
        // resizeMode='contain' scales the image to fit within the bounds
        // without cropping or stretching it.
        // Angular equivalent: object-fit: contain in CSS.
        resizeMode="contain"
      />

      {/* Tagline below the logo */}
      <AppText variant="caption" style={{ color: colors.textSecondary }}>
        {t.common.appTagline}
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
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});