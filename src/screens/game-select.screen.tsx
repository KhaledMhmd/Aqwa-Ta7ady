// ── React Native ──────────────────────────────────────

// ============================================================
// game-select.screen.tsx
// List of available games displayed as large cards.
// Each card shows: game image, title, and description.
// Phase 1: Grid Challenge is playable. Others show Coming Soon.
// Angular equivalent: GameSelectComponent with *ngFor over a
// games array, each rendered as a card with [routerLink].
// ============================================================

import React from 'react';                                    // React core — needed for JSX.
import {
  View,                                                        // Container element — like <div> in Angular.
  StyleSheet,                                                  // Creates optimised style objects.
  Alert,                                                       // Native alert dialog — like window.alert().
  Image,                                                       // Renders images — like <img> in Angular.
  TouchableOpacity,                                            // Pressable wrapper — like a clickable <div>.
  ScrollView,                                                  // Scrollable container — like overflow-y: auto in CSS.
  Dimensions,                                                  // Gets screen width/height for responsive sizing.
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks — like Router and ActivatedRoute.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Type for navigation prop.
import { RootStackParamList } from '../navigation/app.navigator';              // All screen route types.
import { AppText } from '../core/components/app-text.component';               // Themed text component.
import { AppButton } from '../core/components/app-button.component';           // Themed button component.
import { useTheme } from '../core/theme/theme.context';                        // Theme hook — gives us dynamic colours.
import { useLanguage } from '../core/i18n/language.context';                   // Language hook — gives us translations.
import { THEME } from '../core/theme/theme.config';                            // Static spacing/font values.

// Navigation type for this screen — typed push/navigate calls.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

// Route type for reading params passed to this screen.
type RoutePropType = RouteProp<RootStackParamList, 'GameSelect'>;

// GameCardData defines the shape of each game entry in our list.
// Angular equivalent: a Game interface in a models folder.
type GameCardData = {
  id: string;           // Unique identifier for the game.
  title: string;        // Display name shown on the card.
  description: string;  // Short description shown below the title.
  image: string;        // URL of the game's preview image.
  isAvailable: boolean; // true = playable, false = Coming Soon overlay.
};

// Screen width for responsive card sizing.
const { width } = Dimensions.get('window');

export const GameSelectScreen = () => {
  const navigation = useNavigation<NavigationProp>();  // Navigate to other screens.
  const { colors } = useTheme();                       // Dynamic theme colours.
  const { t } = useLanguage();                         // Active translations.
  const route = useRoute<RoutePropType>();              // Read params from previous screen.

  // Read player info passed from HomeScreen.
  // Angular equivalent: ActivatedRoute.snapshot.params
  const { playerName, playerAvatar } = route.params;

  // Games array — single source of truth for all game cards.
  // Angular equivalent: a games: Game[] property on the component class,
  // iterated with *ngFor="let game of games" in the template.
  const games: GameCardData[] = [
    {
      id: 'grid-challenge',                            // Used as the key in the list.
      title: t.gameSelect.gridChallenge,               // Translated game name.
      description: t.gameSelect.gridChallengeDesc,     // Translated description.
      image: 'https://i.imgur.com/8QHjKqZ.png',       // Placeholder image — replace with real asset later.
      isAvailable: true,                               // Phase 1 — this game is playable.
    },
    {
      id: 'snakes-and-ladders',
      title: t.gameSelect.snakesAndLadders,
      description: t.gameSelect.snakesAndLaddersDesc,
      image: 'https://i.imgur.com/5VjFgKm.png',       // Placeholder image.
      isAvailable: false,                              // Coming Soon — Phase 2+.
    },
    {
      id: 'hangman',
      title: t.gameSelect.hangman,
      description: t.gameSelect.hangmanDesc,
      image: 'https://i.imgur.com/YqZGjNx.png',       // Placeholder image.
      isAvailable: false,                              // Coming Soon — Phase 2+.
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
    // Angular equivalent: this.router.navigate(['/mode-select'], { queryParams: { playerName, playerAvatar } })
    navigation.navigate('TicTacToeModeSelect', { playerName, playerAvatar });
  };

  return (
    // ScrollView allows scrolling when more games are added later.
    // Angular equivalent: a container div with overflow-y: auto.
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}   // Full screen scroll area with themed bg.
      contentContainerStyle={styles.container}                                // Inner content padding and alignment.
      showsVerticalScrollIndicator={false}                                   // Hide scrollbar for cleaner look.
    >

      {/* Screen title */}
      <AppText variant="h2" style={{ color: colors.primary }}>
        {t.gameSelect.title}
      </AppText>

      {/* Game cards list */}
      {/* Angular equivalent: *ngFor="let game of games" */}
      {games.map((game) => (
        <TouchableOpacity
          key={game.id}                                                      // Unique key for React list rendering.
          activeOpacity={game.isAvailable ? 0.7 : 1}                         // Dim on press if available, no dim if locked.
          onPress={() => onGamePress(game)}                                  // Handle tap — navigate or show Coming Soon.
          style={[
            styles.card,                                                     // Base card styles — rounded corners, shadow.
            {
              backgroundColor: colors.surface,                               // Card background from theme.
              borderColor: colors.border,                                    // Subtle border from theme.
            },
          ]}
        >

          {/* Game preview image */}
          <Image
            source={{ uri: game.image }}                                     // Remote image URL — replace with local assets later.
            style={[
              styles.cardImage,
              { backgroundColor: colors.surfaceLight },                      // Fallback bg while image loads.
            ]}
            resizeMode="cover"                                               // Fill the container, crop if needed.
          />

          {/* Text content — title + description */}
          <View style={styles.cardContent}>
            <AppText variant="h3" style={{ color: colors.textPrimary }}>
              {game.title}
            </AppText>
            <AppText variant="caption" style={{ color: colors.textSecondary }}>
              {game.description}
            </AppText>
          </View>

          {/* Coming Soon overlay — shown on top of locked games */}
          {/* Angular equivalent: *ngIf="!game.isAvailable" */}
          {!game.isAvailable && (
            <View style={[styles.comingSoonOverlay, { backgroundColor: colors.comingSoon }]}>
              <AppText variant="body" style={{ color: colors.textSecondary, fontWeight: THEME.fontWeights.bold }}>
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
    paddingHorizontal: THEME.spacing.xl,               // Side padding — matches other screens.
    paddingTop: THEME.spacing.xxl,                     // Top padding — below status bar.
    paddingBottom: THEME.spacing.xl,                   // Bottom padding — breathing room.
    gap: THEME.spacing.md,                             // Space between cards.
  },
  // Each game card — rounded container with border.
  card: {
    width: '100%',                                     // Full width of the padded container.
    borderRadius: THEME.borderRadius.lg,               // Rounded corners.
    borderWidth: 0.5,                                  // Subtle border.
    overflow: 'hidden',                                // Clip image corners to match card radius.
  },
  // Game preview image — fills the top of the card.
  cardImage: {
    width: '100%',                                     // Full width of the card.
    height: width * 0.35,                              // 35% of screen width — keeps aspect ratio consistent.
  },
  // Text section — sits below the image inside the card.
  cardContent: {
    padding: THEME.spacing.md,                         // Inner padding for title and description.
    gap: THEME.spacing.xs,                             // Small gap between title and description.
  },
  // Semi-transparent overlay that covers the entire card when locked.
  comingSoonOverlay: {
    ...StyleSheet.absoluteFillObject,                  // Covers the entire card — position: absolute + all edges 0.
    justifyContent: 'center',                          // Center the "Coming Soon" text vertically.
    alignItems: 'center',                              // Center the "Coming Soon" text horizontally.
    borderRadius: THEME.borderRadius.lg,               // Match card's border radius.
  },
  // Back button — full width at the bottom.
  backButton: {
    width: '100%',                                     // Match card width.
    marginTop: THEME.spacing.sm,                       // Small gap above the button.
  },
});