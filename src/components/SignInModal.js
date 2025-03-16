import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../constants/theme";
import { supabase } from "../services/supabase";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

const SignInModal = ({ visible, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onSuccess();
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "stayfit://reset-password",
      });

      if (error) throw error;

      setResetSent(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    placeholder,
    value,
    onChangeText,
    secureTextEntry = false,
    isPassword = false
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={isPassword && !showPassword}
        autoCapitalize="none"
        keyboardType={
          placeholder.toLowerCase().includes("email")
            ? "email-address"
            : "default"
        }
      />
      {isPassword && (
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderSignInView = () => (
    <>
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      {renderInput("Email", email, setEmail)}
      {renderInput("Password", password, setPassword, true, true)}

      <TouchableOpacity
        style={styles.forgotPasswordButton}
        onPress={() => {
          setIsResetMode(true);
          setPassword("");
        }}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signInButton}
        onPress={handleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.white} />
        ) : (
          <Text style={styles.signInButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderResetView = () => (
    <>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          setIsResetMode(false);
          setResetSent(false);
        }}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
        <Text style={styles.backButtonText}>Back to Sign In</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        {resetSent
          ? "Check your email for reset instructions"
          : "Enter your email to receive reset instructions"}
      </Text>

      {!resetSent && (
        <>
          {renderInput("Email", email, setEmail)}
          <TouchableOpacity
            style={styles.signInButton}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.white} />
            ) : (
              <Text style={styles.signInButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {resetSent && (
        <View style={styles.resetSentContainer}>
          <Ionicons name="mail" size={48} color={theme.primary} />
          <Text style={styles.resetSentText}>
            We've sent you an email with instructions to reset your password.
          </Text>
          <TouchableOpacity
            style={[styles.signInButton, styles.resendButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={theme.white} />
            ) : (
              <Text style={styles.signInButtonText}>Resend Email</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>

            {isResetMode ? renderResetView() : renderSignInView()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 400,
  },
  closeButton: {
    position: "absolute",
    right: 24,
    top: 24,
    zIndex: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 8,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.textLight,
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
    position: "relative",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    backgroundColor: theme.white,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: theme.primary,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  signInButton: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  signInButtonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  resetSentContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  resetSentText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
    marginVertical: 16,
    lineHeight: 24,
  },
  resendButton: {
    marginTop: 24,
    backgroundColor: theme.primary + "20",
  },
});

export default SignInModal;
