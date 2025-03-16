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

// Create separate stacks for better organization
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const WalkthroughStack = createNativeStackNavigator();

const MainNavigator = () => (
  <MainStack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#f5f5f5" },
    }}
  >
    <MainStack.Screen name="Home" component={HomeScreen} />
    <MainStack.Screen name="Workouts" component={WorkoutsScreen} />
    <MainStack.Screen name="Profile" component={ProfileScreen} />
  </MainStack.Navigator>
);

const WalkthroughNavigator = () => (
  <WalkthroughStack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: "#f5f5f5" },
      gestureEnabled: false,
    }}
  >
    <WalkthroughStack.Screen name="Welcome" component={WelcomeScreen} />
    <WalkthroughStack.Screen name="FitnessGoal" component={FitnessGoalScreen} />
    <WalkthroughStack.Screen
      name="BasicDetails"
      component={BasicDetailsScreen}
    />
    <WalkthroughStack.Screen
      name="WorkoutPreference"
      component={WorkoutPreferenceScreen}
    />
    <WalkthroughStack.Screen
      name="DailyReminder"
      component={DailyReminderScreen}
    />
    <WalkthroughStack.Screen
      name="ProfileVisibility"
      component={ProfileVisibilityScreen}
    />
    <WalkthroughStack.Screen
      name="Subscription"
      component={SubscriptionScreen}
    />
    <WalkthroughStack.Screen name="Success" component={SuccessScreen} />
  </WalkthroughStack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useAuth();

  // Show a loading screen while checking authentication
  if (loading) {
    return null; // You could replace this with a loading spinner
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#f5f5f5" },
        }}
      >
        {user ? (
          // Check if user has completed onboarding
          user.onboarding_completed ? (
            <Stack.Screen name="MainApp" component={MainNavigator} />
          ) : (
            <Stack.Screen name="Walkthrough" component={WalkthroughNavigator} />
          )
        ) : (
          // Entry and auth screens
          <>
            <Stack.Screen name="Entry" component={EntryScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="InviteCode" component={InviteCodeScreen} />
            <Stack.Screen name="Waitlist" component={WaitlistScreen} />
            <Stack.Screen name="Walkthrough" component={WalkthroughNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
