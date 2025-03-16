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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import SignInForm from "../../components/SignInForm";
import SignUpForm from "../../components/SignUpForm";
import { theme, fonts } from "../../constants/theme";

const { width } = Dimensions.get("window");

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

function SignInScreen() {
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

        animateToSlide(newIndex);
      },
    })
  ).current;

  const animateToSlide = (index) => {
    Animated.spring(slideAnim, {
      toValue: -index * width,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setCurrentSlide(index);
  };

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
      animateToSlide(nextSlide);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentSlide]);

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
              onPress={() => setShowSignUpForm(true)}
            >
              <Text style={styles.signUpButtonText}>Sign up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logInButton}
              onPress={() => setShowSignInForm(true)}
            >
              <Text style={styles.logInButtonText}>Log in</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Modal
          visible={showSignInForm}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSignInForm(false)}
        >
          <SignInForm onClose={() => setShowSignInForm(false)} />
        </Modal>

        <Modal
          visible={showSignUpForm}
          transparent
          animationType="slide"
          onRequestClose={() => setShowSignUpForm(false)}
        >
          <SignUpForm onClose={() => setShowSignUpForm(false)} />
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingTop: 48,
  },
  header: {
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  slidesContainer: {
    flexDirection: "row",
    width: width * slides.length,
  },
  slide: {
    width,
    paddingHorizontal: 24,
  },
  titleContainer: {
    alignItems: "flex-start",
  },
  title: {
    fontSize: 40,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 40,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    marginBottom: 8,
  },
  emphasis: {
    fontSize: 40,
    fontFamily: "Poppins_700Bold",
    color: theme.accent,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: theme.white,
  },
  buttonContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  signUpButton: {
    backgroundColor: theme.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  logInButton: {
    backgroundColor: "transparent",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.white,
  },
  logInButtonText: {
    color: theme.white,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SignInScreen;
