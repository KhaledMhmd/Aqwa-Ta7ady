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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'; // Navigation hooks.
import { NativeStackNavigationProp } from '@react-navigation/native-stack';    // Nav type.
import { RootStackParamList } from '../navigation/app.navigator';   // Route types.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { AppBackButton } from '../core/components/app-back-button.component';

// ── Angular equivalent ────────────────────────────────
// In Angular: GameSelectComponent with a shared <app-header>
// component that takes [title] as @Input() and emits (back).

// Navigation type for this screen.
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GameSelect'>;

// Route type for reading params passed to this screen.
type RoutePropType = RouteProp<RootStackParamList, 'GameSelect'>;

// GameCardData defines the shape of each game entry.
// Angular equivalent: a Game interface in a models folder.
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
  // Angular equivalent: a games: Game[] array iterated with *ngFor.
  const games: GameCardData[] = [
    {
      id: 'grid-challenge',                                          // Unique key for list rendering.
      title: t.gameSelect.gridChallenge,                             // Translated game name.
      description: t.gameSelect.gridChallengeDesc,                   // Translated description.
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
  // If available, navigates to mode select. If not, shows Coming Soon alert.
  const onGamePress = (game: GameCardData) => {
    if (!game.isAvailable) {
      Alert.alert(t.common.comingSoon, t.gameSelect.comingSoonGame);
      return;
    }
    navigation.navigate('TicTacToeModeSelect', { playerName, playerAvatar });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      {/* direction: 'ltr' keeps ← on the left even in Arabic RTL mode. */}
      {/* Angular equivalent: a shared <app-header [title]="title" (back)="goBack()">. */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {t.gameSelect.title}
        </AppText>
        {/* Empty spacer — same width as back button to center the title. */}
        <View style={styles.headerBackButton} />
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.container}                     // Inner padding and alignment.
        showsVerticalScrollIndicator={false}                         // Hide scrollbar.
      >

        {/* Game cards — Angular equivalent: *ngFor="let game of games". */}
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}                                            // Unique key for React list.
            activeOpacity={game.isAvailable ? 0.7 : 1}              // Dim on press if available.
            onPress={() => onGamePress(game)}                        // Handle tap.
            style={[
              styles.card,                                           // Base card styles.
              {
                backgroundColor: colors.surface,                     // Card background from theme.
                borderColor: colors.border,                          // Subtle border from theme.
              },
            ]}
          >

            {/* Icon area — darker rectangle. */}
            <View style={[styles.iconArea, { backgroundColor: colors.background }]}>
              <View style={[styles.iconCircle, { backgroundColor: colors.surfaceLight }]}>
                <Image
                  source={require('../../assets/XOGameIcon.png')}    // Shared game icon.
                  style={styles.iconImage}                           // Fills the circle.
                  resizeMode="contain"                               // Fit without cropping.
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
            {/* Angular equivalent: *ngIf="!game.isAvailable". */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  // Full screen wrapper.
  screen: {
    flex: 1,                                                         // Fill all available space.
  },
  // ── HEADER — reusable pattern from game.screen.tsx ──
  // Row: [back button] [centered title] [empty spacer].
  header: {
    flexDirection: 'row',                                            // Horizontal layout.
    alignItems: 'center',                                            // Vertically centered.
    justifyContent: 'space-between',                                 // Spread across the row.
    paddingHorizontal: THEME.spacing.md,                             // 16 — side padding.
    paddingVertical: THEME.spacing.sm,                               // 8 — top/bottom padding.
  },
  // Back button + spacer — same width so the title stays centered.
  headerBackButton: {
    width: 44,                                         // Matches game.screen.tsx.
  },
  // Scrollable content area.
  container: {
    alignItems: 'center',                                            // Center cards horizontally.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    paddingTop: THEME.spacing.sm,                                    // 8 — small gap below header.
    paddingBottom: THEME.spacing.xl,                                 // 32 — bottom padding.
    gap: THEME.spacing.md,                                           // 16 — space between cards.
  },
  // Game card.
  card: {
    width: '100%',                                                   // Full width.
    borderRadius: THEME.borderRadius.lg,                             // 16 — rounded corners.
    borderWidth: 0.5,                                                // Subtle border.
    overflow: 'hidden',                                              // Clip children to card radius.
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