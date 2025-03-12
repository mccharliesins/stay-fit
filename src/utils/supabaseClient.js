import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@env";
import { Platform } from "react-native";

// Initialize the Supabase client
const supabaseUrl = SUPABASE_URL || "https://example.supabase.co";
const supabaseAnonKey = SUPABASE_ANON_KEY || "your_supabase_anon_key";

console.log("Initializing Supabase client");
console.log("Supabase URL:", supabaseUrl);
// Don't log the full key for security, just the first few characters
console.log(
  "Supabase Key (first 10 chars):",
  supabaseAnonKey.substring(0, 10) + "..."
);

// Create a more robust Supabase client with better error handling
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    // Add custom headers for debugging
    headers: {
      "x-app-name": "StayFit",
      "x-app-version": "1.0.0",
      "x-platform": Platform.OS,
      "x-platform-version": Platform.Version,
    },
  },
  // Add better network error handling
  fetch: async (url, options = {}) => {
    // Add a timeout to all fetch requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      options.signal = controller.signal;
      const response = await fetch(url, options);
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`Supabase fetch error: ${error.message}`);

      // Enhance error message for network issues
      if (
        error.message.includes("Network request failed") ||
        error.message.includes("abort") ||
        error.message.includes("timeout")
      ) {
        console.error("Network connectivity issue detected");
        // Re-throw with more descriptive message
        throw new Error(
          `Network connectivity issue: ${error.message}. Please check your internet connection.`
        );
      }

      throw error;
    }
  },
});

// Log when the client is ready
console.log("Supabase client initialized");

export default supabase;
