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
}

/**
 * Props for the ShareReportModal component.
 */
export interface ShareReportModalProps {
  visible: boolean;
  onClose: () => void;
  reportType: ReportType;
}
