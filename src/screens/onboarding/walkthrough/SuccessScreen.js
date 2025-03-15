import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");

const SuccessScreen = ({ navigation, route }) => {
  const {
    inviteCode,
    fitnessGoal,
    userDetails,
    preferences,
    reminders,
    privacy,
    subscription,
  } = route.params;

  const [scale] = React.useState(new Animated.Value(0));
  const [opacity] = React.useState(new Animated.Value(0));

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Animate content appearing
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getMotivationalMessage = () => {
    switch (fitnessGoal) {
      case "muscle":
        return "Time to build that strength! Let's make every rep count.";
      case "weight":
        return "Your journey to a healthier you starts now. Let's crush those goals!";
      case "endurance":
        return "Ready to boost your stamina? Let's build that endurance together!";
      default:
        return "You're all set! Let's start your fitness journey.";
    }
  };

  const handleStart = () => {
    // TODO: Navigate to the main app screen
    navigation.reset({
      index: 0,
      routes: [{ name: "MainApp" }],
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.content}>
        <LottieView
          source={require("../../../../assets/animations/confetti.json")}
          autoPlay
          loop={false}
          style={styles.confetti}
        />

        <Animated.View
          style={[
            styles.successContent,
            {
              transform: [{ scale }],
              opacity,
            },
          ]}
        >
          <LottieView
            source={require("../../../../assets/animations/success.json")}
            autoPlay
            loop={false}
            style={styles.successAnimation}
          />

          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.message}>{getMotivationalMessage()}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {preferences.workoutStyle === "home" ? "Home" : "Gym"}
              </Text>
              <Text style={styles.statLabel}>Workout</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{reminders.time.label}</Text>
              <Text style={styles.statLabel}>Schedule</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {subscription ? "Premium" : "Basic"}
              </Text>
              <Text style={styles.statLabel}>Plan</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      <Animated.View
        style={[
          styles.footer,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Start Your First Workout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.primary,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  confetti: {
    position: "absolute",
    width: width,
    height: width,
  },
  successContent: {
    alignItems: "center",
    padding: 24,
  },
  successAnimation: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 18,
    fontFamily: "Poppins_400Regular",
    color: theme.white,
    textAlign: "center",
    opacity: 0.9,
    marginBottom: 32,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 24,
    marginTop: 24,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.white,
    opacity: 0.8,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 16,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: theme.white,
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
    color: theme.primary,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SuccessScreen;
