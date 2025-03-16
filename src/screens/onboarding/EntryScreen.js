import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  StatusBar,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";
import AuthModal from "../../components/auth/AuthModal";

const EntryScreen = ({ navigation }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigation.replace("Home");
  };

  const renderButton = (text, onPress, isPrimary = false) => (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: isPrimary ? theme.primary : "transparent",
          borderWidth: isPrimary ? 0 : 2,
          borderColor: theme.primary,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          { color: isPrimary ? "white" : theme.primary },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={require("../../../assets/images/welcome-bg.jpg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={[styles.overlay, { paddingTop: insets.top }]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>StayFit</Text>
              <Text style={styles.subtitle}>
                Your Personal Fitness Journey Starts Here
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              {renderButton("Join with Invite Code", () =>
                navigation.navigate("InviteCode")
              )}
              {renderButton("Join Waitlist", () =>
                navigation.navigate("Waitlist")
              )}
              {renderButton("Already a user? Sign in", () =>
                setShowAuthModal(true)
              )}
            </View>

            <Text style={styles.footer}>
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </Text>
          </View>
        </View>
      </ImageBackground>

      <AuthModal
        isVisible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  header: {
    marginTop: "20%",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  subtitle: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
    fontFamily: "Poppins_400Regular",
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  footer: {
    color: "white",
    textAlign: "center",
    opacity: 0.7,
    marginTop: 24,
    fontFamily: "Poppins_400Regular",
  },
});

export default EntryScreen;
