import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Animated,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const features = [
  {
    id: "workouts",
    title: "Personalized Workouts",
    description: "AI-powered routines tailored to your goals",
    icon: "dumbbell",
  },
  {
    id: "analytics",
    title: "Advanced Analytics",
    description: "Detailed insights into your progress",
    icon: "chart-areaspline",
  },
  {
    id: "nutrition",
    title: "Nutrition Planning",
    description: "Custom meal plans and recipes",
    icon: "food-apple",
  },
  {
    id: "coach",
    title: "Virtual Coach",
    description: "24/7 AI coaching and form feedback",
    icon: "account-tie",
  },
];

const SubscriptionScreen = ({ navigation, route }) => {
  const {
    inviteCode,
    fitnessGoal,
    userDetails,
    preferences,
    reminders,
    privacy,
  } = route.params;
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [featureScales] = useState(features.map(() => new Animated.Value(0)));

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    // Animate features appearing one by one
    features.forEach((_, index) => {
      Animated.spring(featureScales[index], {
        toValue: 1,
        tension: 100,
        friction: 8,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleSkip = () => {
    navigation.navigate("Success", {
      inviteCode,
      fitnessGoal,
      userDetails,
      preferences,
      reminders,
      privacy,
      subscription: null,
    });
  };

  const handleSubscribe = () => {
    navigation.navigate("Success", {
      inviteCode,
      fitnessGoal,
      userDetails,
      preferences,
      reminders,
      privacy,
      subscription: {
        plan: selectedPlan,
        startDate: new Date(),
      },
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <LottieView
            source={require("../../../../assets/animations/premium.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>Unlock Premium Features</Text>
          <Text style={styles.subtitle}>Start your 7-day free trial today</Text>
        </View>

        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureCard,
                {
                  transform: [{ scale: featureScales[index] }],
                },
              ]}
            >
              <MaterialCommunityIcons
                name={feature.icon}
                size={32}
                color={theme.primary}
              />
              <View style={styles.featureTexts}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>
                  {feature.description}
                </Text>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.plansContainer}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "monthly" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("monthly")}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Monthly Plan</Text>
              <Text style={styles.planPrice}>$14.99/month</Text>
            </View>
            <MaterialCommunityIcons
              name={
                selectedPlan === "monthly" ? "check-circle" : "circle-outline"
              }
              size={24}
              color={
                selectedPlan === "monthly" ? theme.primary : theme.secondary
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planCard,
              selectedPlan === "annual" && styles.planCardSelected,
            ]}
            onPress={() => setSelectedPlan("annual")}
          >
            <View style={styles.planInfo}>
              <Text style={styles.planTitle}>Annual Plan</Text>
              <Text style={styles.planPrice}>$149.99/year</Text>
              <Text style={styles.planSaving}>Save 17%</Text>
            </View>
            <MaterialCommunityIcons
              name={
                selectedPlan === "annual" ? "check-circle" : "circle-outline"
              }
              size={24}
              color={
                selectedPlan === "annual" ? theme.primary : theme.secondary
              }
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.guarantee}>
          7-day free trial • Cancel anytime • Money-back guarantee
        </Text>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.subscribeButton}
          onPress={handleSubscribe}
        >
          <Text style={styles.subscribeButtonText}>Start Free Trial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip for Now</Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    alignItems: "center",
    padding: 24,
  },
  animation: {
    width: 200,
    height: 200,
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
  featuresContainer: {
    padding: 24,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featureTexts: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  plansContainer: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 16,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: theme.background,
  },
  planCardSelected: {
    borderColor: theme.primary,
  },
  planInfo: {
    flex: 1,
  },
  planTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 4,
  },
  planPrice: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: theme.primary,
  },
  planSaving: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: "#4CAF50",
    marginTop: 4,
  },
  guarantee: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  footer: {
    padding: 24,
    backgroundColor: theme.background,
  },
  subscribeButton: {
    backgroundColor: theme.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  subscribeButtonText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
  skipButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
    color: theme.secondary,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default SubscriptionScreen;
