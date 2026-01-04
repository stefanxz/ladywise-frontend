import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { shareReport } from "@/lib/api";
import type { ShareReportModalProps, ReportType } from "@/lib/types/reports";

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * ShareReportModal
 *
 * A modal dialog that allows users to share their health report with a clinician via email.
 * Validates the email address and handles the API call to send the report.
 *
 * @param {ShareReportModalProps} props - Component props
 * @param {boolean} props.visible - Whether the modal is visible
 * @param {function} props.onClose - Callback to close the modal
 * @param {ReportType} props.reportType - The type of report to share (e.g., THROMBOSIS_ONLY)
 * @param {string} props.graphImageBase64 - Base64 string of the risk chart
 * @param {string} props.insightSummary - Text summary of the AI insights
 * @returns {JSX.Element} The rendered share report modal
 */
const ShareReportModal: React.FC<ShareReportModalProps> = ({
  visible,
  onClose,
  reportType,
  graphImageBase64,
  insightSummary,
}) => {
  const { token } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateEmail = (emailToValidate: string): boolean => {
    return EMAIL_REGEX.test(emailToValidate.trim());
  };

  const handleSend = useCallback(async () => {
    if (loading) return;

    // Reset states
    setError(null);
    setSuccess(null);

    // Validate email
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter a clinician email address.");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!token) {
      setError("You must be logged in to share reports.");
      return;
    }

    setLoading(true);
    try {
      const message = await shareReport(token, {
        clinicianEmail: trimmedEmail,
        reportType,
        graphImageBase64,
        insightSummary,
      });
      setSuccess(message || `Report successfully sent to ${trimmedEmail}`);
      // Clear email after success
      setEmail("");
    } catch (e: any) {
      if (e?.response?.status === 400) {
        setError("Invalid email format or missing report type.");
      } else if (e?.response?.status === 403) {
        setError("Session expired. Please log in again.");
      } else {
        setError(
          e?.message ?? "Something went wrong while sending the report.",
        );
      }
    } finally {
      setLoading(false);
    }
  }, [email, loading, token, reportType, graphImageBase64, insightSummary]);

  const handleClose = useCallback(() => {
    // Reset all state when closing
    setEmail("");
    setError(null);
    setSuccess(null);
    setLoading(false);
    onClose();
  }, [onClose]);

  const getTitle = (): string => {
    switch (reportType) {
      case "THROMBOSIS_ONLY":
        return "Share Thrombosis Report";
      case "ANEMIA_ONLY":
        return "Share Anemia Report";
      default:
        return "Share Full Report";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={handleClose}
        className="flex-1 bg-black/50 items-center justify-center px-4"
        accessibilityRole="button"
        accessibilityLabel="Close share report dialog backdrop"
      >
        <View pointerEvents="box-none" className="w-full max-w-sm">
          <View className="rounded-2xl bg-white p-5 shadow-lg">
            <View className="items-center">
              {/* Icon */}
              <View className="mb-3 h-10 w-10 items-center justify-center rounded-full bg-brand/10">
                <Feather name="send" size={20} color={Colors.brand} />
              </View>

              {/* Title */}
              <Text className="mb-1 text-center text-lg font-semibold text-gray-900">
                {getTitle()}
              </Text>

              <Text className="mb-4 text-center text-sm text-gray-500">
                Enter your clinician&apos;s email to send them a PDF report of
                your health data.
              </Text>

              {/* Email Input */}
              <TextInput
                testID="clinician-email-input"
                value={email}
                onChangeText={setEmail}
                placeholder="clinician@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !success}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 mb-3"
              />

              {/* Error Message */}
              {error ? (
                <View
                  testID="error-message"
                  className="mb-3 w-full rounded-md bg-red-50 p-2"
                >
                  <Text className="text-xs text-red-700">{error}</Text>
                </View>
              ) : null}

              {/* Success Message */}
              {success ? (
                <View
                  testID="success-message"
                  className="mb-3 w-full rounded-md bg-green-50 p-2"
                >
                  <Text className="text-xs text-green-700">{success}</Text>
                </View>
              ) : null}

              {/* Terms notice */}
              <Text className="text-xs text-gray-400 text-center mb-4">
                By sharing your data, you agree with our Terms and Conditions.
              </Text>

              {/* Buttons */}
              <View className="w-full flex-row gap-3">
                <Pressable
                  testID="cancel-button"
                  disabled={loading}
                  onPress={handleClose}
                  className="flex-1 items-center justify-center rounded-xl border border-gray-300 px-4 py-3 active:opacity-70"
                  accessibilityRole="button"
                  accessibilityLabel="Cancel share report"
                >
                  <Text className="text-sm font-medium text-gray-900">
                    {success ? "Close" : "Cancel"}
                  </Text>
                </Pressable>

                {!success && (
                  <Pressable
                    testID="send-button"
                    disabled={loading}
                    onPress={handleSend}
                    className="flex-1 flex-row items-center justify-center rounded-xl bg-brand px-4 py-3 active:opacity-80 disabled:opacity-60"
                    accessibilityRole="button"
                    accessibilityLabel="Send report to clinician"
                  >
                    {loading ? (
                      <ActivityIndicator
                        testID="loading-indicator"
                        color="white"
                      />
                    ) : (
                      <>
                        <Text className="text-sm font-semibold text-white mr-1">
                          Send
                        </Text>
                        <Feather name="arrow-right" size={16} color="white" />
                      </>
                    )}
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

export default ShareReportModal;
