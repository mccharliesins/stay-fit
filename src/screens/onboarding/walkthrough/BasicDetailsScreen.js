import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Animated,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const genders = [
  { id: "male", icon: "gender-male", label: "Male" },
  { id: "female", icon: "gender-female", label: "Female" },
  { id: "other", icon: "gender-non-binary", label: "Other" },
];

const BasicDetailsScreen = ({ navigation, route }) => {
  const { inviteCode, fitnessGoal } = route.params;
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [gender, setGender] = useState(null);
  const [bmi, setBmi] = useState(0);
  const [bmiScale] = useState(new Animated.Value(0));

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Calculate BMI
    const heightInMeters = height / 100;
    const bmiValue = weight / (heightInMeters * heightInMeters);
    setBmi(bmiValue.toFixed(1));

    // Animate BMI update
    Animated.spring(bmiScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      bmiScale.setValue(0);
    });
  }, [weight, height]);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return { text: "Underweight", color: "#FFA726" };
    if (bmi < 25) return { text: "Normal", color: "#66BB6A" };
    if (bmi < 30) return { text: "Overweight", color: "#FFA726" };
    return { text: "Obese", color: "#EF5350" };
  };

  const handleNext = () => {
    if (gender) {
      navigation.navigate("WorkoutPreference", {
        inviteCode,
        fitnessGoal,
        userDetails: { weight, height, gender, bmi },
      });
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const bmiCategory = getBmiCategory(bmi);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "40%" }]} />
        </View>
        <Text style={styles.progressText}>Step 2 of 5</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Basic Details</Text>
        <Text style={styles.subtitle}>Help us personalize your experience</Text>

        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Weight (kg)</Text>
          <Slider
            style={styles.slider}
            minimumValue={30}
            maximumValue={200}
            value={weight}
            onValueChange={setWeight}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.background}
            thumbTintColor={theme.primary}
          />
          <Text style={styles.value}>{Math.round(weight)} kg</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Height (cm)</Text>
          <Slider
            style={styles.slider}
            minimumValue={120}
            maximumValue={220}
            value={height}
            onValueChange={setHeight}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.background}
            thumbTintColor={theme.primary}
          />
          <Text style={styles.value}>{Math.round(height)} cm</Text>
        </View>

        <View style={styles.bmiContainer}>
          <Animated.View
            style={[
              styles.bmiCard,
              {
                transform: [
                  {
                    scale: bmiScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.bmiTitle}>Your BMI</Text>
            <Text style={[styles.bmiValue, { color: bmiCategory.color }]}>
              {bmi}
            </Text>
            <Text style={[styles.bmiCategory, { color: bmiCategory.color }]}>
              {bmiCategory.text}
            </Text>
          </Animated.View>
        </View>

        <View style={styles.genderContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderOptions}>
            {genders.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.genderButton,
                  gender === item.id && styles.genderButtonSelected,
                ]}
                onPress={() => setGender(item.id)}
              >
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={gender === item.id ? theme.white : theme.text}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === item.id && styles.genderTextSelected,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !gender && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!gender}
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
  sliderContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  value: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    textAlign: "right",
  },
  bmiContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  bmiCard: {
    backgroundColor: theme.white,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bmiTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.secondary,
    marginBottom: 8,
  },
  bmiValue: {
    fontSize: 36,
    fontFamily: "Poppins_700Bold",
    marginBottom: 4,
  },
  bmiCategory: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  genderContainer: {
    marginBottom: 24,
  },
  genderOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  genderButton: {
    flex: 1,
    height: 80,
    backgroundColor: theme.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.background,
  },
  genderButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  genderText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginTop: 8,
  },
  genderTextSelected: {
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

export default BasicDetailsScreen;
