import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, Modal, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  DROPDOWN_WIDTH,
  VIEW_OPTIONS,
  ViewMode,
  ViewModeDropdownProps,
} from "@/components/Diagnostics/types";

/**viewmode-dropdown-modal
 * Dropdown menu which allows the user to change the view mode of the diagnostics graphs
 * @param value
 * @param onChange
 * @constructor
 */
const ViewModeDropdown: React.FC<ViewModeDropdownProps> = ({
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<View>(null);

  const currentLabel =
    VIEW_OPTIONS.find((opt) => opt.value === value)?.label ?? "Daily";

  const handleOpen = () => {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      const screenWidth = Dimensions.get("window").width;

      let left = x;
      if (x + DROPDOWN_WIDTH > screenWidth) {
        left = x + width - DROPDOWN_WIDTH;
      }

      setDropdownPosition({
        top: y + height + 4,
        left,
      });
      setOpen(true);
    });
  };

  const handleSelect = (mode: ViewMode) => {
    onChange(mode);
    setOpen(false);
  };

  return (
    <View ref={buttonRef} testID="viewmode-dropdown-container">
      <TouchableOpacity
        testID="viewmode-dropdown-button"
        onPress={handleOpen}
        className="bg-gray-200 py-1.5 px-3 rounded-[20px] flex-row items-center"
      >
        <Text
          testID="viewmode-dropdown-label"
          className="text-xs font-medium text-regularText mr-1"
        >
          {currentLabel}
        </Text>
        <Feather name="chevron-down" size={14} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        testID="viewmode-dropdown-modal"
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          testID="viewmode-dropdown-backdrop"
          className="flex-1"
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View
            testID="viewmode-dropdown-menu"
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: DROPDOWN_WIDTH,
            }}
            className="bg-white rounded-xl py-2 shadow-lg"
          >
            {VIEW_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                testID={`viewmode-option-${opt.value}`}
                onPress={() => handleSelect(opt.value)}
                className={`py-3 px-4 ${
                  value === opt.value ? "bg-gray-100" : ""
                }`}
              >
                <Text
                  testID={`viewmode-option-label-${opt.value}`}
                  className={`text-sm ${
                    value === opt.value
                      ? "font-semibold text-headingText"
                      : "text-regularText"
                  }`}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ViewModeDropdown;
