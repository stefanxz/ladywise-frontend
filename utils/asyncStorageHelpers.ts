import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Increments the failed login attempt count stored in AsyncStorage.
 * Used to track consecutive failures for security measures.
 *
 * @returns {Promise<void>}
 */
export const incrementFailedLoginCount = async (): Promise<void> => {
  try {
    const value = await AsyncStorage.getItem("failedLoginCount");
    const count = value ? parseInt(value, 10) + 1 : 1;
    await AsyncStorage.setItem("failedLoginCount", count.toString());
  } catch (error) {
    console.error("Error updating failed login count", error);
  }
};

/**
 * Resets the failed login attempt count to 0.
 */
export const resetFailedLoginCount = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem("failedLoginCount", "0");
  } catch (error) {
    console.error("Error resetting failed login count", error);
  }
};

/**
 * Retrieves the current failed login attempt count from AsyncStorage.
 * @returns Promise<number> — The current count, or 0 if not set.
 */
export const getFailedLoginCount = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem("failedLoginCount");
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error("Error getting failed login count:", error);
    return 0;
  }
};
