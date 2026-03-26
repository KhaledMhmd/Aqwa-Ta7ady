// ============================================================
// app.navigator.tsx
// Defines ALL screens in the app and how they connect.
// This is the single source of truth for navigation.
// Adding a new screen = import it here + add one line.
// Angular equivalent: app-routing.module.ts with all Routes[].
// ============================================================

import React from 'react';

// NavigationContainer is the root wrapper that makes navigation work.
// It must wrap the entire app — placed once and never nested.
// Angular equivalent: <router-outlet> in app.component.html,
// but NavigationContainer also manages navigation history/state.
import { NavigationContainer } from '@react-navigation/native';

// createNativeStackNavigator creates a stack-based navigator.
// "Stack" means screens stack on top of each other like a deck of cards.
// Going to a new screen pushes it onto the stack.
// Going back pops it off the stack.
// Angular equivalent: RouterModule.forRoot() with a flat routes array.
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import every screen in the app.
// Phase 1 screens are fully implemented.
// Phase 2+ screens are imported as placeholder components for now.
import { SplashScreen } from '../screens/splash.screen';
import { AuthScreen } from '../screens/auth.screen';
import { HomeScreen } from '../screens/home.screen';
import { GameSelectScreen } from '../screens/game-select.screen';
import { SettingsScreen } from '../screens/settings.screen';
import { HelpScreen } from '../screens/help.screen';
import { LeaderboardScreen } from '../screens/leaderboard.screen';
import { ShopScreen } from '../screens/shop.screen';
import { GameScreen } from '../games/tic-tac-toe/screens/game.screen';

// RootStackParamList defines every route in the app and the
// parameters each screen expects to receive when navigated to.
// This is how TypeScript knows what data to expect on each screen.
// Angular equivalent: typed route data in the Routes[] array.
// 'undefined' means the screen takes no parameters.
export type RootStackParamList = {
  // App-level screens
  Splash: undefined;        // No params — just shows the splash screen.
  Auth: undefined;          // No params — sign in / sign up / guest.
  Home: undefined;          // No params — main menu.
  GameSelect: undefined;    // No params — list of games.
  Settings: undefined;      // No params — app settings.
  Help: undefined;          // No params — help and instructions.
  Leaderboard: undefined;   // No params — leaderboard (Phase 2+).
  Shop: undefined;          // No params — shop (Phase 2+).

  // Game screens
  // TicTacToe receives the player name and avatar chosen on the auth/setup screen.
  // These are passed when navigating: navigation.navigate('TicTacToe', { playerName: 'Khaled', playerAvatar: '⚽' })
  TicTacToe: {
    playerName: string;   // The name the player typed.
    playerAvatar: string; // The emoji the player chose.
  };
};

// Create the stack navigator with our typed param list.
// Stack is used throughout the app so we create it once here.
const Stack = createNativeStackNavigator<RootStackParamList>();

// AppNavigator is the root navigation component.
// It is rendered once in index.ts / App.tsx — the entry point.
// Angular equivalent: <app-root> which contains <router-outlet>.
export const AppNavigator = () => {
  return (
    // NavigationContainer manages the navigation tree and history.
    // Must be the outermost navigation wrapper — never nest two of these.
    <NavigationContainer>

      {/* Stack.Navigator holds all the screens.
          initialRouteName sets which screen loads first.
          screenOptions applies shared options to ALL screens.
          Angular equivalent: the RouterModule.forRoot() configuration. */}
      <Stack.Navigator
        // Splash is always the first screen that loads.
        initialRouteName="Splash"
        screenOptions={{
          // Hide the default header bar on all screens.
          // We will build custom headers inside each screen component.
          headerShown: false,

          // Native animation when navigating between screens.
          // 'default' uses the platform's native transition —
          // slide from right on iOS, fade on Android.
          animation: 'default',
        }}
      >

        {/* Each Stack.Screen registers one route in the app.
            name must match a key in RootStackParamList exactly.
            component is the screen component to render for this route.
            Angular equivalent: { path: 'splash', component: SplashComponent } */}

        {/* ── PHASE 1 SCREENS ─────────────────────────────── */}

        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          // No options needed — splash has no header and no back button.
        />

        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          // No back button on auth screen — users should not go back to splash.
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          // Disable swipe-back gesture on home — no screen to go back to.
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="GameSelect"
          component={GameSelectScreen}
        />

        <Stack.Screen
          name="TicTacToe"
          component={GameScreen}
        />

        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />

        <Stack.Screen
          name="Help"
          component={HelpScreen}
        />

        {/* ── PHASE 2+ SCREENS (placeholders for now) ─────── */}

        <Stack.Screen
          name="Leaderboard"
          component={LeaderboardScreen}
          // Leaderboard is registered but shows "Coming Soon" in Phase 1.
        />

        <Stack.Screen
          name="Shop"
          component={ShopScreen}
          // Shop is registered but shows "Coming Soon" in Phase 1.
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};