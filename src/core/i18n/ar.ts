// ============================================================
// ar.ts
// Arabic translations for the entire app.
// Default language — app launches in Arabic.
// All strings here are placeholder translations —
// replace with your preferred Arabic phrasing.
// Angular equivalent: ar.json in a translations folder.
// ============================================================

import { Translations } from './i18n.types';

export const ar: Translations = {

  common: {
    appName: 'أقوى تحدي',
    appTagline: 'التحدي الكروي الأقوى',
    back: '←',
    comingSoon: 'قريباً',
    comingSoonMessage: 'هذه الميزة ستكون متاحة في تحديث قادم.',
    ok: 'حسناً',
    yes: 'نعم',
    no: 'لا',
  },

  auth: {
    enterName: 'اكتب اسمك',
    chooseAvatar: 'اختر صورتك',
    playAsGuest: 'العب كضيف',
    signIn: 'تسجيل الدخول',
    signUp: 'إنشاء حساب',
    nameRequired: 'أدخل اسمك',
    nameRequiredMessage: 'من فضلك أدخل اسمك للمتابعة.',
    orDivider: '— أو —',
  },

  home: {
    play: 'العب',
    settings: 'الإعدادات',
    help: 'المساعدة',
    leaderboards: 'المتصدرون',
    shop: 'المتجر',
    welcome: 'أهلاً،',
  },

  gameSelect: {
  title: 'اختر لعبة',
  comingSoonGame: 'هذه اللعبة ستكون متاحة قريباً.',
  gridChallenge: 'اكس أوه',
  gridChallengeDesc: 'اذكر لاعب لعب في النادين',
  snakesAndLadders: 'السلم و التعبان',
  snakesAndLaddersDesc: 'اطلع السلم واحذر من التعبان',
  hangman: 'خمن اللعيب',
  hangmanDesc: 'خمن اللاعب قبل ما الوقت يخلص',
},

  game: {
    yourTurn: 'دورك',
    thinking: 'يفكر...',
    vsLabel: 'VS',
    endLabel: 'انتهت',
    nameAPlayer: 'اذكر لاعباً لعب في كلا النادين',
    andConnector: 'و',
    skip: 'تخطي',
    submit: 'إرسال',
    wrongAnswer: 'إجابة خاطئة — الدور ينتقل!',
    alreadyUsed: 'هذا اللاعب تم استخدامه في خلية أخرى — الدور ينتقل!',
        placeholder: 'اكتب اسم اللاعب...',
  },

  settings: {
    title: 'الإعدادات',
    appearanceSection: 'المظهر',
    darkMode: 'الوضع الداكن',
    darkModeDesc: 'التبديل بين الوضع الداكن والفاتح',
    gameRulesSection: 'قواعد اللعبة',
    stealCells: 'سرقة الخلايا',
    stealCellsDesc: 'استرداد خلية الخصم بإجابة صحيحة مختلفة',
    timeLimit: 'الوقت المحدد',
    timeLimitDesc: '٤٥ ثانية للإجابة في كل دور',
  },

  help: {
    title: 'كيف تلعب',
    intro: 'أقوى تحدي لعبة كروية مستوحاة من إكس إكس إكس.',
    gridTitle: 'الشبكة',
    gridDesc: 'اللوحة عبارة عن شبكة ٣×٣. كل صف وعمود له شعار نادٍ.',
    turnTitle: 'دورك',
    turnDesc: 'اضغط على أي خلية فارغة. اذكر لاعباً لعب في كلا النادين.',
    claimTitle: 'الاستحواذ على الخلية',
    claimDesc: 'أجب بشكل صحيح والخلية لك. أجب خطأً وينتقل الدور.',
    winTitle: 'الفوز',
    winDesc: 'احصل على ٣ خلايا متتالية — أفقياً أو عمودياً أو قطرياً — للفوز.',
    gotIt: 'فهمت!',
  },

  result: {
    winsLine: 'فاز {name}!',
    winsPoints: 'فاز {name} بالنقاط!',
    lineMessage: 'حصل {name} على ٣ خلايا متتالية!',
    pointsMessage: 'لم يكتمل أي صف. الفائز بعدد الخلايا.',
    finalScore: 'النتيجة النهائية:',
    cells: 'خلايا',
    playAgain: 'العب مجدداً',
    home: 'الرئيسية',
  },

  modeSelect: {
  title: 'اختر المستوى',
  easy: 'سهل',
  medium: 'متوسط',
  hard: 'صعب',
  vsBot: 'ضد الكمبيوتر',
  vsFriend: 'ضد صديق',
  difficultyTitle: 'اختر المستوى',
},

  leaderboard: {
    title: 'المتصدرون',
    comingSoonMessage: 'قريباً. استعد للمنافسة!',
  },

  shop: {
    title: 'المتجر',
    comingSoonMessage: 'قريباً. عناصر حصرية في الطريق!',
  },

};