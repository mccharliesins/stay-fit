import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
  Modal,
  Dimensions,
  PanResponder,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../../context/AuthContext";
import SignInForm from "../../components/SignInForm";
import SignUpForm from "../../components/SignUpForm";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

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

function SignInScreen({ navigation }) {
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        slideAnim.setOffset(slideAnim._value);
      },
      onPanResponderMove: (_, gestureState) => {
        const { dx } = gestureState;
        const newValue = -currentSlide * width + dx;
        if (newValue <= 0 && newValue >= -(slides.length - 1) * width) {
          slideAnim.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        slideAnim.flattenOffset();

        let newIndex = currentSlide;
        if (Math.abs(vx) > 0.5 || Math.abs(dx) > width / 3) {
          if (dx > 0 && currentSlide > 0) {
            newIndex = currentSlide - 1;
          } else if (dx < 0 && currentSlide < slides.length - 1) {
            newIndex = currentSlide + 1;
          }
        }

        Animated.spring(slideAnim, {
          toValue: -newIndex * width,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();

        setCurrentSlide(newIndex);
      },
    })
  ).current;

  useEffect(() => {
    // Initial buttons fade in
    Animated.timing(buttonsAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Auto-advance slides
    const interval = setInterval(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      setCurrentSlide(nextSlide);
      Animated.spring(slideAnim, {
        toValue: -nextSlide * width,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleCreateAccount = () => {
    setShowSignUpForm(true);
  };

  const handleSignIn = () => {
    setShowSignInForm(true);
  };

  const handleCloseSignInForm = () => {
    setShowSignInForm(false);
  };

  const handleCloseSignUpForm = () => {
    setShowSignUpForm(false);
  };

  if (!fontsLoaded) {
    return null;
  }

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
            <Animated.View
              style={[
                styles.slidesContainer,
                {
                  transform: [{ translateX: slideAnim }],
                },
              ]}
              {...panResponder.panHandlers}
            >
              {slides.map((slide, index) => (
                <View key={index} style={styles.slide}>
                  <View style={styles.titleContainer}>
                    <Text style={styles.title}>{slide.title}</Text>
                    <Text style={styles.subtitle}>{slide.subtitle}</Text>
                    <Text style={styles.emphasis}>{slide.emphasis}</Text>
                  </View>
                </View>
              ))}
            </Animated.View>

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
                opacity: buttonsAnim,
                transform: [
                  {
                    translateY: buttonsAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleCreateAccount}
            >
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logInButton} onPress={handleSignIn}>
              <Text style={styles.logInButtonText}>Log in</Text>
            </TouchableOpacity>
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

        <Modal
          visible={showSignUpForm}
          transparent
          animationType="slide"
          onRequestClose={handleCloseSignUpForm}
        >
          <SignUpForm onClose={handleCloseSignUpForm} />
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 0,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 50 : 24,
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
    fontFamily: "Poppins_700Bold",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
  slidesContainer: {
    flexDirection: "row",
    width: width * 3, // Number of slides
  },
  slide: {
    width: width,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    color: theme.white,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 32,
    color: theme.white,
    marginBottom: 8,
    letterSpacing: 1,
    fontFamily: "Poppins_700Bold",
  },
  emphasis: {
    fontSize: 32,
    color: theme.accent,
    letterSpacing: 1,
    fontFamily: "Poppins_700Bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
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
    marginTop: 40,
    paddingHorizontal: 16,
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
    fontFamily: "Poppins_600SemiBold",
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
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SignInScreen;
