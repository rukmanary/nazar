import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      // Tunggu hingga font selesai dimuat
      if (!fontsLoaded) return;

      // Periksa status login pengguna
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // Jika sudah login, arahkan ke dashboard
          router.replace("/");
        } else {
          // Jika belum login, arahkan ke login page
          router.replace("/signin");
        }

        // Tandai bahwa semua proses selesai
        setAppReady(true);
      });
    };

    checkAuthAndNavigate();
  }, [fontsLoaded]);

  useEffect(() => {
    // Sembunyikan SplashScreen setelah semua proses selesai
    if (isAppReady) {
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
