import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomStatusBar from "../../../components/CustomStatusBar";

const { height } = Dimensions.get("window");

const goals = [
  {
    id: "muscle",
    title: "Build Muscle",
    icon: "weight-lifter",
    description: "Gain strength and muscle mass",
  },
  {
    id: "weight",
    title: "Lose Weight",
    icon: "run",
    description: "Burn fat and get lean",
  },
  {
    id: "endurance",
    title: "Improve Endurance",
    icon: "lightning-bolt",
    description: "Boost stamina and energy",
  },
];

const FitnessGoalScreen = ({ navigation, route }) => {
  const { inviteCode } = route.params;
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [cardScales] = useState(goals.map(() => new Animated.Value(1)));

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleCardPress = (index, goalId) => {
    setSelectedGoal(goalId);

    // Animate unselected cards
    goals.forEach((_, i) => {
      Animated.spring(cardScales[i], {
        toValue: i === index ? 1.05 : 0.95,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (selectedGoal) {
      navigation.navigate("BasicDetails", {
        inviteCode,
        fitnessGoal: selectedGoal,
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
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: "20%" }]} />
          </View>
          <Text style={styles.progressText}>Step 1 of 5</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>What's your fitness goal?</Text>
          <Text style={styles.subtitle}>Choose your primary focus</Text>

          <View style={styles.cardsContainer}>
            {goals.map((goal, index) => (
              <Animated.View
                key={goal.id}
                style={[
                  styles.card,
                  {
                    transform: [{ scale: cardScales[index] }],
                    borderColor:
                      selectedGoal === goal.id ? theme.primary : "transparent",
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() => handleCardPress(index, goal.id)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={goal.icon}
                    size={40}
                    color={
                      selectedGoal === goal.id ? theme.primary : theme.text
                    }
                  />
                  <Text style={styles.cardTitle}>{goal.title}</Text>
                  <Text style={styles.cardDescription}>{goal.description}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedGoal && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!selectedGoal}
        >
          <Text style={styles.buttonText}>Let's Go</Text>
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
  scrollContent: {
    flexGrow: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  content: {
    padding: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins_700Bold",
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    marginBottom: 24,
  },
  cardsContainer: {
    marginTop: 8,
  },
  card: {
    backgroundColor: theme.white,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    alignItems: "center",
    padding: height < 700 ? 16 : 20,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginTop: 12,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
  },
  footer: {
    padding: 20,
    paddingBottom: height < 700 ? 16 : 20,
    backgroundColor: theme.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
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
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: theme.secondary,
    opacity: 0.5,
  },
  buttonText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default FitnessGoalScreen;
