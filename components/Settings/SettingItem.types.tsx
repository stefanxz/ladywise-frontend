import { SettingItem as SettingItemType } from "@/constants/types/settings-types";

/**
 * Properties for the SettingItem component.
 */
export type SettingItemProps = {
  /** The configuration object for the setting item (name, icon, route/action). */
  item: SettingItemType;
  /** Whether to show a divider line below the item. */
  showDivider: boolean;
};
