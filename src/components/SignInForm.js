import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Keyboard,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";

// Theme colors
const theme = {
  primary: "#4A5D32", // Olive green
  secondary: "#7A8B69", // Lighter olive
  accent: "#D4E6B5", // Very light olive/sage
  text: "#1A1E13", // Dark olive, almost black
  background: "#F5F7F2", // Off-white with slight green tint
  white: "#FFFFFF",
  error: "#D32F2F", // Error red
};

const SignInForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signIn(email, password);
      // Navigation will be handled by the AuthContext
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Animated.View style={styles.container}>
      <View style={styles.form}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue your fitness journey
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.secondary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.white} />
          ) : (
            <Text style={styles.buttonText}>Sign in</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  form: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.secondary,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: "transparent",
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: theme.secondary,
  },
  buttonText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    padding: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: theme.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SignInForm;
