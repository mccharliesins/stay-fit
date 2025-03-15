import React, { useState, useRef } from "react";
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
  Dimensions,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { theme } from "../constants/theme";

const { width } = Dimensions.get("window");

const SignInForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const { signIn, resetPassword } = useAuth();

  const handleSubmit = async () => {
    if (isLoading) return;

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      await signIn({ email, password });
      // Navigation will be handled by the AuthContext
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const animateSlide = (toValue) => {
    Animated.spring(slideAnim, {
      toValue,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  };

  const handleForgotPassword = () => {
    animateSlide(-width);
    setShowForgotPassword(true);
  };

  const handleBackToSignIn = () => {
    animateSlide(0);
    setShowForgotPassword(false);
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setIsSendingReset(true);
    try {
      const { error } = await resetPassword(email);
      if (error) throw error;

      Alert.alert(
        "Success",
        "Password reset instructions have been sent to your email",
        [{ text: "OK", onPress: handleBackToSignIn }]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSendingReset(false);
    }
  };

  const renderInput = (
    value,
    onChangeText,
    placeholder,
    isPassword = false
  ) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor={theme.secondary}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={isPassword}
      autoCapitalize={isPassword ? "none" : "none"}
      autoCorrect={false}
      keyboardType={isPassword ? "default" : "email-address"}
      editable={!isLoading && !isSendingReset}
    />
  );

  return (
    <Animated.View style={styles.container}>
      <View style={styles.form}>
        <Animated.View
          style={[
            styles.slidingContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Sign In Form */}
          <View style={styles.slideContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>
                Sign in to continue your fitness journey
              </Text>
            </View>

            <View style={styles.inputContainer}>
              {renderInput(email, setEmail, "Email")}
              {renderInput(password, setPassword, "Password", true)}

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={handleForgotPassword}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
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

          {/* Forgot Password Form */}
          <View style={[styles.slideContent, { width }]}>
            <View style={styles.header}>
              <Text style={styles.title}>Reset Password</Text>
              <Text style={styles.subtitle}>
                Enter your email to receive reset instructions
              </Text>
            </View>

            <View style={styles.inputContainer}>
              {renderInput(email, setEmail, "Email")}
            </View>

            <TouchableOpacity
              style={[styles.button, isSendingReset && styles.buttonDisabled]}
              onPress={handleResetPassword}
              disabled={isSendingReset}
            >
              {isSendingReset ? (
                <ActivityIndicator color={theme.white} />
              ) : (
                <Text style={styles.buttonText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToSignIn}
            >
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.overlay,
  },
  form: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  slidingContainer: {
    flexDirection: "row",
    width: width * 2,
  },
  slideContent: {
    width,
    padding: 24,
    paddingTop: 32,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: theme.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
    marginBottom: 16,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: theme.primary,
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  button: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  closeButton: {
    alignItems: "center",
  },
  closeButtonText: {
    color: theme.secondary,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  backButton: {
    marginBottom: 16,
    alignItems: "center",
  },
  backButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SignInForm;
