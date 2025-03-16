import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../hooks/useAuth";

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
import WalkthroughScreen from "../screens/onboarding/walkthrough/WalkthroughScreen";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        {user ? (
          // Authenticated stack
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Workouts" component={WorkoutsScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Group>
        ) : (
          // Public stack
          <Stack.Group>
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
            <Stack.Screen name="Waitlist" component={WaitlistScreen} />
            <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
