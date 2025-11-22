import { ScrollView, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FactorsSection from "../../../components/Diagnostics/FactorsSection";
import WhatContributedButton from "./components/WhatContributedButton";
import useContributedModal from "../../../components/Diagnostics/useContributedModal";
import { mapBackendToFactors } from "../../../components/Diagnostics/mapBackendToFactors";

const mockBackend = {
  dizziness: true,
  shortness_breath: true,
  flow: "light",
  postpartum: false,
  swelling: false,
};

export default function AnemiaMock() {
  const factors = mapBackendToFactors(mockBackend);
  const { openContributed, modal } = useContributedModal(factors);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <Text className="text-2xl font-inter-semibold mb-4">
          Mock Anemia Screen
        </Text>

        <FactorsSection factors={factors} />
        <WhatContributedButton onPress={openContributed} />
        {modal}
      </ScrollView>
    </SafeAreaView>
  );
}
