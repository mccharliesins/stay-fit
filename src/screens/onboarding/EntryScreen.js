import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { theme } from "../../constants/theme";
import SignInModal from "../../components/SignInModal";

const { width } = Dimensions.get("window");

const EntryScreen = ({ navigation }) => {
  const [showSignInModal, setShowSignInModal] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleSignInSuccess = () => {
    setShowSignInModal(false);
    // Navigate to main app or handle successful sign in
  };

  const renderButton = (text, onPress, style, textStyle) => (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ImageBackground
        source={require("../../../assets/background.jpg")}
        style={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <Text style={styles.logo}>SF</Text>
            <Text style={styles.title}>Welcome to StayFit</Text>
            <Text style={styles.subtitle}>
              Your exclusive fitness companion awaits
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            {renderButton(
              "Already a User? Sign In",
              () => setShowSignInModal(true),
              styles.signInButton,
              styles.signInButtonText
            )}

            {renderButton(
              "Got an Invite Code? Join Now",
              () => navigation.navigate("InviteCode"),
              styles.inviteButton,
              styles.inviteButtonText
            )}

            {renderButton(
              "No Invite? Join the Waitlist",
              () => navigation.navigate("Waitlist"),
              styles.waitlistButton,
              styles.waitlistButtonText
            )}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Join the exclusive community of fitness enthusiasts
            </Text>
          </View>
        </View>
      </ImageBackground>

      <SignInModal
        visible={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSuccess={handleSignInSuccess}
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
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingTop: 48,
    justifyContent: "space-between",
  },
  header: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  logo: {
    fontSize: 48,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: "Poppins_700Bold",
    color: theme.white,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: theme.white,
    opacity: 0.9,
    textAlign: "center",
  },
  buttonContainer: {
    padding: 24,
    gap: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  signInButton: {
    backgroundColor: theme.white,
  },
  signInButtonText: {
    color: theme.primary,
  },
  inviteButton: {
    backgroundColor: theme.primary,
  },
  inviteButtonText: {
    color: theme.white,
  },
  waitlistButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: theme.white,
  },
  waitlistButtonText: {
    color: theme.white,
  },
  footer: {
    padding: 24,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: theme.white,
    opacity: 0.8,
    textAlign: "center",
  },
});

export default EntryScreen;
