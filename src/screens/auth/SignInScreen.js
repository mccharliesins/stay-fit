import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Animated,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";

const SignInScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  // Animation values
  const fadeAnim = {
    title: new Animated.Value(0),
    subtitle: new Animated.Value(0),
    terms: new Animated.Value(0),
    buttons: new Animated.Value(0),
  };

  const scaleAnim = {
    createAccount: new Animated.Value(1),
    signIn: new Animated.Value(1),
  };

  useEffect(() => {
    // Sequence of fade-in animations
    Animated.stagger(400, [
      Animated.timing(fadeAnim.title, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim.subtitle, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim.terms, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim.buttons, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
  };

  const handleSignIn = () => {
    navigation.navigate("SignIn");
  };

  const handleTermsPress = () => {
    Linking.openURL("https://stayfit.com/terms");
  };

  const handlePrivacyPress = () => {
    Linking.openURL("https://stayfit.com/privacy");
  };

  const handleCookiesPress = () => {
    Linking.openURL("https://stayfit.com/cookies");
  };

  const handlePressIn = (button) => {
    Animated.spring(scaleAnim[button], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (button) => {
    Animated.spring(scaleAnim[button], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.header}>
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: fadeAnim.title,
                  transform: [
                    {
                      translateY: fadeAnim.title.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              StayFit
            </Animated.Text>
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: fadeAnim.subtitle,
                  transform: [
                    {
                      translateY: fadeAnim.subtitle.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              Your fitness journey starts here.
            </Animated.Text>
          </View>

          <View style={styles.footer}>
            <Animated.Text
              style={[
                styles.termsText,
                {
                  opacity: fadeAnim.terms,
                },
              ]}
            >
              By tapping 'Sign in' / 'Create account', you agree to our{" "}
              <Text style={styles.link} onPress={handleTermsPress}>
                Terms of Service
              </Text>
              . Learn how we process your data in our{" "}
              <Text style={styles.link} onPress={handlePrivacyPress}>
                Privacy Policy
              </Text>{" "}
              and{" "}
              <Text style={styles.link} onPress={handleCookiesPress}>
                Cookies Policy
              </Text>
              .
            </Animated.Text>

            <Animated.View
              style={[
                {
                  opacity: fadeAnim.buttons,
                  transform: [
                    {
                      translateY: fadeAnim.buttons.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  {
                    transform: [{ scale: scaleAnim.createAccount }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.createAccountButton}
                  onPress={handleCreateAccount}
                  disabled={isLoading}
                  onPressIn={() => handlePressIn("createAccount")}
                  onPressOut={() => handlePressOut("createAccount")}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.createAccountButtonText}>
                      Create account
                    </Text>
                  )}
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  {
                    transform: [{ scale: scaleAnim.signIn }],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={handleSignIn}
                  onPressIn={() => handlePressIn("signIn")}
                  onPressOut={() => handlePressOut("signIn")}
                >
                  <Text style={styles.signInButtonText}>Sign in</Text>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
  },
  footer: {
    marginBottom: 32,
  },
  termsText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  link: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  createAccountButton: {
    backgroundColor: "#7B2CBF",
    borderRadius: 30,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  createAccountButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  signInButton: {
    alignItems: "center",
  },
  signInButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SignInScreen;
