// ============================================================
// auth.screen.tsx
// Sign In / Sign Up / Play as Guest screen.
// Now includes language switcher — Egyptian flag for Arabic,
// UK flag for English. Switching language restarts the app.
// Keyboard handling: KeyboardAvoidingView shifts content up,
// keyboardDismissMode="on-drag" dismisses on scroll,
// Pressable on logo area dismisses on tap.
// Angular equivalent: AuthComponent with language toggle.
// ============================================================

import React, { useCallback, useState } from 'react';               // React core + hooks.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  TextInput,                                                         // Text input for player name.
  Alert,                                                             // Native alert dialog.
  Image,                                                             // Logo image.
  Dimensions,                                                        // Screen dimensions.
  TouchableOpacity,                                                  // Pressable wrapper for flags.
  KeyboardAvoidingView,                                              // Pushes content above keyboard when it opens.
  Keyboard,                                                          // Programmatic keyboard dismiss.
  Platform,                                                          // iOS vs Android detection for keyboard behavior.
  ScrollView,                                                        // Scrollable content — allows scrolling when keyboard is open.
  Pressable,                                                         // Tap-to-dismiss keyboard on non-interactive areas (logo).
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Nav type.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { APP_CONFIG } from '../core/config/app.config';             // App-wide constants.
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config'; // Avatar list.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { useLanguage } from '../core/i18n/language.context';        // Translations + language setter.
import { THEME } from '../core/theme/theme.config';                 // Static spacing/sizes.
import CountryFlag from 'react-native-country-flag';                // Flag components.

// Navigation type for this screen.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Access navigation.
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { width } = Dimensions.get('window');                        // Screen width for logo sizing.
  const LOGO_SIZE = Math.min(width * 0.5, 200);                     // Logo size — 50% of width, max 200.
const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // useLanguage gives us translations (t) and setLanguage function.
  // Angular equivalent: injecting TranslationService.
  const { t, language, setLanguage } = useLanguage();

  // Player name input state.
  const [playerName, setPlayerName] = useState<string>('');

  // Selected avatar emoji — defaults to first in the list.
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    TTT_CONFIG.availableAvatars[0]
  );

  // Play as Guest — validates name then navigates to Home.
  const onPlayAsGuest = () => {
    if (playerName.trim().length === 0) {                            // Empty name — show alert.
      Alert.alert(t.auth.nameRequired, t.auth.nameRequiredMessage);
      return;
    }
    navigation.replace('Home', {                                     // Replace so user can't go back.
      playerName: playerName.trim(),
      playerAvatar: selectedAvatar,
    });
  };

  // Coming Soon handler for Sign In / Sign Up.
  const onComingSoon = () => {
    Alert.alert(t.common.comingSoon, t.common.comingSoonMessage);
  };

  // Debug log — runs every time screen becomes visible.
  useFocusEffect(
    useCallback(() => {
      console.log(language);                                         // Logs current language on focus.
    }, [])
  );

  return (
    // KeyboardAvoidingView — shifts the entire content upward when the keyboard opens
    // so the input field stays visible and not hidden behind the keyboard.
    // behavior='padding' on iOS adds bottom padding equal to keyboard height.
    // behavior='height' on Android adjusts the view height instead.
    // Angular equivalent: browsers handle this natively — no equivalent needed.
    <KeyboardAvoidingView
      style={[styles.keyboardAvoid, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >

      {/* ScrollView wraps all content so the screen is scrollable when keyboard is open. */}
      {/* keyboardDismissMode="on-drag" — dragging/scrolling dismisses the keyboard. */}
      {/* onScrollBeginDrag={Keyboard.dismiss} — immediately dismisses on any scroll gesture. */}
      {/* keyboardShouldPersistTaps="handled" — allows tapping buttons while keyboard is open. */}
      {/* Angular equivalent: no equivalent — browsers handle scroll + keyboard natively. */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        onScrollBeginDrag={Keyboard.dismiss}
      >

        {/* Logo image — wrapped in Pressable so tapping it dismisses the keyboard. */}
        {/* Without this, the only way to dismiss keyboard is scrolling or pressing Enter. */}
        {/* Angular equivalent: (click)="onBackdropClick()" on a wrapper div. */}
        <Pressable onPress={Keyboard.dismiss}>
          <Image
            source={require('../../assets/appLogo2.png')}
            style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
            resizeMode="contain"
          />
        </Pressable>

        {/* Name input */}
        <TextInput
  style={[styles.input, {
    backgroundColor: colors.surfaceLight,
    color: colors.textPrimary,
    borderColor: isInputFocused ? colors.primary : colors.border,  // Purple border on focus.
    borderWidth: isInputFocused ? 2 : 1,                           // Thicker on focus.
    textAlign: language === 'ar' ? 'right' : 'left',
  }]}
  placeholder={t.auth.enterName}
  placeholderTextColor={colors.textSecondary}
  value={playerName}
  onChangeText={setPlayerName}
  onFocus={() => setIsInputFocused(true)}
  onBlur={() => setIsInputFocused(false)}
  maxLength={20}
  autoCapitalize="words"
/>

        {/* Avatar selector */}
        <AppText
          variant="caption"
          style={[
            styles.avatarLabel,                                      // Base styles — width + margin.
            { textAlign: language === 'ar' ? 'right' : 'left' },    // RTL support.
          ] as any}
        >
          {t.auth.chooseAvatar}
        </AppText>

        <View style={styles.avatarRow}>
          {TTT_CONFIG.availableAvatars.map((avatar) => (
            <AppButton
              key={avatar}                                           // Unique key for React list.
              label={avatar}                                         // Emoji as the label.
              onPress={() => setSelectedAvatar(avatar)}              // Select this avatar.
              variant={selectedAvatar === avatar ? 'primary' : 'ghost'} // Highlight selected.
              style={styles.avatarButton}                            // Tap target size.
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
        {/* Uses TouchableOpacity instead of AppButton so flags */}
        {/* render as large clean emojis without button borders. */}
        {/* Angular equivalent: plain <button> with no styling. */}
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

      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // KeyboardAvoidingView — fills the screen, acts as the root container.
  // Replaces the old <View style={styles.container}>.
  // Angular equivalent: the host element with height: 100%.
  keyboardAvoid: {
    flex: 1,                                                         // Fill entire screen.
  },
  // ScrollView inner content — centered column layout.
  // Replaces the old container alignment styles.
  // flexGrow: 1 ensures content centers vertically when shorter than screen.
  scrollContent: {
    flexGrow: 1,                                                     // Grow to fill available space.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'center',                                        // Center vertically when content is short.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    gap: THEME.spacing.sm,                                           // 8 — gap between elements (same as original).
  },
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
    width: '100%',
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