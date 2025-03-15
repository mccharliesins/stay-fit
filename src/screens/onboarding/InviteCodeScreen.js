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

const INVITE_CODE_LENGTH = 6;

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
      // TODO: Replace with actual API call to validate invite code
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate validation (replace with actual validation)
      const isValidCode = code === "123456";

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
      navigation.navigate("Walkthrough", { inviteCode });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Enter Invite Code</Text>
          <Text style={styles.subtitle}>
            Please enter the invite code you received
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
            placeholder="Enter 6-digit code"
            value={inviteCode}
            onChangeText={(text) => setInviteCode(text.toUpperCase())}
            maxLength={INVITE_CODE_LENGTH}
            autoCapitalize="characters"
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
              {inviteCode.length}/{INVITE_CODE_LENGTH} characters
            </Text>
          )}
        </Animated.View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
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
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
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
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 32,
  },
  input: {
    height: 56,
    backgroundColor: theme.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    textAlign: "center",
    letterSpacing: 8,
    borderWidth: 2,
    borderColor: theme.background,
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
    gap: 16,
  },
  button: {
    height: 56,
    backgroundColor: theme.primary,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  backButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: theme.secondary,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default InviteCodeScreen;
