import { DailyCycleAnswers } from "@/components/CycleQuestionsBottomSheet/CycleQuestionsBottomSheet.types";
import { mapAnswersToPayload } from "@/utils/helpers";

describe("mapAnswersToPayload", () => {
  describe("flow mapping", () => {
    it("should map flow levels correctly", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: "Light",
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.flow).toBe("LIGHT");
    });

    it('should map "None" flow to null', () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: "None",
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.flow).toBeNull();
    });

    it("should handle null flow", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.flow).toBeNull();
    });

    it("should return null for unmapped flow values", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: "InvalidFlow",
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.flow).toBeNull();
    });
  });

  describe("symptoms mapping", () => {
    it("should map symptoms correctly", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: ["Tired", "Dizzy"],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual(["TIRED", "DIZZY"]);
    });

    it('should filter out "None of the above"', () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: ["Tired", "None of the above", "Dizzy"],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual(["TIRED", "DIZZY"]);
    });

    it("should filter out unmapped symptoms", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: ["Tired", "InvalidSymptom", "Dizzy"],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual(["TIRED", "DIZZY"]);
    });

    it("should handle empty symptoms array", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual([]);
    });

    it('should handle only "None of the above" in symptoms', () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: ["None of the above"],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.symptoms).toEqual([]);
    });
  });

  describe("risk factors mapping", () => {
    it("should map risk factors correctly", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: ["Estrogen pill", "<6 months postpartum"],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.riskFactors).toEqual([
        "ESTROGEN_PILL",
        "POSTPARTUM_UNDER_6_MONTHS",
      ]);
    });

    it('should filter out "None of the above"', () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [
          "Estrogen pill",
          "None of the above",
          "Post/current blood clot",
        ],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.riskFactors).toEqual(["ESTROGEN_PILL", "BLOOD_CLOT"]);
    });

    it("should filter out unmapped risk factors", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [
          "Estrogen pill",
          "InvalidRisk",
          "Post/current blood clot",
        ],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.riskFactors).toEqual(["ESTROGEN_PILL", "BLOOD_CLOT"]);
    });

    it("should handle empty risk factors array", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.riskFactors).toEqual([]);
    });
  });

  describe("date handling", () => {
    it("should preserve the date string", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: null,
        symptoms: [],
        riskFactors: [],
      };

      const result = mapAnswersToPayload(answers);
      expect(result.date).toBe("2024-03-15");
    });
  });

  describe("complete payload mapping", () => {
    it("should map a complete payload with all fields", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: "Heavy",
        symptoms: ["Shortness of breath", "Chest Pain", "Swelling"],
        riskFactors: ["Surgery or severe injury", "Post/current blood clot"],
      };

      const result = mapAnswersToPayload(answers);

      expect(result).toEqual({
        date: "2024-03-15",
        flow: "HEAVY",
        symptoms: ["SHORTNESS_OF_BREATH", "CHEST_PAIN", "SWELLING"],
        riskFactors: ["SURGERY_OR_INJURY", "BLOOD_CLOT"],
      });
    });

    it("should handle mixed valid and invalid values", () => {
      const answers: DailyCycleAnswers = {
        date: "2024-03-15",
        flow: "Normal",
        symptoms: [
          "Tired",
          "None of the above",
          "InvalidSymptom",
          "One-sided leg pain",
        ],
        riskFactors: ["None of the above", "Estrogen pill", "InvalidRisk"],
      };

      const result = mapAnswersToPayload(answers);

      expect(result).toEqual({
        date: "2024-03-15",
        flow: "NORMAL",
        symptoms: ["TIRED", "ONE_SIDED_LEG_PAIN"],
        riskFactors: ["ESTROGEN_PILL"],
      });
    });
  });
});
