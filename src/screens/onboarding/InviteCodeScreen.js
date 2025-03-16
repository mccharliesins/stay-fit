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
  ActivityIndicator,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../constants/theme";
import CustomStatusBar from "../../components/CustomStatusBar";

const INVITE_CODE_LENGTH = 8;
const VALID_INVITE_CODES = ["11111111"]; // Add more codes as needed

const InviteCodeScreen = ({ navigation }) => {
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState(false);
  const shakeAnimation = new Animated.Value(0);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Auto-validate invite code as user types
    if (inviteCode.length === INVITE_CODE_LENGTH) {
      validateInviteCode(inviteCode);
    } else {
      setIsValid(false);
      setError("");
    }
  }, [inviteCode]);

  const validateInviteCode = async (code) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if code is in valid codes list
      const isValidCode = VALID_INVITE_CODES.includes(code);

      if (isValidCode) {
        setIsValid(true);
        setError("");
      } else {
        setIsValid(false);
        setError("Invalid invite code");
        shakeInput();
      }
    } catch (error) {
      setError("Failed to validate code");
      setIsValid(false);
      shakeInput();
    } finally {
      setIsLoading(false);
    }
  };

  const shakeInput = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleContinue = () => {
    if (isValid) {
      navigation.navigate("Walkthrough", {
        screen: "Welcome",
        params: { inviteCode },
      });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomStatusBar
        backgroundColor={theme.background}
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enter Invite Code</Text>
          <Text style={styles.subtitle}>
            Please enter the 8-digit invite code you received
          </Text>
        </View>

        <Animated.View
          style={[
            styles.inputContainer,
            { transform: [{ translateX: shakeAnimation }] },
          ]}
        >
          <TextInput
            style={[
              styles.input,
              isValid && styles.validInput,
              error && styles.errorInput,
            ]}
            placeholder="Enter 8-digit code"
            value={inviteCode}
            onChangeText={(text) => setInviteCode(text.replace(/[^0-9]/g, ""))}
            maxLength={INVITE_CODE_LENGTH}
            keyboardType="numeric"
            autoCorrect={false}
            editable={!isLoading}
            placeholderTextColor={theme.secondary}
          />
          {isLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              color={theme.primary}
            />
          )}
          {error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <Text style={styles.helperText}>
              {inviteCode.length}/{INVITE_CODE_LENGTH} digits
            </Text>
          )}
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValid}
          >
            <Text
              style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}
            >
              {isValid ? "Continue" : "Enter Valid Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.primary,
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
    marginBottom: 32,
  },
  input: {
    height: 56,
    backgroundColor: theme.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    textAlign: "center",
    letterSpacing: 12,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  validInput: {
    borderColor: "#4CAF50",
  },
  errorInput: {
    borderColor: theme.error,
  },
  loadingIndicator: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  errorText: {
    color: theme.error,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
    textAlign: "center",
  },
  helperText: {
    color: theme.secondary,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: "auto",
    marginBottom: 24,
  },
  button: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: theme.secondary,
    opacity: 0.5,
  },
  buttonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  buttonTextDisabled: {
    opacity: 0.8,
  },
});

export default InviteCodeScreen;
