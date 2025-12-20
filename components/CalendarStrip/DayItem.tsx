import { themes } from "@/lib/themes";
import { DayData } from "./CalendarStrip";
import { TouchableOpacity, Text } from "react-native";

/**
 * DayItem
 *
 * Individual day component within the CalendarStrip.
 * Displays day number and letter, with specific styling for current day and period days.
 *
 * @param {Object} props - Component props
 * @param {DayData} props.item - Data for the specific day
 * @param {string} props.themeColor - Highlight color
 * @param {function} props.onPress - press handler
 * @returns {JSX.Element} The rendered day item
 */
export const DayItem: React.FC<{
  item: DayData;
  themeColor: string;
  onPress: () => void;
}> = ({ item, themeColor, onPress }) => {
  const isCurrent = item.isCurrentDay;
  const isPeriod = item.isPeriodDay;

  const containerClasses = `rounded-xl py-2 px-3 items-center`;

  const dynamicStyles: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  } = {
    backgroundColor: "transparent",
    borderColor: "transparent",
    borderWidth: 0,
  };

  // If its a period day pu t the red border and transparent red tint
  if (isPeriod) {
    dynamicStyles.borderColor = themes.menstrual.highlight; // Strong red border
    dynamicStyles.borderWidth = 1.5; // Make the border clearly stronger
    // Apply a transparent red tint unless it's the current day (which has its own background)
    if (!isCurrent) {
      dynamicStyles.backgroundColor = "rgba(219, 136, 136, 0.26)"; // 10% opaque red
    }
  }

  if (isCurrent) {
    dynamicStyles.backgroundColor = themeColor;
    dynamicStyles.borderColor = themeColor;
    dynamicStyles.borderWidth = 3;
  }

  const numberClasses = isCurrent
    ? `text-lg font-bold text-black`
    : `text-lg font-bold text-gray-800`;

  const letterClasses = isCurrent
    ? `text-sm text-black`
    : `text-sm text-gray-500`;

  return (
    <TouchableOpacity
      onPress={onPress}
      className={containerClasses}
      style={dynamicStyles}
    >
      <Text className={numberClasses}>{item.dayNumber}</Text>
      <Text className={`mt-0.5 ${letterClasses}`}>{item.dayLetter}</Text>
    </TouchableOpacity>
  );
};
