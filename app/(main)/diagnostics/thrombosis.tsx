import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FactorsSection from "../../../components/Diagnostics/FactorsSection";
import WhatContributedButton from "./components/WhatContributedButton";
import useContributedModal from "../../../components/Diagnostics/useContributedModal";
import { mapBackendToFactors } from "../../../components/Diagnostics/mapBackendToFactors";

const mockBackend = {
  estrogen_pill: true,
  blood_clot_history: true,
  chest_pain: true,
  unilateral_leg_pain: false,
  swelling: true,
  flow: "heavy",
};

export default function ThrombosisMock() {
  const factors = mapBackendToFactors(mockBackend);
  const { openContributed, modal } = useContributedModal(factors);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <Text className="text-2xl font-inter-semibold mb-4">
          Mock Thrombosis Screen
        </Text>

        <FactorsSection factors={factors} />

        <WhatContributedButton onPress={openContributed} />

        {modal}
      </ScrollView>
    </SafeAreaView>
  );
}
