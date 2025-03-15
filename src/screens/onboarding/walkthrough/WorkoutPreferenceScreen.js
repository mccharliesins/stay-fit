import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
  PanResponder,
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

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SWIPE_THRESHOLD = width * 0.25;

const activityLevels = [
  {
    id: "beginner",
    title: "Couch Potato",
    icon: "sofa",
    description: "Just starting my fitness journey",
  },
  {
    id: "intermediate",
    title: "Walks Sometimes",
    icon: "walk",
    description: "Occasionally active but not regularly",
  },
  {
    id: "advanced",
    title: "Gym Rat",
    icon: "weight-lifter",
    description: "Regular workout enthusiast",
  },
];

const workoutStyles = [
  {
    id: "gym",
    title: "Gym Workouts",
    icon: "dumbbell",
    description: "Train with professional equipment",
  },
  {
    id: "home",
    title: "Home Workouts",
    icon: "home",
    description: "Exercise in your comfort zone",
  },
  {
    id: "outdoor",
    title: "Outdoor Training",
    icon: "run",
    description: "Get fit in the fresh air",
  },
];

const WorkoutPreferenceScreen = ({ navigation, route }) => {
  const { inviteCode, fitnessGoal, userDetails } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWorkoutStyle, setSelectedWorkoutStyle] = useState(null);
  const [activityLevel, setActivityLevel] = useState(null);
  const position = new Animated.ValueXY();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      position.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else {
        resetPosition();
      }
    },
  });

  const forceSwipe = (direction) => {
    const x = direction === "right" ? width : -width;
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => onSwipeComplete(direction));
  };

  const onSwipeComplete = (direction) => {
    const item = activityLevels[currentIndex];
    setActivityLevel(item.id);
    position.setValue({ x: 0, y: 0 });
    setCurrentIndex(currentIndex + 1);
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start();
  };

  const getCardStyle = () => {
    const rotate = position.x.interpolate({
      inputRange: [-width * 1.5, 0, width * 1.5],
      outputRange: ["-30deg", "0deg", "30deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  };

  const handleNext = () => {
    if (activityLevel && selectedWorkoutStyle) {
      navigation.navigate("DailyReminder", {
        inviteCode,
        fitnessGoal,
        userDetails,
        preferences: {
          activityLevel,
          workoutStyle: selectedWorkoutStyle,
        },
      });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const renderCard = () => {
    if (currentIndex >= activityLevels.length) {
      return null;
    }

    const item = activityLevels[currentIndex];
    return (
      <Animated.View
        style={[styles.card, getCardStyle()]}
        {...panResponder.panHandlers}
      >
        <MaterialCommunityIcons
          name={item.icon}
          size={64}
          color={theme.primary}
        />
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "60%" }]} />
        </View>
        <Text style={styles.progressText}>Step 3 of 5</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Workout Preferences</Text>
        <Text style={styles.subtitle}>Swipe to select your activity level</Text>

        <View style={styles.cardContainer}>{renderCard()}</View>

        <View style={styles.workoutStylesContainer}>
          <Text style={styles.sectionTitle}>Choose Your Workout Style</Text>
          <View style={styles.workoutGrid}>
            {workoutStyles.map((style) => (
              <TouchableOpacity
                key={style.id}
                style={[
                  styles.workoutCard,
                  selectedWorkoutStyle === style.id &&
                    styles.workoutCardSelected,
                ]}
                onPress={() => setSelectedWorkoutStyle(style.id)}
              >
                <MaterialCommunityIcons
                  name={style.icon}
                  size={32}
                  color={
                    selectedWorkoutStyle === style.id ? theme.white : theme.text
                  }
                />
                <Text
                  style={[
                    styles.workoutTitle,
                    selectedWorkoutStyle === style.id &&
                      styles.workoutTitleSelected,
                  ]}
                >
                  {style.title}
                </Text>
                <Text
                  style={[
                    styles.workoutDescription,
                    selectedWorkoutStyle === style.id &&
                      styles.workoutDescriptionSelected,
                  ]}
                >
                  {style.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            (!activityLevel || !selectedWorkoutStyle) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!activityLevel || !selectedWorkoutStyle}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  progressContainer: {
    padding: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: theme.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  content: {
    flex: 1,
    padding: 24,
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
    marginBottom: 32,
  },
  cardContainer: {
    height: 250,
    alignItems: "center",
    marginBottom: 32,
  },
  card: {
    position: "absolute",
    width: CARD_WIDTH,
    height: 200,
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginTop: 16,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
  },
  workoutStylesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 16,
  },
  workoutGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  workoutCard: {
    width: "48%",
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.background,
  },
  workoutCardSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  workoutTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginTop: 8,
    marginBottom: 4,
    textAlign: "center",
  },
  workoutTitleSelected: {
    color: theme.white,
  },
  workoutDescription: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "center",
  },
  workoutDescriptionSelected: {
    color: theme.white,
  },
  footer: {
    padding: 24,
  },
  button: {
    backgroundColor: theme.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default WorkoutPreferenceScreen;
