// ============================================================
// app-avatar.component.tsx
// Displays a player's avatar emoji inside a coloured circle.
// Colour comes from the player object — no theme needed here.
// Angular equivalent: a shared AvatarComponent in SharedModule.
// ============================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  avatar: string;   // Emoji or initials to display.
  color: string;    // Background colour — from player.color.
  size?: 'sm' | 'md' | 'lg';
};

const SIZE_MAP = { sm: 32, md: 44, lg: 60 };
const FONT_SIZE_MAP = { sm: 16, md: 24, lg: 32 };

export const AppAvatar = ({ avatar, color, size = 'md' }: Props) => {
  const pixelSize = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  return (
    <View style={[
      styles.circle,
      {
        width: pixelSize,
        height: pixelSize,
        borderRadius: pixelSize / 2,
        backgroundColor: color,
      },
    ]}>
      <Text style={{ fontSize, textAlign: 'center' }}>{avatar}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});