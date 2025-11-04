//Covers the thin wrapper behavior.
//(ThemedTextInput forwards editable={!disabled}, supports secureTextEntry, className, onChangeText.)
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

describe("ThemedTextInput", () => {
  it("respects disabled → editable=false", () => {
    const { getByTestId } = render(
      <ThemedTextInput value="" onChangeText={() => {}} disabled testID="ti" />,
    );
    expect(getByTestId("ti")).toHaveProp("editable", false);
  });

  it("calls onChangeText", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <ThemedTextInput value="" onChangeText={onChangeText} testID="ti" />,
    );
    fireEvent.changeText(getByTestId("ti"), "hello");
    expect(onChangeText).toHaveBeenCalledWith("hello");
  });

  it("applies custom className and secureTextEntry", () => {
    const { getByTestId } = render(
      <ThemedTextInput
        value=""
        onChangeText={() => {}}
        className="extra"
        secureTextEntry
        testID="ti"
      />,
    );
    expect(getByTestId("ti")).toHaveProp(
      "className",
      expect.stringContaining("extra"),
    );
    expect(getByTestId("ti")).toHaveProp("secureTextEntry", true);
  });
});
