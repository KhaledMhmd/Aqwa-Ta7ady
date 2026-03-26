// ============================================================
// app.config.ts
// THE single source of truth for app-wide constants.
// Change app name, version, or bot name here only.
// Angular equivalent: environment.ts + a constants file.
// ============================================================

export const APP_CONFIG = {
  // Display name of the app — shown everywhere in the UI.
  name: 'Aqwa Ta7ady',

  // Internal version — update when shipping to app stores.
  version: '1.0.0',

  // Tagline shown on splash and auth screens.
  tagline: 'The Ultimate Football Challenge',

  // Name of the CPU opponent — shown on turn indicator and result screen.
  botName: 'Bot',

  // Maximum players in a local game.
  maxLocalPlayers: 2,

} as const;