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
  ActivityIndicator,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../constants/theme";

const WaitlistScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleJoinWaitlist = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call to add email to waitlist
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate success (replace with actual API call)
      setIsSuccess(true);
    } catch (error) {
      setError("Failed to join waitlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.successContainer}>
          <Image
            source={require("../../../assets/success.png")}
            style={styles.successImage}
          />
          <Text style={styles.successTitle}>You're on the list! 🎉</Text>
          <Text style={styles.successText}>
            We'll notify you at {email} when your exclusive access is ready.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Entry")}
          >
            <Text style={styles.buttonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Join the Waitlist</Text>
          <Text style={styles.subtitle}>
            Be the first to know when we have spots available
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError("");
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              placeholderTextColor={theme.secondary}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleJoinWaitlist}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={theme.white} />
            ) : (
              <Text style={styles.buttonText}>Join Waitlist</Text>
            )}
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
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 24,
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
  errorText: {
    color: theme.error,
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    marginTop: 8,
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
  successContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  successImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: theme.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
    marginBottom: 32,
  },
});

export default WaitlistScreen;
