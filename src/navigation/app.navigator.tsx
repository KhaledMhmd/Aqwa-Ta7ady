// ============================================================
// app.navigator.tsx
// Defines ALL screens and how they connect.
// Single source of truth for navigation.
// Adding a new screen = import it + add one Stack.Screen line.
// Angular equivalent: app-routing.module.ts with Routes[].
// ============================================================

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SplashScreen } from '../screens/splash.screen';
import { AuthScreen } from '../screens/auth.screen';
import { HomeScreen } from '../screens/home.screen';
import { GameSelectScreen } from '../screens/game-select.screen';
import { SettingsScreen } from '../screens/settings.screen';
import { HelpScreen } from '../screens/help.screen';
import { LeaderboardScreen } from '../screens/leaderboard.screen';
import { ShopScreen } from '../screens/shop.screen';
import { GameScreen } from '../games/tic-tac-toe/screens/game.screen';
import { ModeSelectScreen } from '../games/tic-tac-toe/screens/mode-select.screen';

// RootStackParamList — typed route params for every screen.
// Angular equivalent: typed route data in Routes[].
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  Home: {playerName: string; playerAvatar: string};
  GameSelect: {
  playerName: string;
  playerAvatar: string;
  };
  Settings: undefined;
  Help: undefined;
  Leaderboard: undefined;
  Shop: undefined;
  TicTacToe: {
    playerName: string;
    playerAvatar: string;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  TicTacToeModeSelect: {
  playerName: string;
  playerAvatar: string;
};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'default',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="GameSelect" component={GameSelectScreen} />
        <Stack.Screen name="TicTacToe" component={GameScreen} />
        <Stack.Screen name="TicTacToeModeSelect" component={ModeSelectScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Help" component={HelpScreen} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
        <Stack.Screen name="Shop" component={ShopScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};