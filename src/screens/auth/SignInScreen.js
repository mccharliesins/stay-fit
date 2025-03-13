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
  ImageBackground,
  Linking,
  Animated,
  Modal,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import SignInForm from "../../components/SignInForm";

const { width, height } = Dimensions.get("window");

// Theme colors
const theme = {
  primary: "#4A5D32", // Olive green
  secondary: "#7A8B69", // Lighter olive
  accent: "#D4E6B5", // Very light olive/sage
  text: "#1A1E13", // Dark olive, almost black
  background: "#F5F7F2", // Off-white with slight green tint
  white: "#FFFFFF",
};

const SignInScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { signIn } = useAuth();

  const slides = [
    {
      title: "READY TO START",
      subtitle: "YOUR FITNESS",
      emphasis: "JOURNEY?",
    },
    {
      title: "TRACK YOUR",
      subtitle: "WORKOUTS WITH",
      emphasis: "CONFIDENCE",
    },
    {
      title: "JOIN THE",
      subtitle: "STAYFIT",
      emphasis: "COMMUNITY",
    },
  ];

  // Animation values
  const fadeAnim = {
    title: new Animated.Value(0),
    subtitle: new Animated.Value(0),
    emphasis: new Animated.Value(0),
    buttons: new Animated.Value(0),
  };

  const scaleAnim = {
    signUp: new Animated.Value(1),
    logIn: new Animated.Value(1),
  };

  useEffect(() => {
    // Sequence of fade-in animations
    const startAnimations = () => {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim.title, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim.subtitle, {
            toValue: 1,
            duration: 800,
            delay: 200,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(fadeAnim.emphasis, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim.buttons, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Reset and start animations when slide changes
    Object.values(fadeAnim).forEach((anim) => anim.setValue(0));
    startAnimations();

    // Auto-advance slides
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleCreateAccount = () => {
    navigation.navigate("SignUp");
  };

  const handleSignIn = () => {
    setShowSignInForm(true);
  };

  const handleCloseSignInForm = () => {
    setShowSignInForm(false);
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
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.logo}>SF</Text>
          </View>

          <View style={styles.content}>
            <View style={styles.titleContainer}>
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
                {slides[currentSlide].title}
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
                {slides[currentSlide].subtitle}
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.emphasis,
                  {
                    opacity: fadeAnim.emphasis,
                    transform: [
                      {
                        translateY: fadeAnim.emphasis.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                {slides[currentSlide].emphasis}
              </Animated.Text>
            </View>

            <View style={styles.dotsContainer}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentSlide === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>
          </View>

          <Animated.View
            style={[
              styles.buttonContainer,
              {
                opacity: fadeAnim.buttons,
                transform: [
                  {
                    translateY: fadeAnim.buttons.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={[{ transform: [{ scale: scaleAnim.signUp }] }]}
            >
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleCreateAccount}
                onPressIn={() => handlePressIn("signUp")}
                onPressOut={() => handlePressOut("signUp")}
              >
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[{ transform: [{ scale: scaleAnim.logIn }] }]}
            >
              <TouchableOpacity
                style={styles.logInButton}
                onPress={handleSignIn}
                onPressIn={() => handlePressIn("logIn")}
                onPressOut={() => handlePressOut("logIn")}
              >
                <Text style={styles.logInButtonText}>Log in</Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>

        <Modal
          visible={showSignInForm}
          transparent
          animationType="slide"
          onRequestClose={handleCloseSignInForm}
        >
          <SignInForm onClose={handleCloseSignInForm} />
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "flex-start",
    marginTop: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: theme.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.white,
    marginBottom: 8,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.white,
    marginBottom: 8,
    letterSpacing: 1,
  },
  emphasis: {
    fontSize: 42,
    fontWeight: "800",
    color: theme.accent,
    letterSpacing: 1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.white,
    width: 24,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  signUpButton: {
    backgroundColor: theme.white,
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: "600",
  },
  logInButton: {
    borderRadius: 30,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.white,
  },
  logInButtonText: {
    color: theme.white,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SignInScreen;
