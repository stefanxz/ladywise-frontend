import React from "react";
import { View } from "react-native";
export const SafeAreaView = ({ children, ...rest }: any) => (
  <View {...rest}>{children}</View>
);
