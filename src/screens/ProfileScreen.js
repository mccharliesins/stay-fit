import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useAuth } from "../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../services/databaseService";
import { uploadFile } from "../services/storageService";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const { user, signOut } = useAuth();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await getUserProfile(user.id);

      if (error) {
        console.error("Error loading profile:", error.message);
        return;
      }

      if (data) {
        setName(data.name || "");
        setAge(data.age ? data.age.toString() : "");
        setWeight(data.weight ? data.weight.toString() : "");
        setHeight(data.height ? data.height.toString() : "");
        setGoal(data.goal || "");
        setProfileImage(data.profile_image || null);
      }
    } catch (error) {
      console.error("Error loading profile:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const updates = {
        name,
        age: age ? parseInt(age, 10) : null,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        goal,
        updated_at: new Date().toISOString(),
      };

      const { error } = await updateUserProfile(user.id, updates);

      if (error) {
        Alert.alert("Error", "Failed to update profile: " + error.message);
        return;
      }

      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to update profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "You need to grant permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setIsSaving(true);

      try {
        const uri = result.assets[0].uri;
        const fileExt = uri.split(".").pop();
        const fileName = `${user.id}-profile.${fileExt}`;
        const filePath = `profiles/${fileName}`;

        // Upload to Supabase Storage
        const { data, error } = await uploadFile(
          "profile-images",
          filePath,
          uri
        );

        if (error) {
          throw error;
        }

        // Update profile with image URL
        const { error: updateError } = await updateUserProfile(user.id, {
          profile_image: data.publicUrl,
          updated_at: new Date().toISOString(),
        });

        if (updateError) {
          throw updateError;
        }

        setProfileImage(data.publicUrl);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image: " + error.message);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert("Error", "Failed to sign out: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={isEditing ? handlePickImage : null}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>{name.charAt(0)}</Text>
            </View>
          )}
          {isEditing && (
            <View style={styles.editImageOverlay}>
              <Text style={styles.editImageText}>Change Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          {isEditing ? (
            <>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.label}>Height (cm)</Text>
                  <TextInput
                    style={styles.input}
                    value={height}
                    onChangeText={setHeight}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Fitness Goal</Text>
                <TextInput
                  style={[styles.input, { height: 80 }]}
                  value={goal}
                  onChangeText={setGoal}
                  multiline
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Profile</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{name || "Not set"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Age:</Text>
                <Text style={styles.infoValue}>
                  {age ? `${age} years` : "Not set"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>
                  {weight ? `${weight} kg` : "Not set"}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Height:</Text>
                <Text style={styles.infoValue}>
                  {height ? `${height} cm` : "Not set"}
                </Text>
              </View>

              {weight && height ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>BMI:</Text>
                  <Text style={styles.infoValue}>
                    {(
                      parseFloat(weight) /
                      ((parseFloat(height) / 100) * (parseFloat(height) / 100))
                    ).toFixed(1)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.goalContainer}>
                <Text style={styles.goalLabel}>Fitness Goal:</Text>
                <Text style={styles.goalText}>{goal || "Not set"}</Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  signOutButton: {
    padding: 8,
  },
  signOutText: {
    color: "white",
    fontWeight: "600",
  },
  content: {
    padding: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginVertical: 20,
    position: "relative",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitial: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  editImageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 4,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  editImageText: {
    color: "white",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
  },
  infoContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  goalContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  goalText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  label: {
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
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
