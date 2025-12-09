// For standard image files
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";

// For SVG files, using react-native-svg-transformer
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
