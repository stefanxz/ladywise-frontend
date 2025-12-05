import { View, Text, StyleSheet } from "react-native";

export default function ProfileSettings() {
  return (
    <View style={styles.container}>
      <Text>Profile Settings</Text>
      {/* Your profile settings content */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
