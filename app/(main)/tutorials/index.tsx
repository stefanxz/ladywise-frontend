import { ScrollView, Text, View, Modal, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import { SettingItem as SettingItemType } from "@/constants/types/settings-types";
import { SettingItem } from "@/components/Settings/SettingItem"; // We reuse the Settings page
import { Href } from "expo-router";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { useVideoPlayer, VideoView } from 'expo-video'; // video player
import { Ionicons } from "@expo/vector-icons";

/**
 * TutorialsScreen
 *
 * Tutorials and help resources page
 */
export default function TutorialsScreen() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');

  const player = useVideoPlayer(currentVideoUrl, player => {
    player.loop = false;
  });

  const handleVideoPress = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setShowVideoModal(true);
  };

  const tutorialItems = [  // We will have to change this, so that we fetch the list from the backend
  {   
      name: "Getting Started Guide",
      icon: "book-open" as const,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  },
  {
      name: "FAQ",
      icon: "help-circle" as const,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
  {
      name: "Period Tracker",
      icon: "video" as const,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  },
  {
      name: "Contact Support",
      icon: "mail" as const,
      route: "/tutorials/contact" as Href,
  },
];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <AppBar />
      <ScrollView className="flex-1 px-4 pt-4 w-full">
        <Text className="text-3xl font-bold text-headingText mb-6">
          Tutorials
        </Text>

        {/* Tutorial Resources */}
        <View>
          <Text className="text-sm text-inactiveText pb-2 font-bold">
            Help Resources
          </Text>

          <View className="bg-white rounded-2xl shadow-sm px-4 mb-6">
            {/* @ts-ignore - videoUrl is not in SettingItem type but works fine */}
            {tutorialItems.map((item, index, array) => (
              <SettingItem
                key={item.name}
                item={{
                  ...item,
                  onPress: 'videoUrl' in item && item.videoUrl
                  ? () => handleVideoPress(item.videoUrl)
                  : undefined,
                }}
                showDivider={index < array.length - 1}
              />
            ))}
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
              onPress={() => setShowVideoModal(false)}
              className="self-end"
            >
              <Ionicons name="close" size={28} color="black" />
            </Pressable>
            
            <VideoView 
              player={player}
              style={{ width: '100%', height: 250, borderRadius: 12 }}
              allowsFullscreen
              allowsPictureInPicture
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}