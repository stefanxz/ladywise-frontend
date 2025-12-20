import { CycleQuestionOptionPillProps } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { Pressable, Text } from "react-native";

/**
 * CycleQuestionOptionPill
 *
 * A single selectable pill/button representing one answer option in a CycleQuestion.
 *
 * @param {CycleQuestionOptionPillProps} props - Component props
 * @param {string} props.label - The text to display inside the pill
 * @param {boolean} props.selected - Whether this pill is currently selected
 * @param {function} props.onPress - Callback when the pill is pressed
 * @returns {JSX.Element} The rendered option pill
 */
export function CycleQuestionOptionPill({
  label,
  selected,
  onPress,
}: CycleQuestionOptionPillProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-full border ${
        selected ? "bg-brand border-brand" : "bg-gray-100 border-gray-300"
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          selected ? "text-white" : "text-regularText"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
