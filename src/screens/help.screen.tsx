// ============================================================
// help.screen.tsx
// Instructions screen. Phase 1.
// Angular equivalent: HelpComponent.
// ============================================================

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppText } from '../core/components/app-text.component';
import { AppButton } from '../core/components/app-button.component';
import { useTheme } from '../core/theme/theme.context';
import { THEME } from '../core/theme/theme.config';
import { APP_CONFIG } from '../core/config/app.config';
import { useLanguage } from '../core/i18n/language.context';

export const HelpScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.container}
    >
      <AppText variant="h2" style={{ color: colors.primary }}>{t.help.title}</AppText>

      <AppText variant="body">{t.help.intro}</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.gridTitle}</AppText>
      <AppText variant="body">{t.help.gridDesc}</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.turnTitle}</AppText>
      <AppText variant="body">{t.help.turnDesc}</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.claimTitle}</AppText>
      <AppText variant="body">{t.help.claimDesc}</AppText>

      <AppText variant="h3" style={[styles.sectionTitle, { color: colors.textSecondary }] as any}>{t.help.winTitle}</AppText>
      <AppText variant="body">{t.help.winDesc}</AppText>

      <AppButton
        label={t.help.gotIt}
        onPress={() => navigation.goBack()}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.xxl,
    paddingBottom: THEME.spacing.xxl,
    gap: THEME.spacing.md,
  },
  sectionTitle: {
    marginTop: THEME.spacing.sm,
  },
  button: {
    marginTop: THEME.spacing.xl,
  },
});