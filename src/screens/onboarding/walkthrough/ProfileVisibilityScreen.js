import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../../constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Mock data for suggested profiles
const suggestedProfiles = [
  {
    id: 1,
    name: "Sarah Wilson",
    username: "@sarahfitness",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    followers: "15.2K",
  },
  {
    id: 2,
    name: "Mike Johnson",
    username: "@mikefitcoach",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    followers: "8.7K",
  },
  {
    id: 3,
    name: "Emma Davis",
    username: "@emmawellness",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    followers: "12.4K",
  },
];

const ProfileVisibilityScreen = ({ navigation, route }) => {
  const { inviteCode, fitnessGoal, userDetails, preferences, reminders } =
    route.params;
  const [isPublic, setIsPublic] = useState(true);
  const [showWorkouts, setShowWorkouts] = useState(true);
  const [showProgress, setShowProgress] = useState(true);
  const [selectedProfiles, setSelectedProfiles] = useState([]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const toggleProfile = (profileId) => {
    if (selectedProfiles.includes(profileId)) {
      setSelectedProfiles(selectedProfiles.filter((id) => id !== profileId));
    } else {
      setSelectedProfiles([...selectedProfiles, profileId]);
    }
  };

  const handleNext = () => {
    navigation.navigate("Subscription", {
      inviteCode,
      fitnessGoal,
      userDetails,
      preferences,
      reminders,
      privacy: {
        isPublic,
        showWorkouts,
        showProgress,
        following: selectedProfiles,
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
          <View style={[styles.progress, { width: "90%" }]} />
        </View>
        <Text style={styles.progressText}>Step 5 of 5</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Profile Settings</Text>
        <Text style={styles.subtitle}>Customize your privacy preferences</Text>

        <View style={styles.settingsContainer}>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons
                name="earth"
                size={24}
                color={theme.text}
              />
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Public Profile</Text>
                <Text style={styles.settingDescription}>
                  Allow others to discover your profile
                </Text>
              </View>
            </View>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons
                name="dumbbell"
                size={24}
                color={theme.text}
              />
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Show Workouts</Text>
                <Text style={styles.settingDescription}>
                  Share your workout routines
                </Text>
              </View>
            </View>
            <Switch
              value={showWorkouts}
              onValueChange={setShowWorkouts}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.text}
              />
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Show Progress</Text>
                <Text style={styles.settingDescription}>
                  Share your fitness journey
                </Text>
              </View>
            </View>
            <Switch
              value={showProgress}
              onValueChange={setShowProgress}
              trackColor={{ false: theme.background, true: theme.primary }}
              thumbColor={theme.white}
            />
          </View>
        </View>

        <View style={styles.socialContainer}>
          <Text style={styles.sectionTitle}>Suggested Profiles</Text>
          <Text style={styles.sectionDescription}>
            Follow fitness enthusiasts to stay motivated
          </Text>

          {suggestedProfiles.map((profile) => (
            <TouchableOpacity
              key={profile.id}
              style={styles.profileCard}
              onPress={() => toggleProfile(profile.id)}
            >
              <View style={styles.profileInfo}>
                <Image source={{ uri: profile.avatar }} style={styles.avatar} />
                <View style={styles.profileTexts}>
                  <Text style={styles.profileName}>{profile.name}</Text>
                  <Text style={styles.profileUsername}>{profile.username}</Text>
                  <Text style={styles.profileFollowers}>
                    {profile.followers} followers
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  selectedProfiles.includes(profile.id) &&
                    styles.followingButton,
                ]}
                onPress={() => toggleProfile(profile.id)}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    selectedProfiles.includes(profile.id) &&
                      styles.followingButtonText,
                  ]}
                >
                  {selectedProfiles.includes(profile.id)
                    ? "Following"
                    : "Follow"}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
  settingsContainer: {
    marginBottom: 32,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingTexts: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  socialContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    marginBottom: 16,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileTexts: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: theme.text,
  },
  profileUsername: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
  },
  profileFollowers: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: theme.secondary,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.primary,
  },
  followingButton: {
    backgroundColor: theme.background,
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    color: theme.white,
  },
  followingButtonText: {
    color: theme.primary,
  },
  footer: {
    padding: 24,
    backgroundColor: theme.background,
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

export default ProfileVisibilityScreen;
