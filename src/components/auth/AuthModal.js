import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { supabase } from "../../lib/supabase";
import { MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../hooks/useTheme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AuthModal = ({ isVisible, onClose, onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("signin"); // signin, forgot, check-email
  const bottomSheetModalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      bottomSheetModalRef.current?.dismiss();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onSuccess();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Successfully signed in!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter your email",
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "stayfit://reset-password",
      });

      if (error) throw error;

      setMode("check-email");
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Password reset link sent to your email!",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderSignInContent = () => (
    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      <Text style={[styles.title, { color: theme.text }]}>Welcome Back!</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Sign in to continue your fitness journey
      </Text>

      <View style={styles.form}>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <MaterialIcons name="email" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <MaterialIcons name="lock" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => setMode("forgot")}
        >
          <Text style={[styles.forgotText, { color: theme.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderForgotContent = () => (
    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Enter your email to receive a password reset link
      </Text>

      <View style={styles.form}>
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <MaterialIcons name="email" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={handleForgotPassword}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Link</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => setMode("signin")}
        >
          <Text style={[styles.forgotText, { color: theme.primary }]}>
            Back to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderCheckEmailContent = () => (
    <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
      <MaterialIcons
        name="mail"
        size={64}
        color={theme.primary}
        style={styles.emailIcon}
      />
      <Text style={[styles.title, { color: theme.text }]}>
        Check Your Email
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.textSecondary, textAlign: "center" },
        ]}
      >
        We've sent a password reset link to:
        {"\n"}
        {email}
      </Text>

      <View style={styles.form}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={() => setMode("signin")}
        >
          <Text style={styles.buttonText}>Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      snapPoints={["75%"]}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
        />
      )}
      handleIndicatorStyle={{ backgroundColor: theme.textSecondary }}
      backgroundStyle={{ backgroundColor: theme.background }}
      onDismiss={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {mode === "signin" && renderSignInContent()}
        {mode === "forgot" && renderForgotContent()}
        {mode === "check-email" && renderCheckEmailContent()}
      </KeyboardAvoidingView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  forgotButton: {
    alignItems: "center",
    paddingVertical: 8,
  },
  forgotText: {
    fontSize: 16,
    fontWeight: "600",
  },
  emailIcon: {
    alignSelf: "center",
    marginBottom: 24,
  },
});

export default AuthModal;
