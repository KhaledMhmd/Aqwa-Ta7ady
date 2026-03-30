// ============================================================
// en.ts
// English translations for the entire app.
// Angular equivalent: en.json in a translations folder.
// ============================================================

import { Translations } from './i18n.types';

export const en: Translations = {

  common: {
    appName: 'Aqwa Ta7ady',
    appTagline: 'The Ultimate Football Challenge',
    back: '← Back',
    comingSoon: 'Coming Soon',
    comingSoonMessage: 'This feature will be available in a future update.',
    ok: 'OK',
    yes: 'Yes',
    no: 'No',
  },

  auth: {
    enterName: 'Your name',
    chooseAvatar: 'Choose your avatar',
    playAsGuest: 'Play as Guest',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    nameRequired: 'Enter your name',
    nameRequiredMessage: 'Please enter a name to continue.',
    orDivider: '— or —',
  },

  home: {
    play: 'Play',
    settings: 'Settings',
    help: 'Help',
    leaderboards: 'Leaderboards',
    shop: 'Shop',
    welcome: 'Welcome back,',
  },

  gameSelect: {
    title: 'Choose a Game',
    comingSoonGame: 'This game will be available in a future update.',
    hangman: 'Hangman',
    snakesAndLadders: 'Snakes & Ladders',
    gridChallenge: 'Grid Challenge'
  },

  game: {
    yourTurn: 'Your turn',
    thinking: 'Thinking...',
    vsLabel: 'VS',
    endLabel: 'END',
    nameAPlayer: 'Name a player who played for both',
    andConnector: '&',
    skip: 'Skip',
    submit: 'Submit',
    wrongAnswer: 'Wrong answer — turn over!',
    alreadyUsed: 'This player was already used in another cell — turn over!',
    placeholder: 'Type player name...',
  },

  settings: {
    title: 'Settings',
    appearanceSection: 'Appearance',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch between dark and light theme',
    gameRulesSection: 'Game Rules',
    stealCells: 'Steal Cells',
    stealCellsDesc: 'Claim an opponent\'s cell with a different correct answer',
    timeLimit: 'Time Limit',
    timeLimitDesc: '45 seconds to answer per turn',
  },

  help: {
    title: 'How to Play',
    intro: 'Aqwa Ta7ady is a football trivia game inspired by tic-tac-toe.',
    gridTitle: 'The Grid',
    gridDesc: 'The board is a 3×3 grid. Each row and column has a football club badge.',
    turnTitle: 'Your Turn',
    turnDesc: 'Tap any empty cell. Name a player who played for BOTH clubs.',
    claimTitle: 'Claiming a Cell',
    claimDesc: 'Answer correctly and the cell is yours. Answer wrongly and the turn passes.',
    winTitle: 'Winning',
    winDesc: 'Get 3 cells in a row — horizontally, vertically, or diagonally — to win.',
    gotIt: 'Got it!',
  },

  result: {
    winsLine: '{name} Wins!',
    winsPoints: '{name} Wins on Points!',
    lineMessage: '{name} got 3 in a row!',
    pointsMessage: 'No line completed. Winner decided by cell count.',
    finalScore: 'Final score:',
    cells: 'cells',
    playAgain: 'Play Again',
    home: 'Home',
  },

  modeSelect: {
  title: 'Choose Difficulty',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  vsBot: 'vs Bot',
  vsFriend: 'vs Friend',
  difficultyTitle: 'Select Difficulty',
},

  leaderboard: {
    title: 'Leaderboards',
    comingSoonMessage: 'Coming soon. Get ready to compete!',
  },

  shop: {
    title: 'Shop',
    comingSoonMessage: 'Coming soon. Exclusive items on the way!',
  },

};