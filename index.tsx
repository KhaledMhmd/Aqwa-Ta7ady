// ============================================================
// index.ts
// Entry point of the entire app.
// Wraps AppNavigator with ThemeProvider so every screen
// and component has access to the active theme.
// Angular equivalent: main.ts bootstrapping AppModule which
// provides ThemeService at the root level.
// ============================================================

import { registerRootComponent } from 'expo';
import React from 'react';
import { AppNavigator } from './src/navigation/app.navigator';
import { ThemeProvider } from './src/core/theme/theme.context';

// Root component — wraps the entire app with ThemeProvider.
// ThemeProvider must be the outermost wrapper so every screen
// can access the theme via useTheme() hook.
const App = () => (
  <ThemeProvider>
    <AppNavigator />
  </ThemeProvider>
);

registerRootComponent(App);