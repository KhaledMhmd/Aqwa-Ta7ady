// ============================================================
// auth.screen.tsx
// Sign In / Sign Up / Play as Guest screen.
// Includes language switcher with "Language" label.
// Switching language restarts the app.
// Angular equivalent: AuthComponent with language toggle.
// ============================================================

import React, { useState } from 'react';                            // React core + state hook.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  TextInput,                                                         // Text input for player name.
  Alert,                                                             // Native alert dialog.
  Image,                                                             // Logo image.
  TouchableOpacity,                                                  // Pressable wrapper for flags.
  ScrollView,                                                        // Scrollable wrapper — prevents clipping on small screens.
  useWindowDimensions,                                               // FIX — reactive screen dimensions.
} from 'react-native';
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Nav type.
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area from correct package.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { TTT_CONFIG } from '../games/tic-tac-toe/config/game.config'; // Avatar list.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { useLanguage } from '../core/i18n/language.context';        // Translations + language setter.
import { THEME } from '../core/theme/theme.config';                 // Static spacing/sizes.
import CountryFlag from 'react-native-country-flag';                // Flag components.

// ── Angular equivalent ────────────────────────────────
// In Angular this would be a standalone component with:
// constructor(private router: Router, private langService: LanguageService, private themeService: ThemeService)
// Template would use *ngFor for avatars, (click) handlers, [class.active] bindings.

// Navigation type for this screen.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Auth'>;

export const AuthScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Access navigation.
  const { colors } = useTheme();                                     // Dynamic theme colours.

  // FIX — useWindowDimensions() inside the component body.
  // Replaces Dimensions.get('window') which caused intermittent zoom bugs.
  // Angular equivalent: HostListener('window:resize') or BreakpointObserver.
  const { width } = useWindowDimensions();

  // FIX — Logo scaled up to 65% of screen width, capped at 260px.
  // Was 50%/200 — too small for the screen's focal point.
  const LOGO_SIZE = Math.min(width * 0.65, 260);

  // useLanguage gives us translations (t) and setLanguage function.
  // Angular equivalent: injecting TranslationService.
  const { t, language, setLanguage } = useLanguage();

  // Player name input state.
  const [playerName, setPlayerName] = useState<string>('');

  // Selected avatar emoji — defaults to first in the list.
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    TTT_CONFIG.availableAvatars[0]
  );

  // FIX — Track input focus state for visual feedback.
  // When true, the input border changes to focusBorder colour.
  // Angular equivalent: (focus) and (blur) event bindings on the input.
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}                   // Inner padding and layout.
        showsVerticalScrollIndicator={false}                           // Hide scrollbar.
        keyboardShouldPersistTaps="handled"                            // Allow tapping buttons while keyboard is open.
      >

        {/* ── LOGO — hero focal point of the screen ───────── */}
        {/* Angular equivalent: <img [src]="logoPath" [style.width.px]="logoSize"> */}
        <Image
          source={require('../../assets/appLogo2.png')}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
          resizeMode="contain"
        />

        {/* ── NAME INPUT SECTION ──────────────────────────── */}
        <View style={styles.inputSection}>

          {/* Name input — FIX: added focus state with visible border colour. */}
          {/* Angular equivalent: <input [class.focused]="isInputFocused" (focus)="onFocus()" (blur)="onBlur()"> */}
          <TextInput
            style={[styles.input, {
              backgroundColor: colors.surfaceLight,                    // Input background from theme.
              color: colors.textPrimary,                               // Text colour from theme.
              borderColor: isInputFocused ? colors.focusBorder : colors.border, // FIX — visible focus state.
              borderWidth: isInputFocused ? 2 : 1,                     // FIX — thicker border on focus.
              textAlign: language === 'ar' ? 'right' : 'left',        // RTL support.
            }]}
            placeholder={t.auth.enterName}                             // Translated placeholder.
            placeholderTextColor={colors.textSecondary}                // Muted placeholder colour.
            value={playerName}                                         // Controlled input value.
            onChangeText={setPlayerName}                               // Update state on every keystroke.
            onFocus={() => setIsInputFocused(true)}                    // FIX — track focus state.
            onBlur={() => setIsInputFocused(false)}                    // FIX — track blur state.
            maxLength={20}                                             // Cap name length.
            autoCapitalize="words"                                     // Capitalise first letter of each word.
          />

          {/* Avatar selector label. */}
          <AppText
            variant="caption"
            style={[
              styles.avatarLabel,
              { textAlign: language === 'ar' ? 'right' : 'left' },   // RTL support.
            ] as any}
          >
            {t.auth.chooseAvatar}
          </AppText>

          {/* Avatar emoji row — FIX: bigger tap targets (52×52). */}
          {/* Angular equivalent: *ngFor="let avatar of avatars" with [class.selected]. */}
          <View style={styles.avatarRow}>
            {TTT_CONFIG.availableAvatars.map((avatar) => (
              <AppButton
                key={avatar}                                           // Unique key for React list.
                label={avatar}                                         // Emoji as the label.
                onPress={() => setSelectedAvatar(avatar)}              // Select this avatar.
                variant={selectedAvatar === avatar ? 'primary' : 'ghost'} // Highlight selected.
                style={styles.avatarButton}                            // FIX — larger tap target.
                labelStyle={styles.avatarEmoji}                        // FIX — larger emoji font.
              />
            ))}
          </View>
        </View>

        {/* ── AUTH ACTIONS — grouped tightly together ────── */}
        <View style={styles.authActions}>

          {/* Play as Guest — primary CTA. */}
          <AppButton
            label={t.auth.playAsGuest}
            onPress={onPlayAsGuest}
            style={styles.mainButton}
          />

          {/* Divider. */}
          <AppText variant="caption" style={{ color: colors.textSecondary, textAlign: 'center' }}>
            {t.auth.orDivider}
          </AppText>

          {/* Sign In — Coming Soon. */}
          <AppButton
            label={t.auth.signIn}
            onPress={onComingSoon}
            variant="secondary"
            style={styles.mainButton}
          />

          {/* Sign Up — Coming Soon. */}
          <AppButton
            label={t.auth.signUp}
            onPress={onComingSoon}
            variant="ghost"
            style={styles.mainButton}
          />
        </View>

        {/* ── LANGUAGE SWITCHER — with "Language" label ──── */}
        {/* FIX: Added label, increased flag tap targets to 48×48, removed hardcoded colour. */}
        {/* Angular equivalent: a <div class="language-switcher"> with (click) and [class.active]. */}
        <View style={styles.languageSection}>

          {/* Language label — "Language" / "اللغة". */}
          <AppText variant="caption" style={{ color: colors.textSecondary }}>
            {t.auth.languageLabel}
          </AppText>

          <View style={styles.languageRow}>
            {/* Egyptian flag — Arabic. */}
            <TouchableOpacity
              onPress={() => setLanguage('ar')}                        // Switch to Arabic.
              style={[
                styles.flagButton,
                // FIX — uses colors.focusBorder instead of hardcoded #378ADD.
                language === 'ar' && { borderColor: colors.focusBorder },
              ] as any}
            >
              <CountryFlag
                isoCode="EG"
                size={32}
                style={{ width: '100%', height: '100%', borderRadius: THEME.borderRadius.full }}
              />
            </TouchableOpacity>

            {/* UK flag — English. */}
            <TouchableOpacity
              onPress={() => setLanguage('en')}                        // Switch to English.
              style={[
                styles.flagButton,
                language === 'en' && { borderColor: colors.focusBorder },
              ] as any}
            >
              <CountryFlag
                isoCode="GB"
                size={32}
                style={{ width: '100%', height: '100%', borderRadius: THEME.borderRadius.full }}
              />
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Safe area wrapper — fills the screen.
  safeArea: {
    flex: 1,
  },
  // ScrollView inner content — centered column layout.
  scrollContent: {
    flexGrow: 1,                                                     // Grow to fill available space.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'center',                                        // Center vertically when content is short.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    paddingVertical: THEME.spacing.lg,                               // 24 — top/bottom breathing room.
    gap: THEME.spacing.lg,                                           // FIX — 24 instead of 8, better visual grouping.
  },
  // Input + avatar section — grouped together.
  inputSection: {
    width: '100%',                                                   // Full width.
    gap: THEME.spacing.sm,                                           // 8 — tight internal spacing.
  },
  // Text input field — FIX: taller for better tap target.
  input: {
    width: '100%',                                                   // Full width.
    height: 52,                                                      // FIX — 52 instead of 48, more comfortable.
    borderRadius: THEME.borderRadius.md,                             // 8 — rounded corners.
    paddingHorizontal: THEME.spacing.md,                             // 16 — inner horizontal padding.
    fontSize: THEME.fontSizes.lg,                                    // FIX — 16 instead of 14, easier to read.
  },
  // Avatar section label.
  avatarLabel: {
    width: '100%',                                                   // Full width for text alignment.
    marginTop: THEME.spacing.xs,                                     // 4 — small gap above.
  },
  // Avatar emoji row — wraps on smaller screens.
  avatarRow: {
    flexDirection: 'row',                                            // Side by side.
    flexWrap: 'wrap',                                                // Wrap to next line if needed.
    gap: THEME.spacing.sm,                                           // FIX — 8 instead of 4, less cramped.
    justifyContent: 'center',                                        // Center avatars.
  },
  // FIX — Each avatar button — bigger tap targets (52×52 instead of 44×44).
  avatarButton: {
    minHeight: 52,                                                   // FIX — bigger than 44pt minimum.
    minWidth: 52,                                                    // FIX — bigger than 44pt minimum.
    paddingHorizontal: THEME.spacing.sm,                             // 8 — inner padding.
  },
  // FIX — Larger emoji inside the avatar button.
  avatarEmoji: {
    fontSize: 24,                                                    // FIX — bigger emoji, easier to see.
  },
  // Auth action buttons grouped together.
  authActions: {
    width: '100%',                                                   // Full width.
    gap: THEME.spacing.sm,                                           // 8 — tight spacing between auth buttons.
  },
  // Full-width button.
  mainButton: {
    width: '100%',
  },
  // Language section — label + flags.
  languageSection: {
    alignItems: 'center',                                            // Center the label and flags.
    gap: THEME.spacing.sm,                                           // 8 — gap between label and flag row.
    marginTop: THEME.spacing.sm,                                     // 8 — small gap above section.
  },
  // Language flag row — flags side by side.
  languageRow: {
    flexDirection: 'row',                                            // Side by side.
    gap: THEME.spacing.md,                                           // 16 — gap between flags.
    justifyContent: 'center',                                        // Center flags.
  },
  // FIX — Each flag button — 48×48 instead of 32×32. Meets Apple's 44pt minimum.
  flagButton: {
    width: 48,                                                       // FIX — was 32, now meets accessibility minimum.
    height: 48,                                                      // FIX — was 32.
    borderRadius: THEME.borderRadius.full,                           // Fully circular.
    alignItems: 'center',                                            // Center flag vertically.
    justifyContent: 'center',                                        // Center flag horizontally.
    overflow: 'hidden',                                              // Clip flag to circle.
    borderWidth: 3,                                                  // Default border — invisible until active.
    borderColor: 'transparent',                                      // Invisible by default.
  },
});