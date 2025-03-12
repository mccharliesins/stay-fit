import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import {
  getWorkouts,
  createWorkout,
  deleteWorkout,
} from "../services/databaseService";

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

const WorkoutItem = ({ item, onPress, onDelete }) => (
  <TouchableOpacity style={styles.workoutItem} onPress={onPress}>
    <View style={styles.workoutInfo}>
      <Text style={styles.workoutName}>{item.name}</Text>
      <View style={styles.workoutDetails}>
        <Text style={styles.workoutDuration}>{item.duration}</Text>
        <Text style={styles.workoutLevel}>{item.level}</Text>
      </View>
    </View>
    {onDelete && (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item)}
      >
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    )}
  </TouchableOpacity>
);

const WorkoutsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    duration: "",
    level: "Beginner",
  });

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await getWorkouts();

      if (error) {
        console.error("Error loading workouts:", error.message);
        return;
      }

      setWorkouts(data || []);
    } catch (error) {
      console.error("Error loading workouts:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkoutPress = (workout) => {
    // Navigate to workout details (to be implemented)
    console.log(`Selected workout: ${workout.name}`);
  };

  const handleAddWorkout = async () => {
    if (!newWorkout.name || !newWorkout.duration || !newWorkout.level) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const workoutData = {
        name: newWorkout.name,
        duration: newWorkout.duration,
        level: newWorkout.level,
        user_id: user.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await createWorkout(workoutData);

      if (error) {
        Alert.alert("Error", "Failed to create workout: " + error.message);
        return;
      }

      setWorkouts([...workouts, data[0]]);
      setModalVisible(false);
      setNewWorkout({
        name: "",
        duration: "",
        level: "Beginner",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to create workout: " + error.message);
    }
  };

  const handleDeleteWorkout = async (workout) => {
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workout.name}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const { error } = await deleteWorkout(workout.id);

              if (error) {
                Alert.alert(
                  "Error",
                  "Failed to delete workout: " + error.message
                );
                return;
              }

              setWorkouts(workouts.filter((w) => w.id !== workout.id));
            } catch (error) {
              Alert.alert(
                "Error",
                "Failed to delete workout: " + error.message
              );
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading workouts...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Workouts</Text>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No workouts found</Text>
          <Text style={styles.emptySubtext}>
            Add your first workout to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          renderItem={({ item }) => (
            <WorkoutItem
              item={item}
              onPress={() => handleWorkoutPress(item)}
              onDelete={handleDeleteWorkout}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add New Workout</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Workout</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Workout Name</Text>
              <TextInput
                style={styles.input}
                value={newWorkout.name}
                onChangeText={(text) =>
                  setNewWorkout({ ...newWorkout, name: text })
                }
                placeholder="e.g. Full Body Workout"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Duration</Text>
              <TextInput
                style={styles.input}
                value={newWorkout.duration}
                onChangeText={(text) =>
                  setNewWorkout({ ...newWorkout, duration: text })
                }
                placeholder="e.g. 45 min"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Level</Text>
              <View style={styles.levelButtons}>
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      newWorkout.level === level && styles.levelButtonActive,
                    ]}
                    onPress={() =>
                      setNewWorkout({ ...newWorkout, level: level })
                    }
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        newWorkout.level === level &&
                          styles.levelButtonTextActive,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleAddWorkout}
              >
                <Text style={styles.saveButtonText}>Add Workout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  deleteButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#f44336",
    fontWeight: "bold",
    fontSize: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  levelButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  levelButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    marginHorizontal: 2,
    borderRadius: 5,
  },
  levelButtonActive: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  levelButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  levelButtonTextActive: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default WorkoutsScreen;
