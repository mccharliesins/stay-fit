import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Platform,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const timeSlots = [
  { id: "morning", label: "Morning", icon: "weather-sunny", time: "08:00" },
  {
    id: "afternoon",
    label: "Afternoon",
    icon: "weather-partly-sunny",
    time: "14:00",
  },
  { id: "evening", label: "Evening", icon: "weather-night", time: "19:00" },
];

const DailyReminderScreen = ({ navigation, route }) => {
  const { inviteCode, fitnessGoal, userDetails, preferences } = route.params;
  const [selectedTime, setSelectedTime] = useState(timeSlots[0]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [customTime, setCustomTime] = useState(new Date());
  const [trackProgress, setTrackProgress] = useState(true);
  const [trackWeight, setTrackWeight] = useState(true);
  const [trackPhotos, setTrackPhotos] = useState(true);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setCustomTime(selectedDate);
      setSelectedTime({
        id: "custom",
        label: "Custom",
        icon: "clock-outline",
        time: selectedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    }
  };

  const handleNext = () => {
    navigation.navigate("ProfileVisibility", {
      inviteCode,
      fitnessGoal,
      userDetails,
      preferences,
      reminders: {
        time: selectedTime,
        trackProgress,
        trackWeight,
        trackPhotos,
      },
    });
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "80%" }]} />
        </View>
        <Text style={styles.progressText}>Step 4 of 5</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Daily Reminders</Text>
        <Text style={styles.subtitle}>Set your preferred workout time</Text>

        <View style={styles.timeContainer}>
          {timeSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeCard,
                selectedTime.id === slot.id && styles.timeCardSelected,
              ]}
              onPress={() => setSelectedTime(slot)}
            >
              <MaterialCommunityIcons
                name={slot.icon}
                size={32}
                color={selectedTime.id === slot.id ? theme.white : theme.text}
              />
              <Text
                style={[
                  styles.timeLabel,
                  selectedTime.id === slot.id && styles.timeLabelSelected,
                ]}
              >
                {slot.label}
              </Text>
              <Text
                style={[
                  styles.timeValue,
                  selectedTime.id === slot.id && styles.timeValueSelected,
                ]}
              >
                {slot.time}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.customTimeButton}
          onPress={() => setShowTimePicker(true)}
        >
          <MaterialCommunityIcons
            name="clock-edit-outline"
            size={24}
            color={theme.primary}
          />
          <Text style={styles.customTimeText}>Set Custom Time</Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            value={customTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.trackingContainer}>
          <Text style={styles.sectionTitle}>Progress Tracking</Text>

          <View style={styles.trackingOption}>
            <View style={styles.trackingInfo}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.text}
              />
              <Text style={styles.trackingLabel}>Track Daily Progress</Text>
            </View>
            <Switch
              value={trackProgress}
              onValueChange={setTrackProgress}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          <View style={styles.trackingOption}>
            <View style={styles.trackingInfo}>
              <MaterialCommunityIcons
                name="scale-bathroom"
                size={24}
                color={theme.text}
              />
              <Text style={styles.trackingLabel}>Track Weight</Text>
            </View>
            <Switch
              value={trackWeight}
              onValueChange={setTrackWeight}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          <View style={styles.trackingOption}>
            <View style={styles.trackingInfo}>
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={theme.text}
              />
              <Text style={styles.trackingLabel}>Track Progress Photos</Text>
            </View>
            <Switch
              value={trackPhotos}
              onValueChange={setTrackPhotos}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
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
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  timeCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: theme.white,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.background,
  },
  timeCardSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  timeLabel: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginTop: 8,
  },
  timeLabelSelected: {
    color: theme.white,
  },
  timeValue: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    marginTop: 4,
  },
  timeValueSelected: {
    color: theme.white,
  },
  customTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginBottom: 32,
  },
  customTimeText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.primary,
    marginLeft: 8,
  },
  trackingContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 16,
  },
  trackingOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  trackingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackingLabel: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.text,
    marginLeft: 12,
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
  buttonText: {
    color: theme.white,
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
  },
});

export default DailyReminderScreen;
