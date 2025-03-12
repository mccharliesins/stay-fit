import { Platform } from "react-native";

export const checkNetworkConnection = async (url) => {
  try {
    console.log(`Checking network connection to: ${url}`);

    // Add a timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    // Use a GET request to the health endpoint instead of HEAD
    // This is more reliable for Supabase
    const checkUrl = `${url}/rest/v1/?apikey=public`;

    const response = await fetch(checkUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(
      `Network check result: ${response.status} ${response.statusText}`
    );

    // For Supabase, even a 404 with the right headers means the server is reachable
    // The important thing is that we got a response from the server
    return {
      connected: response.status !== 0, // Any response means we're connected
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    console.error(`Network check error: ${error.message}`);
    return {
      connected: false,
      error: error.message,
      platform: Platform.OS,
    };
  }
};

export const logDeviceInfo = () => {
  console.log("Device Info:");
  console.log(`Platform: ${Platform.OS}`);
  console.log(`Version: ${Platform.Version}`);
  console.log(`Is Emulator: ${Platform.constants?.isEmulator || "unknown"}`);
};
