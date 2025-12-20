/**
 * Report types for the share report feature.
 */

export type ReportType = "FULL_REPORT" | "THROMBOSIS_ONLY" | "ANEMIA_ONLY";

/**
 * Request payload for POST /api/reports/share
 */
export interface ReportRequest {
  /**
   * The email address of the clinician to receive the report.
   * REQUIRED. Must be a valid email format.
   */
  clinicianEmail: string;

  /**
   * The type of report to generate.
   * REQUIRED.
   */
  reportType: ReportType;

  /**
   * A snapshot of the graph currently visible on the user's screen.
   * OPTIONAL. Should be a clean Base64 string.
   */
  graphImageBase64?: string;

  /**
   * The text summary of the insight displayed to the user.
   * OPTIONAL. Included in the PDF context.
   */
  insightSummary?: string;
}

/**
 * Props for the ShareReportModal component.
 */
export interface ShareReportModalProps {
  visible: boolean;
  onClose: () => void;
  reportType: ReportType;
  graphImageBase64?: string;
  insightSummary?: string;
}
