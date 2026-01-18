import React from "react";

/**
 * Properties for the SettingsPageLayout component.
 *
 * This layout provides a consistent structure for all settings-related screens,
 * featuring a standard header with a title and description, a scrollable content area,
 * and an optional floating action button.
 */
export type SettingsPageLayoutProps = {
  /** The main heading text displayed at the top of the page. */
  title: string;
  /** A brief description or subtitle explaining the page's purpose. */
  description: string;
  /** The main content to be rendered within the scrollable area. */
  children: React.ReactNode;
  /**
   * Optional element (typically a button) to be rendered fixed at the bottom right
   * or within the footer area, depending on the implementation.
   */
  floatingAction?: React.ReactNode;
};
