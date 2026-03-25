// ============================================================
// app.config.ts
// THE single source of truth for app-wide constants.
// If you want to rename the app, change it HERE and nowhere else.
// If you want to bump the version, change it HERE.
// Angular equivalent: environment.ts + a constants file combined.
// ============================================================

export const APP_CONFIG = {

  // The display name of the app — shown on the home screen header
  // and anywhere the app name appears in the UI.
  // Change this one string to rename the app everywhere instantly.
  name: 'Aqwa Ta7ady',

  // The internal version of the app.
  // Update this every time you ship a new version to the app stores.
  version: '1.0.0',

  // The tagline shown on the splash screen and auth screen.
  tagline: 'The Ultimate Football Challenge',

  // The name used for the Bot opponent throughout all games.
  // Change this one string to rename the bot everywhere instantly.
  botName: 'Bot',

  // Maximum number of players in a local (same device) game.
  // Used by the game select screen to know how many player slots to show.
  maxLocalPlayers: 2,

} as const;
// 'as const' makes every value in this object readonly —
// nothing in the app can accidentally overwrite APP_CONFIG.name etc.
// Angular equivalent: Object.freeze() on a constants object.