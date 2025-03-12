import React, { createContext, useState, useEffect, useContext } from "react";
import { Alert, Platform } from "react-native";
import supabase from "../utils/supabaseClient";

// Create the authentication context
const AuthContext = createContext({
  user: null,
  session: null,
  loading: true,
  networkError: null,
  signUp: async () => {},
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
});

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(null);

  useEffect(() => {
    // Check for active session on mount
    const getSession = async () => {
      try {
        console.log("Fetching session...");
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error.message);

          // Check if it's a network error
          if (
            error.message.includes("Network") ||
            error.message.includes("fetch")
          ) {
            setNetworkError(error.message);
          }

          return;
        }

        console.log(
          "Session retrieved:",
          session ? "Valid session" : "No session"
        );
        setSession(session);
        setUser(session?.user || null);
      } catch (error) {
        console.error("Exception getting session:", error.message);

        // Check if it's a network error
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          setNetworkError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Set up a subscription to changes in auth state
    let subscription;
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", _event);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });

      subscription = data.subscription;
    } catch (error) {
      console.error(
        "Error setting up auth state change listener:",
        error.message
      );
    }

    // Clean up subscription on unmount
    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe();
        } catch (error) {
          console.error(
            "Error unsubscribing from auth state changes:",
            error.message
          );
        }
      }
    };
  }, []);

  // Sign up function
  const signUp = async ({ email, password, ...userData }) => {
    try {
      setLoading(true);
      setNetworkError(null);

      console.log("Signing up user:", email);

      // Create the user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData, // Store additional user data in the metadata
        },
      });

      if (error) {
        console.error("Error signing up:", error.message);

        // Check if it's a network error
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          setNetworkError(error.message);

          // Show a more user-friendly error message
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }

        throw error;
      }

      console.log(
        "Sign up successful:",
        data.user ? "User created" : "No user data"
      );
      return { data, error: null };
    } catch (error) {
      console.error("Exception signing up:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async ({ email, password }) => {
    try {
      setLoading(true);
      setNetworkError(null);

      console.log("Signing in user:", email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error signing in:", error.message);

        // Check if it's a network error
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          setNetworkError(error.message);

          // Show a more user-friendly error message
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }

        throw error;
      }

      console.log(
        "Sign in successful:",
        data.user ? "User authenticated" : "No user data"
      );
      return { data, error: null };
    } catch (error) {
      console.error("Exception signing in:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);
      setNetworkError(null);

      console.log("Signing out user");

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error.message);

        // Check if it's a network error
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          setNetworkError(error.message);
        }

        throw error;
      }

      console.log("Sign out successful");
      return { error: null };
    } catch (error) {
      console.error("Exception signing out:", error.message);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Reset password function
  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setNetworkError(null);

      console.log("Resetting password for:", email);

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "stayfit://reset-password",
      });

      if (error) {
        console.error("Error resetting password:", error.message);

        // Check if it's a network error
        if (
          error.message.includes("Network") ||
          error.message.includes("fetch")
        ) {
          setNetworkError(error.message);

          // Show a more user-friendly error message
          Alert.alert(
            "Network Error",
            "Unable to connect to the server. Please check your internet connection and try again.",
            [{ text: "OK" }]
          );
        }

        throw error;
      }

      console.log("Password reset email sent");
      return { data, error: null };
    } catch (error) {
      console.error("Exception resetting password:", error.message);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    session,
    loading,
    networkError,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  // Return the provider with the context value
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
