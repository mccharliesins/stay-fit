import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens
import HomeScreen from "../screens/HomeScreen";
import WorkoutsScreen from "../screens/WorkoutsScreen";
import ProfileScreen from "../screens/ProfileScreen";

// Import auth screens
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

// Import onboarding screens
import EntryScreen from "../screens/onboarding/EntryScreen";
import InviteCodeScreen from "../screens/onboarding/InviteCodeScreen";
import WaitlistScreen from "../screens/onboarding/WaitlistScreen";

// Import walkthrough screens
import WelcomeScreen from "../screens/onboarding/walkthrough/WelcomeScreen";
import FitnessGoalScreen from "../screens/onboarding/walkthrough/FitnessGoalScreen";
import BasicDetailsScreen from "../screens/onboarding/walkthrough/BasicDetailsScreen";
import WorkoutPreferenceScreen from "../screens/onboarding/walkthrough/WorkoutPreferenceScreen";
import DailyReminderScreen from "../screens/onboarding/walkthrough/DailyReminderScreen";
import ProfileVisibilityScreen from "../screens/onboarding/walkthrough/ProfileVisibilityScreen";
import SubscriptionScreen from "../screens/onboarding/walkthrough/SubscriptionScreen";
import SuccessScreen from "../screens/onboarding/walkthrough/SuccessScreen";

// Import auth context
import { useAuth } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Show a loading screen while checking authentication
  if (loading) {
    return null; // You could replace this with a loading spinner
  }

  return (
    <NavigationContainer>
      {user ? (
        // Check if user has completed onboarding
        user.onboarding_completed ? (
          // Main app screens
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#f5f5f5" },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Workouts" component={WorkoutsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Navigator>
        ) : (
          // Onboarding walkthrough screens
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#f5f5f5" },
              gestureEnabled: false, // Prevent back swipe during onboarding
            }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
            <Stack.Screen name="BasicDetails" component={BasicDetailsScreen} />
            <Stack.Screen
              name="WorkoutPreference"
              component={WorkoutPreferenceScreen}
            />
            <Stack.Screen
              name="DailyReminder"
              component={DailyReminderScreen}
            />
            <Stack.Screen
              name="ProfileVisibility"
              component={ProfileVisibilityScreen}
            />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />
            <Stack.Screen name="Success" component={SuccessScreen} />
          </Stack.Navigator>
        )
      ) : (
        // Entry and auth screens
        <Stack.Navigator
          initialRouteName="Entry"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#f5f5f5" },
          }}
        >
          <Stack.Screen name="Entry" component={EntryScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
          <Stack.Screen name="Waitlist" component={WaitlistScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
