import { 
  cn, 
  mapAnswersToPayload, 
  mapApiToAnswers, 
  mapApiToInsights 
} from "@/utils/helpers";
import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";

describe("General Helpers", () => {
  
  // ClassName utility
  describe("cn (className merger)", () => {
    it("joins strings and ignores falsy values", () => {
      expect(cn("base-class", "active-class")).toBe("base-class active-class");
      expect(cn("base", false && "hidden", null, undefined, "visible")).toBe("base visible");
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
  });
});