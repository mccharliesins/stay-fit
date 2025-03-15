import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../constants/theme";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [error, setError] = useState("");
  const { signUp } = useAuth();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { error } = await signUp({
        email,
        password,
        metadata: {
          name: name || email.split("@")[0],
          created_at: new Date().toISOString(),
        },
      });

      if (error) {
        setError(error.message);
        return;
      }

      setIsSignedUp(true);
    } catch (error) {
      setError(error.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderInput = (
    label,
    value,
    onChangeText,
    placeholder,
    isPassword = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword}
        autoCapitalize={
          isPassword ? "none" : label === "Email" ? "none" : "words"
        }
        autoCorrect={false}
        keyboardType={label === "Email" ? "email-address" : "default"}
        editable={!isLoading}
        placeholderTextColor={theme.secondary}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          {!isSignedUp ? (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>StayFit</Text>
                <Text style={styles.subtitle}>Create a new account</Text>
              </View>

              <View style={styles.form}>
                {renderInput("Name", name, setName, "Enter your name")}
                {renderInput("Email", email, setEmail, "Enter your email")}
                {renderInput(
                  "Password",
                  password,
                  setPassword,
                  "Enter your password",
                  true
                )}
                {renderInput(
                  "Confirm Password",
                  confirmPassword,
                  setConfirmPassword,
                  "Confirm your password",
                  true
                )}

                {error ? (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.white} />
                  ) : (
                    <Text style={styles.buttonText}>Sign Up</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.signInContainer}>
                  <Text style={styles.signInText}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity onPress={handleSignIn}>
                    <Text style={styles.signInButtonText}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={styles.confirmationContainer}>
              <Text style={styles.confirmationTitle}>Almost there!</Text>
              <Text style={styles.confirmationText}>
                We've sent a confirmation email to:
              </Text>
              <Text style={styles.emailText}>{email}</Text>
              <Text style={styles.confirmationText}>
                Please check your email and click the confirmation link to
                activate your account. Once confirmed, you can log in to your
                account.
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text style={styles.buttonText}>Go to Sign In</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: theme.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: theme.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.background,
  },
  button: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  errorContainer: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signInText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  signInButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.primary,
  },
  confirmationContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
  },
  confirmationTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: theme.primary,
    marginBottom: 16,
  },
  confirmationText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 16,
  },
});

export default SignUpScreen;
