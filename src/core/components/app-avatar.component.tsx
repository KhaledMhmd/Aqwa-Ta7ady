// ============================================================
// app-avatar.component.tsx
// Displays a player's avatar — either an emoji or initials.
// Used on the game board, turn indicator, and result screen.
// Angular equivalent: a shared AvatarComponent in a SharedModule.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { THEME } from '../theme/theme.config';

type Props = {
  // The emoji or initials to display inside the avatar circle.
  avatar: string;

  // The background colour of the avatar circle.
  // Comes from the player's color property (THEME.colors.player1 etc.)
  color: string;

  // Size of the avatar circle in pixels.
  // 'sm' = 32px, 'md' = 44px (default), 'lg' = 60px
  size?: 'sm' | 'md' | 'lg';
};

// Size map — translates size prop to pixel values.
const SIZE_MAP = {
  sm: 32,
  md: 44,
  lg: 60,
};

// Font size map — avatar emoji scales with circle size.
const FONT_SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 32,
};

export const AppAvatar = ({ avatar, color, size = 'md' }: Props) => {
  // Get the pixel size for this avatar.
  const pixelSize = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  return (
    // Outer circle — background colour is the player's colour.
    <View
      style={[
        styles.circle,
        {
          width: pixelSize,
          height: pixelSize,
          borderRadius: pixelSize / 2,  // Half of size = perfect circle.
          backgroundColor: color,
        },
      ]}
    >
      {/* Avatar emoji or initials centered inside the circle. */}
      <Text style={[styles.avatarText, { fontSize }]}>
        {avatar}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',      // Center emoji horizontally.
    justifyContent: 'center',  // Center emoji vertically.
  },
  avatarText: {
    textAlign: 'center',
  },
});