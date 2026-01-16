import React from "react";
import { render } from "@testing-library/react-native";
import { DividerText } from "./DividerText";

describe("DividerText", () => {
  it("renders correctly with children", () => {
    const { getByText } = render(<DividerText>Or sign up with</DividerText>);

    expect(getByText("Or sign up with")).toBeTruthy();
  });
});
