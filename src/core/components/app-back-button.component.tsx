// ── React Native ──────────────────────────────────────

// ============================================================
// app-back-button.component.tsx
// Circular back button with an SVG arrow icon.
// Matches the design: dark circle with subtle border + white arrow.
// Used in every screen header for consistent navigation.
// Uses useTheme() for dynamic colours — never hardcodes hex values.
// Angular equivalent: a shared BackButtonComponent in SharedModule
// with (click) output and ThemeService injection.
// ============================================================

import React from 'react';                                          // React core — needed for JSX.
import {
  TouchableOpacity,                                                  // Pressable wrapper — triggers onPress.
  StyleSheet,                                                        // Creates optimised style objects.
  ViewStyle,                                                         // Type for optional style overrides.
} from 'react-native';
import Svg, { Path } from 'react-native-svg';                       // SVG for the arrow icon.
import { useTheme } from '../theme/theme.context';                  // Dynamic theme colours.
import { THEME } from '../theme/theme.config';                      // Static design tokens.

// ── Angular equivalent ────────────────────────────────
// @Component({ selector: 'app-back-button', template: `<button (click)="back.emit()">` })
// export class BackButtonComponent {
//   @Output() back = new EventEmitter<void>();
//   constructor(private themeService: ThemeService) {}
// }

// Props type — what the parent screen passes in.
// Angular equivalent: @Input() and @Output() decorators.
type Props = {
  onPress: () => void;                                               // Tap handler — navigates back.
  size?: number;                                                     // Circle diameter in pixels. Default: 44.
  style?: ViewStyle;                                                 // Optional extra styles from parent.
};

export const AppBackButton = ({
  onPress,
  size = 44,                                                         // Default 44px — meets Apple's tap target minimum.
  style,
}: Props) => {
  const { colors } = useTheme();                                     // Dynamic theme colours.

  // Arrow icon size scales with the circle — 45% of the diameter.
  // At 44px circle that's ~20px arrow, visually balanced.
  const iconSize = size * 0.45;

  return (
    <TouchableOpacity
      onPress={onPress}                                              // Fires the parent's navigation.goBack().
      activeOpacity={0.7}                                            // Slight dim on press for feedback.
      style={[
        styles.circle,                                               // Base circular shape.
        {
          width: size,                                               // Circle width from prop.
          height: size,                                              // Circle height — same as width for perfect circle.
          borderRadius: size / 2,                                    // Half of width/height = circle.
          backgroundColor: colors.surface,                           // Dark surface colour — visible on dark bg.
          borderColor: colors.border,                                // Subtle border ring around the circle.
        },
        style,                                                       // Parent overrides.
      ]}
    >
      {/* SVG arrow icon — a simple left-pointing chevron. */}
      {/* Angular equivalent: <svg> with a <path> in the template. */}
      <Svg
        width={iconSize}                                             // Arrow width.
        height={iconSize}                                            // Arrow height.
        viewBox="0 0 24 24"                                          // Standard 24x24 viewBox.
        fill="none"                                                  // No fill — stroke only.
      >
        {/* Left arrow path — a chevron pointing left. */}
        {/* M 15 6 L 9 12 L 15 18 — three points forming a "<" shape. */}
        <Path
          d="M15 6L9 12L15 18"                                       // Chevron path data.
          stroke={colors.textPrimary}                                // Arrow colour from theme — white on dark, dark on light.
          strokeWidth={2.5}                                          // Thick enough to be visible at small sizes.
          strokeLinecap="round"                                      // Rounded line ends for softer look.
          strokeLinejoin="round"                                     // Rounded corners at the chevron point.
        />
      </Svg>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base circle — centered content, subtle border.
  circle: {
    alignItems: 'center',                                            // Center the arrow icon horizontally.
    justifyContent: 'center',                                        // Center the arrow icon vertically.
    borderWidth: 1.5,                                                // Subtle border ring — matches the design reference.
  },
});