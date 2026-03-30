// ============================================================
// home.screen.tsx
// Main menu screen.
// Play and Settings are fully functional.
// Leaderboards and Shop show Coming Soon.
// Angular equivalent: HomeComponent with Router.navigate() calls.
// ============================================================

import React from 'react';
import { View, StyleSheet, Alert, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useLanguage } from '../core/i18n/language.context';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type RoutePropType = RouteProp<RootStackParamList, 'Home'>;

export const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const route = useRoute<RoutePropType>();
  const { t } = useLanguage();
const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.45, 180);
  const { playerName, playerAvatar } = route.params;
  const onComingSoon = () => {
    Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>

      {/* Logo replaces emoji + app name text. */}
<Image
  source={require('../../assets/appLogo.png')}
  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
  resizeMode="contain"
/> 
      <AppText variant="h3" style={{ color: colors.textSecondary }}>
          {t.home.welcome}
        </AppText>
  <AppText variant="h2" style={{ color: colors.primary }}>
    {playerAvatar} {playerName}
  </AppText>


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