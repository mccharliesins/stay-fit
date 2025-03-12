import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";

// Sample workout data
const workoutData = [
  { id: "1", name: "Full Body Workout", duration: "45 min", level: "Beginner" },
  {
    id: "2",
    name: "Upper Body Focus",
    duration: "30 min",
    level: "Intermediate",
  },
  {
    id: "3",
    name: "Lower Body Strength",
    duration: "40 min",
    level: "Intermediate",
  },
  { id: "4", name: "Core Crusher", duration: "25 min", level: "Advanced" },
  { id: "5", name: "Cardio Blast", duration: "35 min", level: "All Levels" },
];

const WorkoutItem = ({ item, onPress }) => (
  <TouchableOpacity style={styles.workoutItem} onPress={onPress}>
    <View style={styles.workoutInfo}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutDuration}>{item.duration}</Text>
        <Text style={styles.workoutLevel}>{item.level}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const WorkoutsScreen = ({ navigation }) => {
  const handleWorkoutPress = (workout) => {
    // Navigate to workout details (to be implemented)
    console.log(`Selected workout: ${workout.name}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Workouts</Text>
      </View>

      <FlatList
        data={workoutData}
        renderItem={({ item }) => (
          <WorkoutItem item={item} onPress={() => handleWorkoutPress(item)} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => console.log("Add new workout")}
      >
        <Text style={styles.addButtonText}>+ Add New Workout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#4CAF50",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  workoutItem: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  workoutDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  workoutDuration: {
    fontSize: 14,
    color: "#666",
  },
  workoutLevel: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "500",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 16,
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WorkoutsScreen;
