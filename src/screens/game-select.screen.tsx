// ============================================================
// game-select.screen.tsx
// Choose a Game screen.
// Grid Challenge is playable, others are Coming Soon.
// Header pattern: ← back | title | spacer (matches game.screen.tsx).
// Angular equivalent: GameSelectComponent with Router.navigate().
// ============================================================

import React from 'react';                                          // React core.
import {
  View,                                                              // Container element.
  StyleSheet,                                                        // Style creation.
  ScrollView,                                                        // Scrollable wrapper.
  Alert,                                                             // Native alert dialog.
  Image,                                                             // Game icon images.
  TouchableOpacity,                                                  // Pressable wrapper for game cards.
  Dimensions,                                                        // Screen dimensions for responsive sizing.
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';      // FIX — proper safe area, avoids notch/status bar cropping.
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { AppBackButton } from '../core/components/app-back-button.component'; // Circular back button.

// Navigation type for this screen.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

// Route type for reading params passed to this screen.
type RoutePropType = RouteProp<RootStackParamList, 'GameSelect'>;

// GameCardData defines the shape of each game entry.
type GameCardData = {
  id: string;                                                        // Unique identifier.
  title: string;                                                     // Display name.
  description: string;                                               // Short description.
  isAvailable: boolean;                                              // true = playable, false = locked.
};

// Screen width for responsive sizing.
const { width } = Dimensions.get('window');

// Icon circle diameter — consistent across all cards.
const ICON_SIZE = 56;

// Icon area height — darker inner rectangle behind the icon.
const ICON_AREA_HEIGHT = 120;

export const GameSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();                // Navigate to other screens.
  const { colors } = useTheme();                                     // Dynamic theme colours.
  const { t } = useLanguage();                                       // Active translations.
  const route = useRoute<RoutePropType>();                           // Read params from previous screen.

  // Read player info passed from HomeScreen.
  const { playerName, playerAvatar } = route.params;

  // Games array — single source of truth for all game cards.
  const games: GameCardData[] = [
    {
      id: 'grid-challenge',
      title: t.gameSelect.gridChallenge,
      description: t.gameSelect.gridChallengeDesc,
      isAvailable: true,                                             // Phase 1 — playable.
    },
    {
      id: 'snakes-and-ladders',
      title: t.gameSelect.snakesAndLadders,
      description: t.gameSelect.snakesAndLaddersDesc,
      isAvailable: false,                                            // Coming Soon.
    },
    {
      id: 'hangman',
      title: t.gameSelect.hangman,
      description: t.gameSelect.hangmanDesc,
      isAvailable: false,                                            // Coming Soon.
    },
  ];

  // onGamePress handles tapping a game card.
  const onGamePress = (game: GameCardData) => {
    if (!game.isAvailable) {
      Alert.alert(t.common.comingSoon, t.gameSelect.comingSoonGame);
      return;
    }
    navigation.navigate('TicTacToeModeSelect', { playerName, playerAvatar });
  };

  return (
    // FIX — SafeAreaView wraps the entire screen to prevent header cropping under status bar/notch.
    // This was a plain <View> before which caused the back button and title to sit under the notch.
    // Angular equivalent: no direct equivalent — browsers handle safe areas via env(safe-area-inset-top).
    <SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {t.gameSelect.title}
        </AppText>
        <View style={styles.headerBackButton} />
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            activeOpacity={game.isAvailable ? 0.7 : 1}
            onPress={() => onGamePress(game)}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            {/* Icon area — darker rectangle. */}
            <View style={[styles.iconArea, { backgroundColor: colors.background }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceLight }]}>
                <Image
                  source={require('../../assets/XOGameIcon.png')}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Text area — title + description. */}
            <View style={styles.textArea}>
              <AppText variant="h3" style={{ color: colors.textPrimary }}>
                {game.title}
              </AppText>
              <AppText variant="caption" style={{ color: colors.textSecondary }}>
                {game.description}
              </AppText>
            </View>

            {/* Coming Soon overlay for locked games. */}
            {!game.isAvailable && (
              <View style={[styles.comingSoonOverlay, { backgroundColor: colors.comingSoon }]}>
                <AppText variant="body" style={{
                  color: colors.textSecondary,
                  fontWeight: THEME.fontWeights.bold,
                }}>
                  {t.common.comingSoon}
                </AppText>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Full screen wrapper — now SafeAreaView.
  screen: {
    flex: 1,
  },
  // Header row.
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
  },
  // Back button spacer.
  headerBackButton: {
    width: 44,
  },
  // Scrollable content area.
  container: {
    alignItems: 'center',
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.sm,
    paddingBottom: THEME.spacing.xl,
    gap: THEME.spacing.md,
  },
  // Game card.
  card: {
    width: '100%',
    borderRadius: THEME.borderRadius.lg,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  // Darker inner area behind the game icon.
  iconArea: {
    width: '100%',
    height: ICON_AREA_HEIGHT,
    borderTopLeftRadius: THEME.borderRadius.lg,
    borderTopRightRadius: THEME.borderRadius.lg,
    justifyContent: 'center',
    paddingHorizontal: THEME.spacing.md,
  },
  // Circular icon container.
  iconCircle: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Game icon image.
  iconImage: {
    width: ICON_SIZE * 0.7,
    height: ICON_SIZE * 0.7,
  },
  // Text section below icon area.
  textArea: {
    padding: THEME.spacing.md,
    gap: THEME.spacing.xs,
  },
  // Coming Soon overlay.
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: THEME.borderRadius.lg,
  },
});