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

            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            {renderInput("Email", email, setEmail)}
            {renderInput("Password", password, setPassword, true, true)}

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
  signInButton: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signInButtonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SignInModal;
