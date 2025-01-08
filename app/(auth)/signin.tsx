import React, { useState, useEffect } from "react";
import {
  // View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
  // RecaptchaVerifier,
  // signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NAZAR_LOGO } from "@/assets";
import { GradientColors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { ThemedButton } from "@/components/ThemedButton";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const bgColor = GradientColors[theme].loginBackground;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState("");
  // const [verificationId, setVerificationId] = useState("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert(
            "Login Success",
            `Welcome ${userCredential.user.displayName}`
          );
          router.push("/");
        })
        .catch((error) => {
          Alert.alert("Login Failed", error.message);
        });
    }
  }, [response]);

  // Login dengan Email/Password
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      Alert.alert("Login Success", `Welcome ${userCredential.user.email}`);
      router.push("/");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  // Login dengan Nomor HP (mengirim OTP)
  // const handlePhoneLogin = () => {
  //   const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //     size: "invisible",
  //   });

  //   signInWithPhoneNumber(auth, phone, appVerifier)
  //     .then((confirmationResult) => {
  //       setVerificationId(confirmationResult.verificationId);
  //       Alert.alert("OTP Sent", "Check your phone for the OTP.");
  //     })
  //     .catch((error) => {
  //       Alert.alert("Login Failed", error.message);
  //     });
  // };

  // Verifikasi OTP
  // const handleVerifyOtp = () => {
  //   const credential = GoogleAuthProvider.credential(verificationId, otp);
  //   signInWithCredential(auth, credential)
  //     .then((userCredential) => {
  //       Alert.alert(
  //         "Login Success",
  //         `Welcome ${userCredential.user.phoneNumber}`
  //       );
  //       router.push("/");
  //     })
  //     .catch((error) => {
  //       Alert.alert("Verification Failed", error.message);
  //     });
  // };

  return (
    <LinearGradient colors={bgColor} style={styles.container}>
      <Image source={NAZAR_LOGO} style={{ height: 200, aspectRatio: 1 }} />
      <Text style={styles.title}>Login</Text>
      {/* Login dengan Email dan Password */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <ThemedButton
        useGradient
        gradientLightColor={["#FFFFFF", "#bcf7f7"]}
        gradientDarkColor={["#000000", "#252525"]}
        gradientContainerStyle={{
          minWidth: 100,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        onPress={handleEmailLogin}
      >
        <ThemedText type="defaultSemiBold">Login</ThemedText>
      </ThemedButton>

      {/* Login dengan Nomor HP */}
      {/* <TextInput
        style={styles.input}
        placeholder="Phone Number (+62...)"
        value={phone}
        onChangeText={setPhone}
      />
      <Button title="Send OTP" onPress={handlePhoneLogin} />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} /> */}

      {/* Login dengan Google */}
      <ThemedButton
        useGradient
        gradientLightColor={["#FFFFFF", "#bcf7f7"]}
        gradientDarkColor={["#000000", "#252525"]}
        gradientContainerStyle={{
          minWidth: 100,
          justifyContent: "center",
          alignItems: "center",
          marginTop: 16,
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        onPress={() => promptAsync()}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <Ionicons name="logo-google" size={16} />
        <ThemedText style={{ marginLeft: 8 }} type="defaultSemiBold">
          Login with Google
        </ThemedText>
      </ThemedButton>

      {/* Link ke Halaman Register */}
      <ThemedText
        type="link"
        onPress={() => router.push("/signup")}
        style={styles.link}
      >
        Don't have an account? Register here.
      </ThemedText>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    position: "absolute",
    bottom: 20,
  },
});

export default LoginScreen;
