// ============================================================
// i18n.types.ts
// Defines the shape of the translations object.
// Both en.ts and ar.ts MUST satisfy this type exactly.
// If a key exists in English it must exist in Arabic too.
// TypeScript will throw an error if any key is missing.
// Angular equivalent: a TranslationKeys interface in a
// shared i18n module.
// ============================================================

export type Translations = {

  // ── COMMON ─────────────────────────────────────────────
  // Strings used across multiple screens.
  common: {
    appName: string;        // 'Aqwa Ta7ady' — same in both languages.
    appTagline: string;     // Tagline shown on splash and auth.
    back: string;           // Back button label.
    comingSoon: string;     // Coming Soon alert title.
    comingSoonMessage: string; // Coming Soon alert body.
    ok: string;             // OK button on alerts.
    yes: string;
    no: string;
  };

  // ── AUTH SCREEN ─────────────────────────────────────────
  auth: {
    enterName: string;      // Input placeholder.
    chooseAvatar: string;   // Avatar section label.
    playAsGuest: string;    // Primary button.
    signIn: string;         // Secondary button.
    signUp: string;         // Ghost button.
    nameRequired: string;   // Validation alert title.
    nameRequiredMessage: string; // Validation alert body.
    orDivider: string;      // '— or —' divider text.
    languageLabel: string;  // NEW — 'Language' label above flag switcher.
  };

  // ── HOME SCREEN ─────────────────────────────────────────
  home: {
    play: string;
    settings: string;
    help: string;
    leaderboards: string;
    shop: string;
    welcome: string;        // 'Welcome back,'
  };

  // ── GAME SELECT SCREEN ──────────────────────────────────
  gameSelect: {
    title: string;
    comingSoonGame: string;
    gridChallenge: string;
    gridChallengeDesc: string;
    snakesAndLadders: string;
    snakesAndLaddersDesc: string;
    hangman: string;
    hangmanDesc: string;
  };

  // ── GAME SCREEN ─────────────────────────────────────────
  game: {
    yourTurn: string;
    thinking: string;
    vsLabel: string;
    endLabel: string;
    nameAPlayer: string;
    andConnector: string;
    skip: string;
    submit: string;
    wrongAnswer: string;
    alreadyUsed: string;
    placeholder: string;
  };

  // ── SETTINGS SCREEN ─────────────────────────────────────
  settings: {
    title: string;
    appearanceSection: string;
    darkMode: string;
    darkModeDesc: string;
    gameRulesSection: string;
    stealCells: string;
    stealCellsDesc: string;
    timeLimit: string;
    timeLimitDesc: string;
  };

  // ── HELP SCREEN ─────────────────────────────────────────
  help: {
    title: string;
    intro: string;
    gridTitle: string;
    gridDesc: string;
    turnTitle: string;
    turnDesc: string;
    claimTitle: string;
    claimDesc: string;
    winTitle: string;
    winDesc: string;
    gotIt: string;
  };

  // ── RESULT ──────────────────────────────────────────────
  result: {
    winsLine: string;
    winsPoints: string;
    lineMessage: string;
    pointsMessage: string;
    finalScore: string;
    cells: string;
    playAgain: string;
    home: string;
  };

  // ── MODE SELECT ─────────────────────────────────────────
  modeSelect: {
    title: string;
    easy: string;
    medium: string;
    hard: string;
    vsBot: string;
    vsFriend: string;
    difficultyTitle: string;
  };

  // ── LEADERBOARD + SHOP PLACEHOLDERS ─────────────────────
  leaderboard: {
    title: string;
    comingSoonMessage: string;
  };

  shop: {
    title: string;
    comingSoonMessage: string;
  };
};