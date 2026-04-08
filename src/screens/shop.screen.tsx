// ============================================================
// shop.screen.tsx
// Coming Soon placeholder. Phase 2+.
// Header pattern: ← back | title | spacer (matches game.screen.tsx).
// Angular equivalent: ShopComponent.
// ============================================================

import React from 'react';                                          // React core.
import { View, StyleSheet } from 'react-native';                    // Layout.
import { useNavigation } from '@react-navigation/native';           // Navigation hook.
import { AppText } from '../core/components/app-text.component';    // Themed text.
import { AppButton } from '../core/components/app-button.component'; // Themed button.
import { useTheme } from '../core/theme/theme.context';             // Dynamic colours.
import { THEME } from '../core/theme/theme.config';                 // Static spacing.
import { useLanguage } from '../core/i18n/language.context';        // Translations.
import { AppBackButton } from '../core/components/app-back-button.component';

export const ShopScreen = () => {
  const navigation = useNavigation();                                // Navigate back.
  const { colors } = useTheme();                                     // Dynamic colours.
  const { t } = useLanguage();                                       // Translations.

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>

      {/* ── HEADER — matches game.screen.tsx pattern ───── */}
      <View style={[styles.header, { direction: 'ltr' }]}>
        <AppBackButton onPress={() => navigation.goBack()} />
        <AppText variant="h3" style={{ color: colors.primary }}>
          {t.shop.title}
        </AppText>
        <View style={styles.headerBackButton} />
      </View>

      {/* ── CONTENT — centered placeholder ─────────────── */}
      <View style={styles.content}>
        <AppText variant="h1">🛍️</AppText>
        <AppText variant="caption">{t.shop.comingSoonMessage}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Full screen wrapper.
  screen: {
    flex: 1,                                                         // Fill all available space.
  },
  // ── HEADER — reusable pattern from game.screen.tsx ──
  header: {
    flexDirection: 'row',                                            // Horizontal layout.
    alignItems: 'center',                                            // Vertically centered.
    justifyContent: 'space-between',                                 // Spread across the row.
    paddingHorizontal: THEME.spacing.md,                             // 16 — side padding.
    paddingVertical: THEME.spacing.sm,                               // 8 — top/bottom padding.
  },
  // Back button + spacer.
  headerBackButton: {
     width: 44,                                   // Matches game.screen.tsx.
  },
  // Content area — centered placeholder.
  content: {
    flex: 1,                                                         // Fill remaining space.
    alignItems: 'center',                                            // Center horizontally.
    justifyContent: 'center',                                        // Center vertically.
    paddingHorizontal: THEME.spacing.xl,                             // 32 — side padding.
    gap: THEME.spacing.md,                                           // 16 — gap between elements.
  },
});