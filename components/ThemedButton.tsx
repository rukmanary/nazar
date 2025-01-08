import React from "react";
import {
  TouchableOpacity,
  useColorScheme,
  type ViewStyle,
  type StyleProp,
  type TouchableOpacityProps,
  ColorValue,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors, GradientColors } from "@/constants/Colors";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { useThemeGradientColor } from "@/hooks/useThemeGradientColor";

export type ThemedViewProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  useGradient?: boolean;
  gradientContainerStyle?: StyleProp<ViewStyle> | undefined;
  gradientColorName?: keyof typeof GradientColors.light &
    keyof typeof GradientColors.dark;
  backgroundColorName?: keyof typeof Colors.light & keyof typeof Colors.dark;
  gradientLightColor?: string[];
  gradientDarkColor?: string[];
} & Omit<LinearGradientProps, "colors">;

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  useGradient = false,
  gradientColorName = "loginBackground",
  backgroundColorName = "background",
  gradientContainerStyle,
  start,
  end,
  locations,
  dither,
  gradientDarkColor,
  gradientLightColor,
  ...otherProps
}: ThemedViewProps) {
  const gradientThemeColor = {
    light: gradientLightColor,
    dark: gradientDarkColor,
  };
  const backgroundColor: string = useThemeColor(
    { light: lightColor, dark: darkColor },
    backgroundColorName
  );

  const rawLinearColors = useThemeGradientColor(
    gradientThemeColor,
    gradientColorName
  );

  const linearColors: readonly [string, string, ...string[]] =
    rawLinearColors.length >= 2
      ? (rawLinearColors as [string, string, ...string[]])
      : ["#000000", "#FFFFFF"];

  if (useGradient) {
    return (
      <LinearGradient
        colors={linearColors}
        style={[{ borderRadius: 8, padding: 12 }, gradientContainerStyle]}
        start={start}
        end={end}
        locations={locations}
        dither={dither}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          style={[{ backgroundColor: "transparent" }, style]} // Background transparent karena menggunakan gradien
          {...otherProps}
        />
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[{ backgroundColor, borderRadius: 8, padding: 12 }, style]}
      {...otherProps}
    />
  );
}
