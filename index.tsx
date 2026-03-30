// ============================================================
// index.tsx
// Entry point of the entire app.
// Wraps AppNavigator with ThemeProvider AND LanguageProvider
// so every screen has access to both theme and translations.
// Angular equivalent: main.ts bootstrapping AppModule which
// provides ThemeService and TranslationService at root level.
// ============================================================

import { registerRootComponent } from 'expo';
import React from 'react';
import { AppNavigator } from './src/navigation/app.navigator';
import { ThemeProvider } from './src/core/theme/theme.context';
import { LanguageProvider } from './src/core/i18n/language.context';

// Root component — wraps the entire app with both providers.
// LanguageProvider is outermost so language is available
// to everything including ThemeProvider if needed.
const App = () => (
  <LanguageProvider>
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  </LanguageProvider>
);

registerRootComponent(App);