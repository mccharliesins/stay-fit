import { useColorScheme } from "react-native";

const lightTheme = {
  primary: "#FF4B4B",
  background: "#FFFFFF",
  cardBackground: "#F5F5F5",
  text: "#1A1A1A",
  textSecondary: "#757575",
  border: "#E0E0E0",
  error: "#FF3B30",
  success: "#34C759",
  warning: "#FF9500",
};

const darkTheme = {
  primary: "#FF4B4B",
  background: "#1A1A1A",
  cardBackground: "#2C2C2C",
  text: "#FFFFFF",
  textSecondary: "#ABABAB",
  border: "#404040",
  error: "#FF453A",
  success: "#32D74B",
  warning: "#FF9F0A",
};

export const useTheme = () => {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
};
