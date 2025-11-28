import { mapBackendListToFactors } from "@/utils/mapBackendToFactors";

describe("mapBackendListToFactors", () => {
  it("returns an empty array when input is null, undefined, or not an array", () => {
    expect(mapBackendListToFactors(null)).toEqual([]);
    expect(mapBackendListToFactors(undefined)).toEqual([]);
    // @ts-ignore - testing invalid input safety
    expect(mapBackendListToFactors({})).toEqual([]);
  });

  it("maps standard UPPERCASE backend enums (ESTROGEN_PILL) correctly", () => {
    const backendList = ["ESTROGEN_PILL"];
    const result = mapBackendListToFactors(backendList);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: "Estrogen Pill",
        value: "Present", 
        variant: "default",
      }),
    );
  });

  it("maps special sentence strings (Family History) correctly", () => {
    const backendList = ["Family history of anemia"];
    const result = mapBackendListToFactors(backendList);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: "Family History",
        value: "Anemia", 
      }),
    );
  });

  it("maps backend flow_normal to frontend flow_moderate", () => {
    const backendList = ["flow_normal"];
    const result = mapBackendListToFactors(backendList);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(
      expect.objectContaining({
        title: "Flow Characteristics",
        value: "Moderate", // Verified mapping
        variant: "flow",
      }),
    );
  });

  it("handles a complex mixed list", () => {
    const backendList = [
      "TIRED",           // Should map to Fatigue
      "flow_heavy",      // Should map to Heavy Flow
      "BLOOD_CLOT",      // Should map to Blood Clot
      "UNKNOWN_FACTOR"   // Should be ignored
    ];
    const result = mapBackendListToFactors(backendList);

    expect(result).toHaveLength(3);
    
    // Check for Fatigue (mapped from TIRED)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "Fatigue" }),
        expect.objectContaining({ title: "Flow Characteristics", value: "Heavy" }),
        expect.objectContaining({ title: "Blood Clot" }),
      ])
    );
  });
});
