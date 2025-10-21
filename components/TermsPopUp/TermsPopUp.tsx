import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

type Props = {
  visible: boolean;
  onAccept: () => void;
  onClose: () => void;
};

export default function TermsModal({ visible, onAccept, onClose }: Props) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-2xl px-5 pt-3 pb-6">
          <View className="self-center w-12 h-1.5 rounded bg-gray-200 mb-2" />
          <Text className="text-3xl text-brand text-left font-semibold">
            Privacy Policy &{"\n"}Terms of Service
          </Text>
          <View className="h-2" />

          <ScrollView className="max-h-80">
            <View className="pb-3">
              <Text className="text-gray-600 text-lg mt-2 text-left leading-snug">
                At LifeSense Group, we believe that wearable technology empowers
                people to understand and work on their health independently. We
                fully acknowledge the great responsibility that comes with
                safeguarding sensitive data, such as information about your
                menstruation and blood conductivity. We are committed to
                achieving the highest standards of privacy and security, as well
                as to being transparent about how we process data. We hope you
                will find this privacy policy clear, honest, and transparent. Do
                not hesitate to reach out to us at info@lifesense-group.com if
                you have any questions. LifeSense Group contact address is High
                Tech Campus 10, 5656 AE, Eindhoven, The Netherlands. Further
                contact information can be found here. LifeSense Group has an
                appointed data protection officer, who can be contacted at
                info@lifesense-group.com.
              </Text>
              <View className="h-2" />
              <Text className="text-3xl text-brand text-left font-semibold">
                How we process your personal data
              </Text>
              <Text className="text-gray-600 text-lg mt-2 text-left leading-snug">
                Data processing is at the center of everything we do at
                LifeSense Group. Whenever you use our services—such as LifeSense
                Group products and apps (like Oopsie Heroes or Carin Pelvic
                Floor Trainer) or when you go on our website—some personal and
                non-personal data is collected, stored, and analyzed using
                internal and third-party tools. Here are the three purposes for
                which we process data and the type of data that is processed to
                fulfill each purpose:
              </Text>
            </View>
          </ScrollView>

          <Pressable
            className="mt-4 bg-brand rounded-xl py-3 items-center"
            onPress={onAccept}
          >
            <Text className="text-white font-semibold">Accept & Continue</Text>
          </Pressable>

          <Pressable className="mt-2 items-center py-2" onPress={onClose}>
            <Text className="text-brand font-semibold">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
