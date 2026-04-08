// ============================================================
// home.screen.tsx
// Main menu screen.
// Play and Settings are fully functional.
// Leaderboards and Shop show Coming Soon.
// Angular equivalent: HomeComponent with Router.navigate() calls.
// ============================================================

import React from 'react';                                          // React core.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  Alert,                                                             // Native alert dialog.
  Image,                                                             // Logo image.
  useWindowDimensions,                                               // FIX — reactive screen dimensions.
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area.
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { APP_CONFIG } from '../core/config/app.config';             // App-wide constants.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.

// ── Angular equivalent ────────────────────────────────
// In Angular this would be a standalone component with:
// constructor(private router: Router) and
// template using routerLink for navigation.

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RoutePropType = RouteProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Navigate to other screens.
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const route = useRoute<RoutePropType>();                           // Read params from previous screen.
  const { t } = useLanguage();                                       // Translations.

  // FIX — useWindowDimensions() instead of Dimensions.get('window').
  const { width } = useWindowDimensions();

  // Logo size — 45% of screen width, capped at 180px.
  const LOGO_SIZE = Math.min(width * 0.45, 180);

  // Read player info passed from AuthScreen.
  const { playerName, playerAvatar } = route.params;

  // Coming Soon handler for locked features.
  const onComingSoon = () => {
    Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={styles.container}>

        {/* ── TOP SECTION — logo + welcome ───────────────── */}
        <View style={styles.topSection}>

          {/* Logo image. */}
          <Image
            source={require('../../assets/appLogo2.png')}
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
            resizeMode="contain"
          />

          {/* Welcome greeting + player info. */}
          <AppText variant="accent" style={{ color: colors.textSecondary }}>
            {t.home.welcome}
          </AppText>
          <AppText variant="h2" style={{ color: colors.primary }}>
            {playerAvatar} {playerName}
          </AppText>
        </View>

        {/* ── MENU BUTTONS ───────────────────────────────── */}
        <View style={styles.menu}>
          <AppButton
            label={t.home.play}
            onPress={() => navigation.navigate('GameSelect', { playerName, playerAvatar })}
            style={styles.menuButton}
          />
          <AppButton
            label={t.home.settings}
            onPress={() => navigation.navigate('Settings')}
            variant="secondary"
            style={styles.menuButton}
          />
          <AppButton
            label={t.home.help}
            onPress={() => navigation.navigate('Help')}
            variant="secondary"
            style={styles.menuButton}
          />
          <AppButton
            label={t.home.leaderboards}
            onPress={onComingSoon}
            variant="ghost"
            style={styles.menuButton}
          />
          <AppButton
            label={t.home.shop}
            onPress={onComingSoon}
            variant="ghost"
            style={styles.menuButton}
          />
        </View>

        {/* ── VERSION — pushed to bottom via flex spacer ── */}
        {/* FIX — uses flex layout instead of position: absolute. */}
        {/* Prevents overlap on small screens like iPhone SE. */}
        <View style={styles.versionContainer}>
          <AppText variant="label" style={{ color: colors.textSecondary }}>
            v{APP_CONFIG.version}
          </AppText>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // SafeAreaView — fills the screen, avoids notch.
  safeArea: {
    flex: 1,
  },
  // Main container — fills SafeArea, uses flex column.
  container: {
    flex: 1,                                                         // Fill available space.
    alignItems: 'center',                                            // Center horizontally.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
  },
  // Top section — logo + welcome — takes up available space, centered.
  topSection: {
    flex: 1,                                                         // Grows to push menu toward center.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'flex-end',                                      // Push content to the bottom of this area.
    gap: THEME.spacing.xs,                                           // 4 — tight gap between welcome elements.
    paddingBottom: THEME.spacing.md,                                 // 16 — breathing room before menu.
  },
  // Menu button group.
  menu: {
    width: '100%',                                                   // Full width.
    gap: THEME.spacing.sm,                                           // 8 — gap between buttons.
  },
  // Each menu button — full width.
  menuButton: {
    width: '100%',
  },
  // FIX — Version container pushed to bottom with flex, not absolute positioning.
  versionContainer: {
    flex: 1,                                                         // Grows to push version to the bottom.
    justifyContent: 'flex-end',                                      // Stick version to the bottom.
    paddingBottom: THEME.spacing.md,                                 // 16 — bottom breathing room.
  },
});