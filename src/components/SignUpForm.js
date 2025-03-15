import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
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
  error: "#FF6B6B",
};

const SignUpForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    setError("");
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp({
        email,
        password,
        metadata: {
          name: email.split("@")[0],
          created_at: new Date().toISOString(),
        },
      });

      if (error) {
        setError(error.message || "Failed to sign up");
        return;
      }

      setIsSignedUp(true);
    } catch (err) {
      setError(err.message || "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <View style={styles.overlay} onStartShouldSetResponder={() => true}>
          <View style={styles.formContainer}>
            {!isSignedUp ? (
              <>
                <Text style={styles.title}>Create Account</Text>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <TouchableOpacity
                  style={[
                    styles.signUpButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleSignUp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={theme.white} />
                  ) : (
                    <Text style={styles.signUpButtonText}>Sign up</Text>
                  )}
                </TouchableOpacity>
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
              </View>
            )}

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>
                {isSignedUp ? "Back to Home" : "Cancel"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "flex-end",
  },
  formContainer: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.text,
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: theme.background,
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.text,
  },
  errorText: {
    color: theme.error,
    marginBottom: 16,
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: theme.primary,
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: theme.secondary,
    opacity: 0.7,
  },
  signUpButtonText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmationContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  confirmationTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  confirmationText: {
    fontSize: 16,
    color: theme.text,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  emailText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.primary,
    marginBottom: 12,
  },
});

export default SignUpForm;
