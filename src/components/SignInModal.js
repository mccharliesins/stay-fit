import React, { useState, useEffect, useRef } from "react";
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
import LottieView from "lottie-react-native";
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
  const [resendTimer, setResendTimer] = useState(0);

  const loadingAnimation = useRef(null);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((current) => current - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (loading && loadingAnimation.current) {
      loadingAnimation.current.play();
    }
  }, [loading]);

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
      setResendTimer(60); // Start 60 second timer
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

  const renderLoadingAnimation = (color = theme.white, size = 40) => (
    <LottieView
      ref={loadingAnimation}
      source={require("../../assets/animations/loading.json")}
      style={{ width: size, height: size }}
      autoPlay
      loop
      colorFilters={[
        {
          keypath: "Shape Layer 1",
          color: color,
        },
      ]}
    />
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
          renderLoadingAnimation()
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
          setResendTimer(0);
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
              renderLoadingAnimation()
            ) : (
              <Text style={styles.signInButtonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {resetSent && (
        <View style={styles.resetSentContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail" size={48} color={theme.primary} />
          </View>
          <Text style={styles.resetSentText}>
            We've sent you an email with instructions to reset your password.
          </Text>
          <TouchableOpacity
            style={[
              styles.resendButton,
              resendTimer > 0 && styles.resendButtonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={loading || resendTimer > 0}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                {renderLoadingAnimation(theme.primary, 24)}
                <Text style={[styles.resendButtonText, { marginLeft: 8 }]}>
                  Sending...
                </Text>
              </View>
            ) : (
              <Text
                style={[
                  styles.resendButtonText,
                  resendTimer > 0 && styles.resendButtonTextDisabled,
                ]}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Email"}
              </Text>
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
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.primary + "10",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  resetSentText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
    marginBottom: 32,
    lineHeight: 24,
  },
  resendButton: {
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: theme.white,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  resendButtonDisabled: {
    backgroundColor: theme.white,
    borderColor: theme.textLight,
  },
  resendButtonText: {
    color: theme.primary,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  resendButtonTextDisabled: {
    color: theme.textLight,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignInModal;
