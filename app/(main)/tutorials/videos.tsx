import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video, ResizeMode } from "expo-av";
import AppBar from "@/components/AppBarBackButton/AppBarBackButton";

export default function VideoTutorialsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppBar />
      <View className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold text-headingText mb-6">
          Video Tutorials
        </Text>

        <Video
          source={{
            uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          }}
          style={{
            width: "100%",
            height: 300,
            borderRadius: 12,
            backgroundColor: "black",
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        />

        <Text className="text-lg text-headingText mt-4">
          Getting Started with LadyWise
        </Text>
        <Text className="text-inactiveText mt-2">
          Learn the basics of tracking your menstrual health.
        </Text>
      </View>
    </SafeAreaView>
  );
}
