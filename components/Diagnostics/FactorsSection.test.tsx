import React from "react";
import { render } from "@testing-library/react-native";
import FactorsSection from "@/components/Diagnostics/FactorsSection";

describe("FactorsSection Component", () => {
  it("renders the empty state message when no factors are present", () => {
    const { getByText } = render(<FactorsSection data={[]} />);

    expect(getByText("No specific risk factors reported.")).toBeTruthy();
  });

  it("renders the cards correctly when data is present", () => {
    const mockData = ["CHEST_PAIN", "SHORTNESS_OF_BREATH"];

    const { getByText, getAllByText } = render(
      <FactorsSection data={mockData} />,
    );

    // Check that both cards are rendered correctly
    expect(getByText("Chest Pain")).toBeTruthy();
    expect(getByText("Shortness of Breath")).toBeTruthy();

    // Check that "Present" appears twice (once for each card)
    expect(getAllByText("Present")).toHaveLength(2);
  });
});
