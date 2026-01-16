import {
  cn,
  mapAnswersToPayload,
  mapApiToAnswers,
  mapApiToInsights,
} from "@/utils/helpers";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

describe("General Helpers", () => {
  // ClassName utility
  describe("cn (className merger)", () => {
    it("joins strings and ignores falsy values", () => {
      expect(cn("base-class", "active-class")).toBe("base-class active-class");
      expect(cn("base", false && "hidden", null, undefined, "visible")).toBe(
        "base visible",
      );
    });

    it("returns empty string if all inputs are falsy", () => {
      expect(cn(false, null, undefined)).toBe("");
    });
  });

  // data mapping: UI -> backend
  describe("mapAnswersToPayload", () => {
    it("converts UI answers to backend enums", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-01-01",
        flow: "Light",
        symptoms: ["Cramps (Pain)"],
        riskFactors: ["Biosensor Cup"],
      };

      const result = mapAnswersToPayload(answers);

      expect(result.date).toBe("2024-01-01");
      expect(result.flow).toBeDefined();
      expect(Array.isArray(result.symptoms)).toBe(true);
    });

    it("handles 'None of the above' by returning empty arrays", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-01-01",
        flow: "",
        symptoms: ["None of the above"],
        riskFactors: ["None of the above"],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual([]);
      expect(result.riskFactors).toEqual([]);
    });
  });

  // reverse mapping: backend -> UI
  describe("mapApiToAnswers", () => {
    it("converts backend keys back to UI strings", () => {
      const apiData = {
        flow: "LIGHT",
        symptoms: [],
        riskFactors: [],
      };

      const result = mapApiToAnswers(apiData, "2024-01-01");

      expect(result.date).toBe("2024-01-01");
      expect(result.flow).toBe("Light"); // Assuming reverse map works
      expect(result.symptoms).toContain("None of the above");
    });
  });

  // insights mapping
  describe("mapApiToInsights", () => {
    it("maps high risk score correctly", () => {
      const mockApiData: any = {
        anemiaRisk: 3,
        thrombosisRisk: 1,
        latestAnemiaInsight: { description: "Anemia warning" },
        latestThrombosisInsight: { description: "Thrombosis okay" },
      };

      const [anemia, thrombosis] = mapApiToInsights(mockApiData);

      expect(anemia.title).toBe("Anemia Risk");
      expect(anemia.level).toBe("High");
      expect(thrombosis.level).toBe("Low");
    });

    it("handles missing insights gracefully", () => {
      const mockApiData: any = {
        anemiaRisk: 0,
        thrombosisRisk: 0,
      };

      const [anemia] = mapApiToInsights(mockApiData);
      expect(anemia.description).toBe("No recent analysis.");
    });

    it("returns empty array if apiData is null", () => {
      expect(mapApiToInsights(null as any)).toEqual([]);
    });

    it("maps score 2 to Medium", () => {
      const mockApiData: any = { anemiaRisk: 2, thrombosisRisk: 2 };
      const [anemia] = mapApiToInsights(mockApiData);
      expect(anemia.level).toBe("Medium");
    });

    it("prioritizes key_inputs over description", () => {
      const mockApiData: any = {
        anemiaRisk: 3,
        latest_anemia_risk_details: { key_inputs: ["Input A", "Input B"] },
        latestAnemiaInsight: { description: "Old description" },
      };
      const [anemia] = mapApiToInsights(mockApiData);
      expect(anemia.description).toBe("Input A, Input B");
    });
  });

  describe("formatDateUTC", () => {
    const { formatDateUTC } = require("@/utils/helpers");

    it("formats valid date string", () => {
      expect(formatDateUTC("2023-01-01")).toContain("Jan 1");
    });

    it("handles special object format with $date", () => {
      expect(formatDateUTC({ $date: "2023-02-15" } as any)).toContain("Feb 15");
    });

    it("returns empty string for invalid date", () => {
      expect(formatDateUTC("invalid-date")).toBe("");
    });
  });

  describe("mapApiToAnswers edge cases", () => {
    it("handles null/undefined fields in API data", () => {
      const result = mapApiToAnswers({}, "2024-01-01");
      expect(result.symptoms).toEqual(["None of the above"]);
      expect(result.riskFactors).toEqual(["None of the above"]);
      expect(result.flow).toBeNull();
    });

    it("preserves values that do not match reverse map", () => {
      const apiData = { symptoms: ["Unknown Symptom"] };
      const result = mapApiToAnswers(apiData, "2024-01-01");
      expect(result.symptoms).toEqual(["Unknown Symptom"]);
    });
  });

  describe("mapAnswersToPayload edge cases", () => {
    it("filters out unknown symptoms/factors that fail mapping", () => {
      // Assuming "Unknown" is not in the map, map returns undefined, filter(Boolean) removes it.
      const answers: DailyCycleAnswers = {
        date: "2024-01-01",
        flow: "",
        symptoms: ["Unknown Symptom"],
        riskFactors: ["Unknown Factor"],
      };
      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual([]);
      expect(result.riskFactors).toEqual([]);
    });
  });
});
