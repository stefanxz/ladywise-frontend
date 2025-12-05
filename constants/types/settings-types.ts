import { Feather } from "@expo/vector-icons";
import type { Href } from "expo-router";

/**
 * Type of setting item.
 * Note that the `route` field is of type `Href`. This is for type safety
 * when calling `router.push()`. Most of the time, the routes will be defined
 * as strings, in which case you must assert the type, e.g.,
 * `route: "/settings/profile" as Href`.
 *
 * If the setting item does not have its own route, and rather does something
 * on click (e.g., trigger a modal/bottom sheet), the `route` field can be
 * left empty, and the functionality specified through the `onPress` field.
 */
export type SettingItem = {
  name: string;
  icon: keyof typeof Feather.glyphMap;
  route?: Href;
  onPress?: () => void;
};
