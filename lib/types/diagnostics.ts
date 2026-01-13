/**
 * Numeric representation of risk levels.
 * 0 = Default/None, 1 = Low, 2 = Medium, 3 = High
 */
export type RiskNum = 0 | 1 | 2 | 3;

/**
 * Numeric representation of menstrual flow intensity.
 * 0 = None, 1 = Light, 2 = Normal, 3 = Heavy
 */
export type FlowNum = 0 | 1 | 2 | 3;

export interface DiagnosticsResponseDTO {
    id: string;
    userId: string;
    date: string; // ISO Date "YYYY-MM-DD"

    // Risks
    anemiaRisk?: number | null; // 0-3 scale likely
    thrombosisRisk?: number | null;

    // Flow
    flowLevel?: number | null;
    periodId?: string | null;

    // Detailed Insights
    anemiaKeyInputs?: string[] | null;
    anemiaSummary?: string | null;
    thrombosisKeyInputs?: string[] | null;
    thrombosisSummary?: string | null;

    lastUpdated: string; // ISO Timestamp
}
