import { checkCycleQuestionnaireAccess } from "@/lib/questionnaireService";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
/**
 * CycleQuestionnaireMock
 * -----------------------
 * Mock screen that verifies access to the cycle questionnaire.
 * Redirects back to first-questionnaire-completion when access is denied.
 * Uses typed navigation to satisfy Expo Router’s type requirements.
 */
export default function CycleQuestionnaireMock() {
  const router = useRouter();

  // Indicates loading state while verifying backend access.
  const [loading, setLoading] = useState(true);

  // Whether user is permitted to access the cycle questionnaire.
  const [allowed, setAllowed] = useState(false);

  // Route to redirect to after access verification. Typed for Expo Router.
  const [redirectTo, setRedirectTo] = useState<Href | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function verifyAccess() {
      try {
        const result = await checkCycleQuestionnaireAccess();

        if (!isMounted) return;

        if (result.allowed) {
          setAllowed(true);
        } else {
          // Redirect if user hasn’t completed the first questionnaire.
          setRedirectTo("/onboarding/first-questionnaire-completion" as Href);
        }
      } catch {
        // If backend is unavailable, allow access for testing/mocking.
        if (!isMounted) return;
        setAllowed(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    verifyAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  // Perform navigation in a separate effect once redirect target is set.
  useEffect(() => {
    if (redirectTo) {
      router.replace(redirectTo);
    }
  }, [redirectTo, router]);

  // Show loading spinner while verifying access.
  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#B87D99" />
        <Text className="text-gray-600 mt-2">Verifying access...</Text>
      </SafeAreaView>
    );
  }

  // Prevent flicker or race conditions during navigation.
  if (redirectTo) {
    return null;
  }

  // Extra safety: if access was denied but redirect didn’t trigger.
  if (!allowed) {
    return null;
  }

  // Main content displayed if user is authorized.
  return (
    <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-6">
      <Text className="text-3xl font-semibold text-brand mb-4">
        Cycle Questionnaire
      </Text>
      <Text className="text-lg text-gray-700 text-center">
        You have successfully completed your first-time questionnaire.{"\n"}
        This is the starting point for cycle tracking questions.
      </Text>
    </SafeAreaView>
  );
}
