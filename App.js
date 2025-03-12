import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
} from "react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import "react-native-url-polyfill/auto";
import {
  checkNetworkConnection,
  logDeviceInfo,
} from "./src/utils/networkCheck";
import { SUPABASE_URL } from "@env";
import { checkDatabaseSetup } from "./src/services/databaseService";
import { checkStorageBuckets } from "./src/services/storageService";

export default function App() {
  const [isNetworkChecking, setIsNetworkChecking] = useState(true);
  const [networkStatus, setNetworkStatus] = useState(null);
  const [databaseStatus, setDatabaseStatus] = useState(null);
  const [storageStatus, setStorageStatus] = useState(null);
  const [isCheckingSetup, setIsCheckingSetup] = useState(false);
  const [bypassStorageCheck, setBypassStorageCheck] = useState(true); // TEMPORARY FIX: Bypass storage check

  const checkNetwork = async () => {
    try {
      setIsNetworkChecking(true);

      // Log device information
      logDeviceInfo();

      // Check connection to Supabase
      const supabaseUrl = SUPABASE_URL || "https://example.supabase.co";
      console.log("Using Supabase URL:", supabaseUrl);

      const result = await checkNetworkConnection(supabaseUrl);

      console.log("Network check completed:", result);
      setNetworkStatus(result);

      // If we got any response (even a 404), we're connected to the server
      return result.connected;
    } catch (error) {
      console.error("Error during network check:", error);
      setNetworkStatus({ connected: false, error: error.message });
      return false;
    } finally {
      setIsNetworkChecking(false);
    }
  };

  const checkSetup = async () => {
    try {
      setIsCheckingSetup(true);

      // Check database setup
      const dbStatus = await checkDatabaseSetup();
      setDatabaseStatus(dbStatus);

      // Check storage setup
      const storageStatus = await checkStorageBuckets();
      setStorageStatus(storageStatus);

      return (
        dbStatus.profilesExists &&
        dbStatus.workoutsExists &&
        (bypassStorageCheck ||
          (storageStatus.avatarsExists && storageStatus.workoutImagesExists))
      );
    } catch (error) {
      console.error("Error checking setup:", error);
      return false;
    } finally {
      setIsCheckingSetup(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const isConnected = await checkNetwork();

      if (isConnected) {
        await checkSetup();
      }
    };

    initialize();
  }, []);

  const handleRetry = () => {
    checkNetwork().then((isConnected) => {
      if (isConnected) {
        checkSetup();
      }
    });
  };

  const handleBypassStorage = () => {
    setBypassStorageCheck(true);
  };

  const openSupabaseDocs = () => {
    Linking.openURL("https://supabase.com/docs");
  };

  if (isNetworkChecking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Checking network connection...</Text>
      </View>
    );
  }

  if (networkStatus && !networkStatus.connected) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Network Connection Error</Text>
        <Text style={styles.text}>
          Unable to connect to the Supabase server. Please check your internet
          connection and try again.
        </Text>
        <Text style={styles.detailText}>
          Error:{" "}
          {networkStatus.error || `Server returned ${networkStatus.status}`}
        </Text>

        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry Connection</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCheckingSetup) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Checking database and storage setup...</Text>
      </View>
    );
  }

  // If database or storage is not set up properly
  if (
    !bypassStorageCheck &&
    databaseStatus &&
    storageStatus &&
    (!databaseStatus.profilesExists ||
      !databaseStatus.workoutsExists ||
      !storageStatus.avatarsExists ||
      !storageStatus.workoutImagesExists)
  ) {
    return (
      <ScrollView contentContainerStyle={styles.setupContainer}>
        <Text style={styles.errorText}>Database Setup Required</Text>
        <Text style={styles.text}>
          Your Supabase project is not set up correctly for this app. Please
          follow the setup instructions:
        </Text>

        <View style={styles.setupStatusContainer}>
          <Text style={styles.setupTitle}>Database Tables:</Text>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Profiles Table:</Text>
            <Text
              style={
                databaseStatus.profilesExists
                  ? styles.setupSuccess
                  : styles.setupError
              }
            >
              {databaseStatus.profilesExists ? "✓ Available" : "✗ Missing"}
            </Text>
          </View>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Workouts Table:</Text>
            <Text
              style={
                databaseStatus.workoutsExists
                  ? styles.setupSuccess
                  : styles.setupError
              }
            >
              {databaseStatus.workoutsExists ? "✓ Available" : "✗ Missing"}
            </Text>
          </View>

          <Text style={styles.setupTitle}>Storage Buckets:</Text>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Avatars Bucket:</Text>
            <Text
              style={
                storageStatus.avatarsExists
                  ? styles.setupSuccess
                  : styles.setupError
              }
            >
              {storageStatus.avatarsExists ? "✓ Available" : "✗ Missing"}
            </Text>
          </View>
          <View style={styles.setupItem}>
            <Text style={styles.setupLabel}>Workout Images Bucket:</Text>
            <Text
              style={
                storageStatus.workoutImagesExists
                  ? styles.setupSuccess
                  : styles.setupError
              }
            >
              {storageStatus.workoutImagesExists ? "✓ Available" : "✗ Missing"}
            </Text>
          </View>
        </View>

        <Text style={styles.setupInstructions}>
          1. Go to your Supabase dashboard
        </Text>
        <Text style={styles.setupInstructions}>
          2. Run the SQL script in the supabase/schema.sql file
        </Text>
        <Text style={styles.setupInstructions}>
          3. Create the required storage buckets (avatars, workout-images)
        </Text>
        <Text style={styles.setupInstructions}>
          4. Set up the appropriate bucket policies
        </Text>

        <TouchableOpacity style={styles.docsButton} onPress={openSupabaseDocs}>
          <Text style={styles.docsButtonText}>Open Supabase Docs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry Check</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bypassButton}
          onPress={handleBypassStorage}
        >
          <Text style={styles.bypassButtonText}>
            Continue Without Storage Setup
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  setupContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e53935",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 14,
    color: "#999",
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  bypassButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  bypassButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  setupStatusContainer: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 20,
  },
  setupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  setupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  setupLabel: {
    fontSize: 16,
    color: "#666",
  },
  setupSuccess: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  setupError: {
    fontSize: 16,
    color: "#e53935",
    fontWeight: "bold",
  },
  setupInstructions: {
    fontSize: 16,
    color: "#333",
    marginVertical: 5,
    textAlign: "left",
    alignSelf: "stretch",
  },
  docsButton: {
    backgroundColor: "#1E88E5",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  docsButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
