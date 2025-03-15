import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  StatusBar,
  SafeAreaView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const WelcomeScreen = ({ navigation, route }) => {
  const { inviteCode } = route.params;

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../../../assets/fitness-bg.jpg")}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <LottieView
              source={require("../../../../assets/animations/fitness.json")}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.title}>
              Your Fitness Journey{"\n"}Starts Today!
            </Text>
            <Text style={styles.subtitle}>
              Let's get you set up for success with a personalized fitness plan.
            </Text>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("FitnessGoal", { inviteCode })}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "space-between",
    padding: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.white,
    textAlign: "center",
    opacity: 0.9,
  },
  footer: {
    width: "100%",
    paddingBottom: 24,
  },
  button: {
    backgroundColor: theme.primary,
    height: 56,
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
  buttonText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default WelcomeScreen;
