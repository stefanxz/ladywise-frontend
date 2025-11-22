import { View, Text } from "react-native";
import React from "react";

// IMPORT ICONS EXACTLY AS YOUR FILENAMES
import EstrogenIcon from "@/assets/icons/factors/estrogen-pill-icon.svg";
import SurgeryIcon from "@/assets/icons/factors/surgery-severe-injury-icon.svg";
import BloodClotIcon from "@/assets/icons/factors/blood-clot-icon.svg";
import PostpartumIcon from "@/assets/icons/factors/postpartum-icon.svg";
import ChestPainIcon from "@/assets/icons/factors/chestpain-icon.svg";
import LegPainIcon from "@/assets/icons/factors/leg-pain-icon.svg";
import ShortBreathIcon from "@/assets/icons/factors/shortness-breath-icon.svg";
import SwellingIcon from "@/assets/icons/factors/swelling-icon.svg";
import DizzinessIcon from "@/assets/icons/factors/dizziness-icon.svg";

// FLOW ICONS
import FlowIcon from "@/assets/icons/factors/flow-icon.svg";
import LightFlowIcon from "@/assets/icons/factors/light-flow-icon.svg";
import ModerateFlowIcon from "@/assets/icons/factors/moderate-flow-icon.svg";
import HeavyFlowIcon from "@/assets/icons/factors/heavy-flow-icon.svg";

export type FactorId =
  | "estrogen"
  | "surgery"
  | "bloodClot"
  | "postpartum"
  | "chestPain"
  | "legPain"
  | "shortBreath"
  | "swelling"
  | "dizziness"
  | "flow"
  | "flowLight"
  | "flowModerate"
  | "flowHeavy";

const ICONS: Record<FactorId, React.ComponentType<any>> = {
  estrogen: EstrogenIcon,
  surgery: SurgeryIcon,
  bloodClot: BloodClotIcon,
  postpartum: PostpartumIcon,
  chestPain: ChestPainIcon,
  legPain: LegPainIcon,
  shortBreath: ShortBreathIcon,
  swelling: SwellingIcon,
  dizziness: DizzinessIcon,

  flow: FlowIcon,
  flowLight: LightFlowIcon,
  flowModerate: ModerateFlowIcon,
  flowHeavy: HeavyFlowIcon,
};

export interface FactorCardProps {
  id: FactorId;
  title: string;
  status: string;
  description: string;
}

export default function FactorCard({
  id,
  title,
  status,
  description,
}: FactorCardProps) {
  const Icon = ICONS[id];

  return (
    <View className="w-[48%] bg-white rounded-2xl p-4 border border-gray-200 shadow-sm mb-4">
      {/* Icon */}
      <Icon width={24} height={24} />

      {/* Title */}
      <Text className="mt-2 text-[15px] font-inter-semibold text-headingText">
        {title}
      </Text>

      {/* Status */}
      <Text className="mt-1 text-[17px] font-inter-semibold text-headingText">
        {status}
      </Text>

      {/* Description */}
      <Text className="mt-1 text-[12px] text-gray-500 leading-tight">
        {description}
      </Text>
    </View>
  );
}
