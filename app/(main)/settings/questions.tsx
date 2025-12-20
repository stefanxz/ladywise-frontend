import { Text } from "react-native";
import React from "react";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";

/**
 * QuestionsSettings
 *
 * Screen displaying FAQs or help questions.
 *
 * @returns {JSX.Element} The rendered questions/help screen
 */
export default function QuestionsSettings() {
  return (
    <SettingsPageLayout
      title="Questions"
      description="Find answers to your questions."
    >
      {/* Settings Options Card */}
      <Text>Placeholder</Text>
    </SettingsPageLayout>
  );
}
