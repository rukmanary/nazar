import React, { useState, useEffect } from "react";
import {
  View,
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
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { NAZAR_LOGO } from "@/assets";
import { GradientColors } from "@/constants/Colors";

WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const bgColor = GradientColors[theme].loginBackgournd;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

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
  const handlePhoneLogin = () => {
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        Alert.alert("OTP Sent", "Check your phone for the OTP.");
      })
      .catch((error) => {
        Alert.alert("Login Failed", error.message);
      });
  };

  // Verifikasi OTP
  const handleVerifyOtp = () => {
    const credential = GoogleAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then((userCredential) => {
        Alert.alert(
          "Login Success",
          `Welcome ${userCredential.user.phoneNumber}`
        );
        router.push("/");
      })
      .catch((error) => {
        Alert.alert("Verification Failed", error.message);
      });
  };

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
      <Button title="Login" onPress={handleEmailLogin} />

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
      <Button
        title="Login with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />

      {/* Link ke Halaman Register */}
      <Text onPress={() => router.push("/signup")} style={styles.link}>
        Don't have an account? Register here.
      </Text>
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
    color: "blue",
    textDecorationLine: "underline",
    position: "absolute",
    bottom: 20,
  },
});

export default LoginScreen;
