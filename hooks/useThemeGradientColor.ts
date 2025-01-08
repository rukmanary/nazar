/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { GradientColors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

type ThemeColorProps = {
  light?: string[];
  dark?: string[];
};

export function useThemeGradientColor(
  props: ThemeColorProps,
  colorName: keyof typeof GradientColors.light &
    keyof typeof GradientColors.dark
): string[] {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return [...GradientColors[theme][colorName]];
  }
}
