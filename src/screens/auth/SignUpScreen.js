import React, { useState, useEffect } from "react";
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
  Alert,
  NetInfo,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import { createUserProfile } from "../../services/databaseService";
import { checkNetworkConnection } from "../../utils/networkCheck";
import { SUPABASE_URL } from "@env";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingNetwork, setIsCheckingNetwork] = useState(false);

  const { signUp, networkError } = useAuth();

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }

    // Check network connection first
    setIsCheckingNetwork(true);
    try {
      const supabaseUrl = SUPABASE_URL || "https://example.supabase.co";
      const networkResult = await checkNetworkConnection(supabaseUrl);

      if (!networkResult.connected) {
        Alert.alert(
          "Network Error",
          "Unable to connect to the server. Please check your internet connection and try again.",
          [{ text: "OK" }]
        );
        return;
      }
    } catch (error) {
      console.error("Network check error:", error);
    } finally {
      setIsCheckingNetwork(false);
    }

    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error } = await signUp({
        email,
        password,
        name,
      });

      if (error) {
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        } else {
          Alert.alert("Error", error.message);
        }
        return;
      }

      // Create user profile in the database
      if (data?.user) {
        try {
          await createUserProfile({
            id: data.user.id,
            name,
            email,
            age: null,
            weight: null,
            height: null,
            goal: null,
            created_at: new Date().toISOString(),
          });

          Alert.alert(
            "Success",
            "Your account has been created. Please check your email to confirm your registration.",
            [{ text: "OK", onPress: () => navigation.navigate("SignIn") }]
          );
        } catch (profileError) {
          console.error("Error creating profile:", profileError);

          // Still consider signup successful even if profile creation fails
          Alert.alert(
            "Account Created",
            "Your account has been created, but there was an issue setting up your profile. Please try updating your profile later.",
            [{ text: "OK", onPress: () => navigation.navigate("SignIn") }]
          );
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>StayFit</Text>
            <Text style={styles.subtitle}>Create a new account</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading || isCheckingNetwork}
            >
              {isLoading || isCheckingNetwork ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {networkError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  Network connection issue. Please check your internet
                  connection and try again.
                </Text>
              </View>
            )}

            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text style={styles.signInButtonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#666",
  },
  form: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  signUpButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  errorText: {
    color: "#d32f2f",
    fontSize: 14,
    textAlign: "center",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signInText: {
    color: "#666",
    fontSize: 16,
    marginRight: 5,
  },
  signInButtonText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
