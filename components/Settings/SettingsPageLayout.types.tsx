import React from "react";

/**
 * Properties for the SettingsPageLayout component.
 */
export type SettingsPageLayoutProps = {
  /** The heading text displayed at the top of the settings page. */
  title: string;
  /** Descriptive text shown below the title. */
  description: string;
  /** The main content of the settings page. */
  children: React.ReactNode;
};
