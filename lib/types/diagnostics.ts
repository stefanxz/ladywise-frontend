/**
 * Numeric representation of risk levels.
 * 0 = Low, 1 = Medium, 2 = High
 */
export type RiskNum = 0 | 1 | 2;

/**
 * Numeric representation of menstrual flow intensity.
 * 0 = None, 1 = Light, 2 = Normal, 3 = Heavy
 */
export type FlowNum = 0 | 1 | 2 | 3;

/**
 * Data Transfer Object for Diagnostic History response.
 */
export interface DiagnosticsResponseDTO {
    date: string; // YYYY-MM-DD
    anemiaRisk: RiskNum; // 0, 1, 2
    thrombosisRisk: RiskNum; // 0, 1, 2
    flowLevel: FlowNum; // 0, 1, 2, 3

    // Detailed insights
    anemiaSummary?: string;
    thrombosisSummary?: string;

    // Contributing factors (keywords)
    anemiaKeyInputs?: string[];
    thrombosisKeyInputs?: string[];
}
