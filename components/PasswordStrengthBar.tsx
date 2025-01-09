import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = {
  level: "Weak" | "Medium" | "Strong" | undefined;
  progress: number;
};

const PasswordStrengthBar = ({ progress, level }: Props) => {
  const animatedProgress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    let backgroundColor = "#ef4444";

    if (level === "Medium") {
      backgroundColor = "#facc15";
    } else if (level === "Strong") {
      backgroundColor = "#22c55e";
    }

    return {
      width: `${animatedProgress.value}%`,
      backgroundColor,
    };
  });

  // Update animasi ketika nilai progress berubah
  useEffect(() => {
    animatedProgress.value = withTiming(progress, { duration: 500 }); // Animasi dengan durasi 500ms
  }, [progress]);

  return (
    <View style={styles.base}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: "#b5b5b5",
    width: "100%",
    height: 12,
    borderRadius: 20,
  },
  progress: {
    backgroundColor: "blue",
    height: 12,
    width: "10%",
    borderRadius: 20,
  },
});

export default PasswordStrengthBar;
