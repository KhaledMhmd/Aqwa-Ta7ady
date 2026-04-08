// ── React Native ──────────────────────────────────────

// ============================================================
// game-select.screen.tsx
// List of available games displayed as surface cards.
// Each card shows: circular game icon, title, and description.
// Matches the "Neon Glistle" card design — dark inner surface
// with icon, bold title below, muted description under that.
// Phase 1: Grid Challenge is playable. Others show Coming Soon.
// Angular equivalent: GameSelectComponent with *ngFor over a
// games array, each rendered as a card with (click) handler.
// ============================================================

import React from 'react';                                    // React core — needed for JSX.
import {
  View,                                                        // Container element — like <div> in Angular.
  StyleSheet,                                                  // Creates optimised style objects.
  Alert,                                                       // Native alert dialog — like window.alert().
  Image,                                                       // Renders images — like <img> in Angular.
  TouchableOpacity,                                            // Pressable wrapper — like a clickable <div>.
  ScrollView,                                                  // Scrollable container — like overflow-y: auto.
  Dimensions,                                                  // Gets screen width/height for responsive sizing.
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Type for nav prop.
import { RootStackParamList } from '../navigation/app.navigator';              // All screen route types.
import { AppText } from '../core/components/app-text.component';               // Themed text component.
import { AppButton } from '../core/components/app-button.component';           // Themed button component.
import { useTheme } from '../core/theme/theme.context';                        // Theme hook — dynamic colours.
import { useLanguage } from '../core/i18n/language.context';                   // Language hook — translations.
import { THEME } from '../core/theme/theme.config';                            // Static spacing/font values.

// Navigation type for this screen.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

// Route type for reading params passed to this screen.
type RoutePropType = RouteProp<RootStackParamList, 'GameSelect'>;

// GameCardData defines the shape of each game entry.
// Angular equivalent: a Game interface in a models folder.
type GameCardData = {
  id: string;           // Unique identifier for the game.
  title: string;        // Display name shown on the card.
  description: string;  // Short description shown below the title.
  isAvailable: boolean; // true = playable, false = Coming Soon overlay.
};

// Screen width for responsive sizing.
const { width } = Dimensions.get('window');

// Icon circle diameter — consistent across all cards.
const ICON_SIZE = 56;

// Icon area height — the darker inner rectangle behind the icon.
// Takes roughly 40% of the card height for visual balance.
const ICON_AREA_HEIGHT = 120;

export const GameSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();  // Navigate to other screens.
  const { colors } = useTheme();                       // Dynamic theme colours.
  const { t } = useLanguage();                         // Active translations.
  const route = useRoute<RoutePropType>();              // Read params from previous screen.

  // Read player info passed from HomeScreen.
  // Angular equivalent: ActivatedRoute.snapshot.params
  const { playerName, playerAvatar } = route.params;

  // Games array — single source of truth for all game cards.
  // Angular equivalent: a games: Game[] array iterated with *ngFor.
  const games: GameCardData[] = [
    {
      id: 'grid-challenge',                            // Unique key for list rendering.
      title: t.gameSelect.gridChallenge,               // Translated game name.
      description: t.gameSelect.gridChallengeDesc,     // Translated description.
      isAvailable: true,                               // Phase 1 — playable.
    },
    {
      id: 'snakes-and-ladders',
      title: t.gameSelect.snakesAndLadders,
      description: t.gameSelect.snakesAndLaddersDesc,
      isAvailable: false,                              // Coming Soon.
    },
    {
      id: 'hangman',
      title: t.gameSelect.hangman,
      description: t.gameSelect.hangmanDesc,
      isAvailable: false,                              // Coming Soon.
    },
  ];

  // onGamePress handles tapping a game card.
  // If available, navigates to mode select. If not, shows Coming Soon alert.
  // Angular equivalent: a method called from (click) in the template.
  const onGamePress = (game: GameCardData) => {
    if (!game.isAvailable) {                                  // Game is locked — show alert.
      Alert.alert(t.common.comingSoon, t.gameSelect.comingSoonGame);
      return;
    }
    // Navigate to mode select with player info.
    navigation.navigate('TicTacToeModeSelect', { playerName, playerAvatar });
  };

  return (
    // ScrollView allows scrolling when more games are added.
    // Angular equivalent: a container div with overflow-y: auto.
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}  // Full screen with themed bg.
      contentContainerStyle={styles.container}                               // Inner padding and alignment.
      showsVerticalScrollIndicator={false}                                   // Hide scrollbar.
    >

      {/* Screen title */}
      <AppText variant="accent" style={{ color: colors.primary }}>
        {t.gameSelect.title}
      </AppText>

      {/* Game cards */}
      {/* Angular equivalent: *ngFor="let game of games" */}
      {games.map((game) => (
        <TouchableOpacity
          key={game.id}                                                      // Unique key for React list.
          activeOpacity={game.isAvailable ? 0.7 : 1}                         // Dim on press if available.
          onPress={() => onGamePress(game)}                                  // Handle tap.
          style={[
            styles.card,                                                     // Base card styles.
            {
              backgroundColor: colors.surface,                               // Card background from theme.
              borderColor: colors.border,                                    // Subtle border from theme.
            },
          ]}
        >

          {/* ── ICON AREA — darker inner rectangle with game icon ── */}
          <View style={[
            styles.iconArea,
            { backgroundColor: colors.background },                          // Darker than the card surface.
          ]}>
            {/* Circular icon container */}
            <View style={[
              styles.iconCircle,
              { backgroundColor: colors.surfaceLight },                      // Slightly lighter circle bg.
            ]}>
              {/* Game icon image — same for all games for now. */}
              {/* Replace with unique icons per game later. */}
              <Image
                source={require('../../assets/XOGameIcon.png')}                // Shared game icon.
                style={styles.iconImage}                                     // Fills the circle.
                resizeMode="contain"                                         // Fit without cropping.
              />
            </View>
          </View>

          {/* ── TEXT AREA — title + description ── */}
          <View style={styles.textArea}>
            {/* Game title — bold, primary text colour. */}
            <AppText variant="h3" style={{ color: colors.textPrimary }}>
              {game.title}
            </AppText>
            {/* Game description — muted, multi-line. */}
            <AppText variant="caption" style={{ color: colors.textSecondary }}>
              {game.description}
            </AppText>
          </View>

          {/* ── COMING SOON OVERLAY — covers locked games ── */}
          {/* Angular equivalent: *ngIf="!game.isAvailable" */}
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

      {/* Back button */}
      <AppButton
        label={t.common.back}                                               // Translated back label.
        onPress={() => navigation.goBack()}                                  // Go to previous screen.
        variant="ghost"                                                      // Subtle ghost style.
        style={styles.backButton}                                            // Full width.
      />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // ScrollView takes the full screen.
  scrollView: {
    flex: 1,                                           // Fill all available space.
  },
  // Inner content — centered with padding.
  container: {
    alignItems: 'center',                              // Center cards horizontally.
    paddingHorizontal: THEME.spacing.xl,               // 32 — side padding, matches other screens.
    paddingTop: THEME.spacing.xxl,                     // 48 — top padding, below status bar.
    paddingBottom: THEME.spacing.xl,                   // 32 — bottom padding.
    gap: THEME.spacing.md,                             // 16 — space between cards.
  },
  // Each game card — rounded container with border.
  card: {
    width: '100%',                                     // Full width of the padded container.
    borderRadius: THEME.borderRadius.lg,               // 16 — rounded corners.
    borderWidth: 0.5,                                  // Subtle border.
    overflow: 'hidden',                                // Clip children to match card radius.
  },
  // Darker inner area behind the game icon — top portion of the card.
  iconArea: {
    width: '100%',                                     // Full width of the card.
    height: ICON_AREA_HEIGHT,                          // 120pt — enough room for the icon.
    borderTopLeftRadius: THEME.borderRadius.lg,        // Match card's top-left corner.
    borderTopRightRadius: THEME.borderRadius.lg,       // Match card's top-right corner.
    justifyContent: 'center',                          // Center icon vertically.
    paddingHorizontal: THEME.spacing.md,               // 16 — side padding inside icon area.
  },
  // Circular container holding the game icon image.
  iconCircle: {
    width: ICON_SIZE,                                  // 56pt diameter.
    height: ICON_SIZE,                                 // 56pt diameter.
    borderRadius: ICON_SIZE / 2,                       // 28 — makes it a perfect circle.
    justifyContent: 'center',                          // Center image vertically inside circle.
    alignItems: 'center',                              // Center image horizontally inside circle.
    overflow: 'hidden',                                // Clip image to the circle boundary.
  },
  // Game icon image inside the circle.
  iconImage: {
    width: ICON_SIZE * 0.7,                            // 70% of circle — padding inside the circle.
    height: ICON_SIZE * 0.7,                           // 70% of circle.
  },
  // Text section below the icon area — title + description.
  textArea: {
    padding: THEME.spacing.md,                         // 16 — inner padding.
    gap: THEME.spacing.xs,                             // 4 — small gap between title and description.
  },
  // Semi-transparent overlay covering the entire card for locked games.
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,                  // position: absolute, all edges 0.
    justifyContent: 'center',                          // Center text vertically.
    alignItems: 'center',                              // Center text horizontally.
    borderRadius: THEME.borderRadius.lg,               // Match card's border radius.
  },
  // Back button — full width at the bottom.
  backButton: {
    width: '100%',                                     // Match card width.
    marginTop: THEME.spacing.sm,                       // 8 — small gap above.
  },
});