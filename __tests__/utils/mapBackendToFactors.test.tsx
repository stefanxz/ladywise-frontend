import { mapBackendToFactors } from "@/utils/mapBackendToFactors";

// We rely on the real registry for this test to ensure data integrity
describe("mapBackendToFactors", () => {
  it("returns an empty array when input is null or empty", () => {
    expect(mapBackendToFactors(null)).toEqual([]);
    expect(mapBackendToFactors({})).toEqual([]);
  });

  it("maps a standard boolean factor (Estrogen Pill) correctly", () => {
    const backendData = { estrogen_pill: true };
    const result = mapBackendToFactors(backendData);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: "Estrogen Pill",
        value: "Present", // Default value from registry
        variant: "default",
      }),
    );
  });

  it("maps the special Flow logic (Heavy -> flow_heavy)", () => {
    const backendData = { flow: "Heavy" };
    const result = mapBackendToFactors(backendData);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: "Flow Characteristics",
        value: "Heavy", // Should use the string from backend
        variant: "flow",
      }),
    );
  });

  it("handles multiple concurrent factors", () => {
    const backendData = {
      estrogen_pill: true,
      dizziness: true,
      flow: "Light",
    };
    const result = mapBackendToFactors(backendData);

    expect(result).toHaveLength(3);
    // Verify specific items exist
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Estrogen Pill" }),
        expect.objectContaining({ title: "Dizziness" }),
        expect.objectContaining({
          title: "Flow Characteristics",
          value: "Light",
        }),
      ]),
    );
  });

  it("ignores false or undefined values", () => {
    const backendData = {
      estrogen_pill: true,
      blood_clot: false, // Should be ignored
      swelling: undefined, // Should be ignored
    };
    const result = mapBackendToFactors(backendData);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe("Estrogen Pill");
  });
});
