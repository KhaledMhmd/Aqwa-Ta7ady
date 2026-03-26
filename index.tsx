// ============================================================
// index.ts
// The entry point of the entire app.
// React Native loads this file first when the app starts.
// It registers the root component with Expo.
// Angular equivalent: main.ts which calls platformBrowserDynamic()
// .bootstrapModule(AppModule)
// ============================================================

import { registerRootComponent } from 'expo';
// registerRootComponent tells Expo which component is the root
// of the entire app — equivalent to bootstrapping AppModule in Angular.

import { AppNavigator } from './src/navigation/app.navigator';
// AppNavigator contains NavigationContainer + all screens.
// It IS the app — everything renders inside it.

// Register AppNavigator as the root component.
// Expo will render this component when the app launches.
registerRootComponent(AppNavigator);