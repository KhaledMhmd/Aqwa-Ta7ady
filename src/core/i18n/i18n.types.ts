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
    title: string;          // 'Choose a Game'
    comingSoonGame: string;
    hangman: string;
    snakesAndLadders: string;
    gridChallenge: string;
  };

  // ── GAME SCREEN ─────────────────────────────────────────
  game: {
    yourTurn: string;       // Shown under active player.
    thinking: string;       // Shown under bot when it is thinking.
    vsLabel: string;        // 'VS' between player cards.
    endLabel: string;       // 'END' when game is over.
    nameAPlayer: string;    // Modal prompt — 'Name a player who played for both'
    andConnector: string;   // '&' between club names in modal.
    skip: string;           // Skip button in modal.
    submit: string;         // Submit button in modal.
    wrongAnswer: string;    // Wrong answer feedback message.
    alreadyUsed: string;    // Already used feedback message.
    placeholder: string;    // Input placeholder in modal.
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
    winsLine: string;       // '{name} Wins!' — line win title.
    winsPoints: string;     // '{name} Wins on Points!' — cell count win title.
    lineMessage: string;    // '{name} got 3 in a row!'
    pointsMessage: string;  // 'No line completed. Winner by cell count.'
    finalScore: string;     // 'Final score:'
    cells: string;          // 'cells'
    playAgain: string;
    home: string;
  };

  // ── MODE SELECT ─────────────────────────────────────────────
modeSelect: {
  title: string;          // 'Choose Difficulty'
  easy: string;
  medium: string;
  hard: string;
  vsBot: string;          // 'vs Bot'
  vsFriend: string;       // 'vs Friend' — Coming Soon
  difficultyTitle: string;  // 'Select Difficulty'
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