import { SettingItem } from "@/constants/types/settings-types";
import { Href } from "expo-router";
import TermsConditionsPopUp, {
  TermsConditionsPopUpRef,
} from "@/components/TermsConditionsPopUp/TermsConditionsPopUp";

/**
 * Defines the setting names, icons, and routes for all settings
 * in the Account Settings category.
 */
export const accountSettings: SettingItem[] = [
  { name: "Profile", icon: "user", route: "/settings/profile" as Href },
  { name: "Account", icon: "settings", route: "/settings/account" as Href },
  {
    name: "Notifications",
    icon: "bell",
    route: "/settings/notifications" as Href,
  },
  {
    name: "Questions",
    icon: "help-circle",
    route: "/settings/questions" as Href,
  },
];

/**
 * Defines the setting names, icons, and routes for all settings
 * in the Other Settings category.
 */
export const otherSettings = (openTermsSheet: () => void): SettingItem[] => [
  {
    name: "Privacy Policy",
    icon: "book-open",
    onPress: openTermsSheet,
  },
  { name: "Rate Us", icon: "star", onPress: () => console.log("Rate us") },
];
