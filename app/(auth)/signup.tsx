import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Firebase Config Anda

WebBrowser.maybeCompleteAuthSession();

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");

  // Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_GOOGLE_WEB_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      // Kirim token ke Firebase Authentication
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          Alert.alert(
            "Login Success",
            `Welcome ${userCredential.user.displayName}`
          );
        })
        .catch((error) => {
          Alert.alert("Login Error", error.message);
        });
    }
  }, [response]);

  // Email/Password Sign-Up
  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      Alert.alert("Sign-Up Success", `Welcome ${userCredential.user.email}`);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // Phone Authentication: Request OTP
  const handlePhoneAuth = () => {
    const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
      callback: (response: any) => {
        console.log("Recaptcha verified:", response);
      },
    });

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        Alert.alert("OTP Sent", "Please check your phone.");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  // Phone Authentication: Verify OTP
  const handleVerifyOtp = () => {
    const credential = GoogleAuthProvider.credential(verificationId, otp);

    signInWithCredential(auth, credential)
      .then((userCredential) => {
        Alert.alert(
          "Login Success",
          `Welcome ${userCredential.user.phoneNumber}`
        );
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Email/Password Signup */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title="Sign Up with Email" onPress={handleEmailSignup} />

      {/* Phone Authentication */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number (+62XXXXXXXX)"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      />
      <Button title="Send OTP" onPress={handlePhoneAuth} />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={(text) => setOtp(text)}
        keyboardType="number-pad"
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} />

      {/* Google Sign-In */}
      <Button
        title="Sign Up with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default SignupScreen;
