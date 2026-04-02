// ── React Native ──────────────────────────────────────

// ============================================================
// index.tsx
// Entry point of the entire app.
// Loads custom fonts, then wraps AppNavigator with
// ThemeProvider AND LanguageProvider so every screen
// has access to theme, translations, and fonts.
// Angular equivalent: main.ts bootstrapping AppModule which
// provides ThemeService and TranslationService at root level.
// ============================================================

import { registerRootComponent } from 'expo';           // Registers the root React component with Expo.
import React from 'react';                               // React core — needed for JSX.
import { AppNavigator } from './src/navigation/app.navigator';  // All screen routes.
import { ThemeProvider } from './src/core/theme/theme.context';  // Theme context provider.
import { LanguageProvider } from './src/core/i18n/language.context'; // Language context provider.
import { useFonts } from 'expo-font';                   // Hook to load custom fonts at startup.
import {
  PlusJakartaSans_400Regular,                            // Regular weight — used for body if needed.
  PlusJakartaSans_700Bold,                               // Bold weight — used for headlines.
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  BeVietnamPro_400Regular,                               // Regular weight — used for body and labels.
  BeVietnamPro_700Bold,                                  // Bold weight — used for bold body text.
} from '@expo-google-fonts/be-vietnam-pro';
import { ActivityIndicator, View } from 'react-native';  // Loading spinner while fonts load.

// Root component — loads fonts, then wraps the app with providers.
// Angular equivalent: APP_INITIALIZER that waits for fonts to load
// before bootstrapping the app.
const App = () => {
  // useFonts() returns [fontsLoaded, fontError].
  // fontsLoaded is false while fonts are downloading/caching.
  // Once true, the fonts are ready to use in any style.
  // Angular equivalent: no direct equivalent — browsers handle font loading natively.
  const [fontsLoaded] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,  // Maps to fontFamily: 'PlusJakartaSans-Regular'.
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,        // Maps to fontFamily: 'PlusJakartaSans-Bold'.
    'BeVietnamPro-Regular': BeVietnamPro_400Regular,        // Maps to fontFamily: 'BeVietnamPro-Regular'.
    'BeVietnamPro-Bold': BeVietnamPro_700Bold,              // Maps to fontFamily: 'BeVietnamPro-Bold'.
  });

  // Show a loading spinner while fonts are still loading.
  // This prevents text from rendering with the system default font
  // and then "jumping" when the custom font loads.
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0F0F1A' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  // Fonts loaded — render the full app.
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </LanguageProvider>
  );
};

// registerRootComponent tells Expo which component is the app root.
// Angular equivalent: bootstrapApplication(AppComponent) in main.ts.
registerRootComponent(App);