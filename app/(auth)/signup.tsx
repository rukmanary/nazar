import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
  ActivityIndicator,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile,
  signOut,
  validatePassword,
  // RecaptchaVerifier,
  // signInWithPhoneNumber,
} from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Firebase Config Anda
import { LinearGradient } from "expo-linear-gradient";
import { GradientColors } from "@/constants/Colors";
import { ThemedButton } from "@/components/ThemedButton";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import { calculatePasswordStrength } from "@/helpers/password";
import PasswordStrengthBar from "@/components/PasswordStrengthBar";

WebBrowser.maybeCompleteAuthSession();

type PasswordStatus = {
  containsLowercaseLetter: boolean | undefined;
  containsNonAlphanumericCharacter: boolean | undefined;
  containsNumericCharacter: boolean | undefined;
  containsUppercaseLetter: boolean | undefined;
  meetsMinPasswordLength: boolean | undefined;
};

type PasswordLevel = "Weak" | "Medium" | "Strong" | undefined;

const SignupScreen = () => {
  // const auth = getAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [phone, setPhone] = useState("");
  // const [otp, setOtp] = useState("");
  // const [verificationId, setVerificationId] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus>({
    containsLowercaseLetter: false,
    containsNonAlphanumericCharacter: false,
    containsNumericCharacter: false,
    containsUppercaseLetter: false,
    meetsMinPasswordLength: false,
  });
  const [passwordStrengthLevel, setPasswordStrengthLevel] =
    useState<PasswordLevel>(undefined);
  const [passwordStrengthPercentage, setPasswordStrengPercentage] = useState(0);
  const [passwordHasCommonPattern, setPasswordHasCommonPattern] =
    useState(false);

  const theme = useColorScheme() ?? "light";
  const bgColor = GradientColors[theme].loginBackground;

  // Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_CLIENT_ID,
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
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ).finally(async () => {
        const user = auth.currentUser;
        if (user) {
          try {
            await updateProfile(user, { displayName: username });
          } catch (error: any) {
            console.error("Error updating profile:", error);
          }
        }
        setIsLoading(false);
      });
      console.log({ userCredential });
      Alert.alert(
        "Sign-Up Success",
        `Welcome ${userCredential.user.displayName}`
      );
    } catch (error: any) {
      console.log({ error });
      Alert.alert("Error", error.message);
    }
  };

  const _validatePassword = async () => {
    const status = await validatePassword(auth, password);
    const {
      isValid,
      containsLowercaseLetter,
      containsNonAlphanumericCharacter,
      containsNumericCharacter,
      containsUppercaseLetter,
      meetsMinPasswordLength,
    } = status;
    console.log({ status });
    setPasswordStatus({
      containsLowercaseLetter,
      containsNonAlphanumericCharacter,
      containsNumericCharacter,
      containsUppercaseLetter,
      meetsMinPasswordLength,
    });
    const { hasCommonPatterns, level, percentage } = calculatePasswordStrength({
      password,
      hasLowercase: containsLowercaseLetter,
      hasNumbers: containsNumericCharacter,
      hasSymbols: containsNonAlphanumericCharacter,
      hasUppercase: containsUppercaseLetter,
    });

    setPasswordStrengPercentage(percentage);
    setPasswordStrengthLevel(level);
    setPasswordHasCommonPattern(hasCommonPatterns);
  };

  // Phone Authentication: Request OTP
  // const handlePhoneAuth = () => {
  //   const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  //     size: "invisible",
  //     callback: (response: any) => {
  //       console.log("Recaptcha verified:", response);
  //     },
  //   });

  //   signInWithPhoneNumber(auth, phone, appVerifier)
  //     .then((confirmationResult) => {
  //       setVerificationId(confirmationResult.verificationId);
  //       Alert.alert("OTP Sent", "Please check your phone.");
  //     })
  //     .catch((error) => {
  //       Alert.alert("Error", error.message);
  //     });
  // };

  // // Phone Authentication: Verify OTP
  // const handleVerifyOtp = () => {
  //   const credential = GoogleAuthProvider.credential(verificationId, otp);

  //   signInWithCredential(auth, credential)
  //     .then((userCredential) => {
  //       Alert.alert(
  //         "Login Success",
  //         `Welcome ${userCredential.user.phoneNumber}`
  //       );
  //     })
  //     .catch((error) => {
  //       Alert.alert("Error", error.message);
  //     });
  // };

  return (
    <LinearGradient colors={bgColor} style={styles.container}>
      {isLoading && <ActivityIndicator size="large" style={styles.loading} />}
      <Text style={styles.title}>Register</Text>

      {/* Email/Password Signup */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        keyboardType="default"
        autoCapitalize="none"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        autoCapitalize="none"
        editable={!isLoading}
        onChange={_validatePassword}
      />
      <PasswordStrengthBar
        level={passwordStrengthLevel}
        progress={passwordStrengthPercentage}
      />

      <View>
        <ThemedText
          colorName={
            passwordStatus.meetsMinPasswordLength
              ? "passwordStatusCheck"
              : "text"
          }
        >
          *Password must has minumum 8 characters
        </ThemedText>
        <ThemedText
          colorName={
            passwordStatus.containsLowercaseLetter
              ? "passwordStatusCheck"
              : "text"
          }
        >
          *Password must contain at least 1 Lowercase
        </ThemedText>
        <ThemedText
          colorName={
            passwordStatus.containsUppercaseLetter
              ? "passwordStatusCheck"
              : "text"
          }
        >
          *Password must contain at least 1 Uppercase
        </ThemedText>
        <ThemedText
          colorName={
            passwordStatus.containsNumericCharacter
              ? "passwordStatusCheck"
              : "text"
          }
        >
          *Password must contain at least 1 Numeric character
        </ThemedText>
        <ThemedText
          colorName={
            passwordStatus.containsNonAlphanumericCharacter
              ? "passwordStatusCheck"
              : "text"
          }
        >
          *Password must contain at least 1 non Alpha Numeric character
        </ThemedText>
      </View>
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
        onPress={handleEmailSignup}
        disabled={isLoading}
      >
        <ThemedText type="defaultSemiBold">Sign Up</ThemedText>
      </ThemedButton>

      {/* Phone Authentication */}
      {/* <TextInput
        style={styles.input}
        placeholder="Phone Number (+62XXXXXXXX)"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        keyboardType="phone-pad"
      /> */}
      {/* <Button title="Send OTP" onPress={handlePhoneAuth} />
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={(text) => setOtp(text)}
        keyboardType="number-pad"
      />
      <Button title="Verify OTP" onPress={handleVerifyOtp} /> */}

      {/* Google Sign-In */}
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
        disabled={isLoading}
      >
        <Ionicons name="logo-google" size={16} />
        <ThemedText style={{ marginLeft: 8 }} type="defaultSemiBold">
          Sign Up with Google
        </ThemedText>
      </ThemedButton>
    </LinearGradient>
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
  loading: { position: "absolute", zIndex: 100 },
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
