import { ScrollView, Text, View, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState, useEffect } from "react";
import { SettingItem } from "@/components/Settings/SettingItem";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { useVideoPlayer, VideoView } from "expo-video";
import { Ionicons } from "@expo/vector-icons";
import { getTutorials } from "@/lib/api";
import { useToast } from "@/hooks/useToast";

// Tutorial types
export type Tutorial = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  order: number;
};

/**
 * TutorialsScreen
 *
 * Tutorials and help resources page
 */
export default function TutorialsScreen() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("");
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const errorMessage = "Unable to load tutorials. Please try again later";

  const player = useVideoPlayer(currentVideoUrl, (player) => {
    player.loop = false;
  });

  const handleVideoPress = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  useEffect(() => {
    const loadTutorials = async () => {
      try {
        const data = await getTutorials();
        setTutorials(data);
      } catch (error) {
        setTutorials([]);
        showToast(errorMessage, "error");
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppBar />
      <ScrollView className="flex-1 px-4 pt-4 w-full">
        <Text className="text-3xl font-bold text-headingText mb-6">
          Questions
        </Text>

        {/* Tutorial Resources */}
        <View>
          <Text className="text-sm text-inactiveText pb-2 font-bold">
            Video Help Resources (Tutorials)
          </Text>

          <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
            {loading ? (
              <Text className="text-center py-4">Loading tutorials...</Text>
            ) : tutorials.length === 0 ? (
              <Text className="text-center py-4">
                No tutorials available yet
              </Text>
            ) : (
              tutorials.map((tutorial, index, array) => (
                <SettingItem
                  key={tutorial.id || index}
                  item={{
                    name: tutorial.title,
                    icon: "video" as const,
                    onPress: tutorial.videoUrl
                      ? () => handleVideoPress(tutorial.videoUrl)
                      : undefined,
                  }}
                  showDivider={index < array.length - 1}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Video Modal */}
      <Modal
        visible={showVideoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowVideoModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="bg-white rounded-2xl p-4 w-11/12">
            <Pressable
              testID="close-video-modal"
              onPress={() => setShowVideoModal(false)}
              className="self-end"
            >
              <Ionicons name="close" size={28} color="black" />
            </Pressable>

            <VideoView
              player={player}
              style={{ width: "100%", height: 550, borderRadius: 12 }}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
