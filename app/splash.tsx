import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      // Simulasi pengecekan status login
      const loading = await new Promise(
        (resolve) => setTimeout(() => resolve(false), 2000) // Ubah `false` ke `true` untuk simulasi login
      );

      if (!loading) {
        router.replace("/");
      }
    };

    redirect();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Loading...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default SplashScreen;
