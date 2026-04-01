// ============================================================
// auth.screen.tsx
// Sign In / Sign Up / Play as Guest screen.
// Now includes language switcher — Egyptian flag for Arabic,
// UK flag for English. Switching language restarts the app.
// Angular equivalent: AuthComponent with language toggle.
// ============================================================

import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/app.navigator';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { APP_CONFIG } from '../core/config/app.config';
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config';
import { useTheme } from '../core/theme/theme.context';
import { useLanguage } from '../core/i18n/language.context';
import { THEME } from '../core/theme/theme.config';
import CountryFlag from 'react-native-country-flag';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.5, 200);
  // useLanguage gives us translations (t) and setLanguage function.
  // Angular equivalent: injecting TranslationService.
  const { t, language, setLanguage } = useLanguage();

  const [playerName, setPlayerName] = useState<string>('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    TTT_CONFIG.availableAvatars[0]
  );

  const onPlayAsGuest = () => {
    if (playerName.trim().length === 0) {
      Alert.alert(t.auth.nameRequired, t.auth.nameRequiredMessage);
      return;
    }
    navigation.replace('Home', {
      playerName: playerName.trim(),
      playerAvatar: selectedAvatar,
    });
  };

  const onComingSoon = () => {
    Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>



      {/* Logo image replaces the app name text. */}
<Image
  source={require('../../assets/appLogo.png')}
  style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
  resizeMode="contain"
/>

      {/* Name input */}
      <TextInput
        style={[styles.input, {
          backgroundColor: colors.surfaceLight,
          color: colors.textPrimary,
          borderColor: colors.border,
          textAlign: language === 'ar' ? 'right' : 'left',
        }]}
        placeholder={t.auth.enterName}
        placeholderTextColor={colors.textSecondary}
        value={playerName}
        onChangeText={setPlayerName}
        maxLength={20}
        autoCapitalize="words"
      />

      {/* Avatar selector */}
      <AppText variant="caption" style={styles.avatarLabel}>
        {t.auth.chooseAvatar}
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

      {/* Play as Guest */}
      <AppButton
        label={t.auth.playAsGuest}
        onPress={onPlayAsGuest}
        style={styles.mainButton}
      />

      <AppText variant="caption" style={{ color: colors.textSecondary }}>
        {t.auth.orDivider}
      </AppText>

      {/* Sign In — Coming Soon */}
      <AppButton
        label={t.auth.signIn}
        onPress={onComingSoon}
        variant="secondary"
        style={styles.mainButton}
      />

      {/* Sign Up — Coming Soon */}
      <AppButton
        label={t.auth.signUp}
        onPress={onComingSoon}
        variant="ghost"
        style={styles.mainButton}
      />
{/* ── LANGUAGE SWITCHER — bottom of screen ───────── */}
{/* Uses TouchableOpacity instead of AppButton so flags
    render as large clean emojis without button borders.
    Angular equivalent: plain <button> with no styling. */}
<View style={styles.languageRow}>

  {/* Egyptian flag */}
<TouchableOpacity
  onPress={() => setLanguage('ar')}
  style={[
    styles.flagButton,
    // Blue border when this language is active.
    // Angular equivalent: [class.active]="language === 'ar'"
    language === 'ar' && styles.activeFlagButton,
  ] as any}
>
  <CountryFlag isoCode="EG" size={32} style={{ width: '100%', height: '100%', borderRadius: THEME.borderRadius.full }} />
</TouchableOpacity>

{/* UK flag */}
<TouchableOpacity
  onPress={() => setLanguage('en')}
  style={[
    styles.flagButton,
    language === 'en' && styles.activeFlagButton,
  ] as any}
>
  <CountryFlag isoCode="GB" size={32} style={{ width: '100%', height: '100%', borderRadius: THEME.borderRadius.full }} />
</TouchableOpacity>
</View>
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
  // Language switcher row — sits at the top of the screen.
 // Language row — sits at the bottom of the screen.
languageRow: {
  flexDirection: 'row',
  gap: THEME.spacing.md,
  marginTop: THEME.spacing.lg,
  justifyContent: 'center',
},

// Each flag button — circular tap target with subtle highlight.
flagButton: {
  width: 32,
  height: 32,
  borderRadius: THEME.borderRadius.full,
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  // Default border — invisible, keeps layout stable so
  // adding the active border does not shift the layout.
  borderWidth: 3,
  borderColor: 'transparent',
},

// Active flag button — blue outline border.
// Applied on top of flagButton when this language is selected.
activeFlagButton: {
  borderColor: '#378ADD',  // Blue — distinct from our green primary colour.
  borderWidth: 3,
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