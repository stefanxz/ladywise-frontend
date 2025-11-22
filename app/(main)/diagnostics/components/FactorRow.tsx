import { View, Text } from "react-native";
import React from "react";

// ICON IMPORTS (same mapping system as FactorCard)
import EstrogenIcon from "@/assets/icons/factors/estrogen-pill-icon.svg";
import SurgeryIcon from "@/assets/icons/factors/surgery-severe-injury-icon.svg";
import BloodClotIcon from "@/assets/icons/factors/blood-clot-icon.svg";
import PostpartumIcon from "@/assets/icons/factors/postpartum-icon.svg";
import ChestPainIcon from "@/assets/icons/factors/chestpain-icon.svg";
import LegPainIcon from "@/assets/icons/factors/leg-pain-icon.svg";
import ShortBreathIcon from "@/assets/icons/factors/shortness-breath-icon.svg";
import SwellingIcon from "@/assets/icons/factors/swelling-icon.svg";
import DizzinessIcon from "@/assets/icons/factors/dizziness-icon.svg";
import FlowLight from "@/assets/icons/factors/light-flow-icon.svg";
import FlowModerate from "@/assets/icons/factors/moderate-flow-icon.svg";
import FlowHeavy from "@/assets/icons/factors/heavy-flow-icon.svg";

const ICONS = {
  estrogen: EstrogenIcon,
  surgery: SurgeryIcon,
  bloodClot: BloodClotIcon,
  postpartum: PostpartumIcon,
  chestPain: ChestPainIcon,
  legPain: LegPainIcon,
  shortBreath: ShortBreathIcon,
  swelling: SwellingIcon,
  dizziness: DizzinessIcon,
  flowLight: FlowLight,
  flowModerate: FlowModerate,
  flowHeavy: FlowHeavy,
};

export default function FactorRow({ id, title, value, source }) {
  const Icon = ICONS[id];

  return (
    <View className="flex-row items-center py-3">
      <Icon width={22} height={22} />

      <View className="ml-3 flex-1">
        <Text className="text-[15px] font-inter-semibold text-headingText">
          {title}
        </Text>
        <Text className="text-sm text-gray-600">{value}</Text>
      </View>

      <View className="bg-gray-100 px-3 py-1 rounded-full">
        <Text className="text-xs text-gray-600 font-inter-medium">
          {source}
        </Text>
      </View>
    </View>
  );
}
