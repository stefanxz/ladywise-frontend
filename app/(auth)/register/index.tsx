import { useAuth } from "@/context/AuthContext";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { EmailField } from "@/components/EmailField/EmailField";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { TermsConditionsCheckbox } from "@/components/TermsConditionsCheckbox/TermsConditionsCheckbox";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { registerUser } from "@/lib/api";
import { isEmailValid, isPasswordValid } from "@/utils/validations";
import { useRouter } from "expo-router";
import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TermsConditionsPopUp, {
  TermsConditionsPopUpRef,
} from "@/components/TermsConditionsPopUp/TermsConditionsPopUp";
import termsData from "../../../data/terms-and-conditions.json";
type ApiError = { message?: string };
/**
 * User Registration Entry Screen
 *
 * This is the first step in the onboarding process where new users create their
 * account credentials. It captures and validates basic account information including
 * email, password, and confirmation of legal terms and conditions.
 *
 * It enforces password complexity requirements and ensures that email addresses
 * follow a valid format before allowing the user to proceed to personal details.
 */
export default function RegisterIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [registering, setRegistering] = useState(false);

  const { signIn } = useAuth();

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  const termsModalRef = useRef<TermsConditionsPopUpRef>(null);

  const router = useRouter();

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const bottomPadding =
    Platform.OS === "android" && isKeyboardVisible ? 350 : 0;

  const onChangeEmail = (t: string) => {
    setEmail(t);
    if (emailError) setEmailError(null);
  };
  const onChangePassword = (t: string) => {
    setPassword(t);
    if (passwordError) setPasswordError(null);
  };
  const onChangeConfirm = (t: string) => {
    setConfirmPassword(t);
    if (confirmPasswordError) setConfirmPasswordError(null);
  };

  /**
   * Registration Submission Handler
   *
   * Performs client-side validation for the registration form. If all fields are
   * valid, it calls the backend API to create the user account. Upon successful
   * registration, it automatically signs the user in and redirects them to the
   * personal details configuration step.
   */
  const handleContinue = async () => {
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email.");
      hasError = true;
    } else if (!isEmailValid(email)) {
      setEmailError("Email must have the format example@domain.com.");
      hasError = true;
    }

    if (!isPasswordValid(password)) {
      setPasswordError(
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces).",
      );
      hasError = true;
    }

    if (confirmPassword !== password || !confirmPassword.trim()) {
      setConfirmPasswordError("Please make sure the passwords match.");
      hasError = true;
    }

    if (hasError) return;

    setRegistering(true);
    try {
      const loginResponse = await registerUser({
        email: email.trim(),
        password: password.trim(),
        consentGiven: termsConditions,
        consentVersion: termsData.version,
      });

      await signIn(
        loginResponse.token,
        loginResponse.userId,
        loginResponse.email,
      );
      router.replace("/(auth)/register/personal-details");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const message =
          (e.response?.data as ApiError)?.message ??
          e.message ??
          "Registration failed.";

        if (status === 409) {
          setEmailError(message);
          return;
        }

        setFormError(message);
        return;
      }

      setFormError("Registration failed.");
    } finally {
      setRegistering(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-background"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 50}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: bottomPadding,
            alignItems: "center",
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="w-full bg-gray-50"
            style={{ zIndex: 10, elevation: 10 }}
          >
            <AppBar />
          </View>

          <View className="w-full max-w-md px-6 pt-10 gap-y-2 self-center">
            <View className="items-start px-10 mb-5">
              <Text className="text-3xl text-brand text-left">
                <Text className="font-semibold">Join </Text>
                <Text className="font-aclonica-regular">LadyWise 💫</Text>
              </Text>
              <Text className="text-gray-600 text-lg mt-2 text-left leading-snug max-w-xs">
                Start tracking your menstrual cycle with smart insights.
              </Text>
            </View>

            <View className="gap-y-8 mt-4 w-80 self-center">
              {/* Email input field */}
              <EmailField
                label="Email"
                value={email}
                onChangeText={onChangeEmail}
                placeholder="Your email"
                error={emailError}
                testID="email-input"
              />

              {/* Password input field */}
              <PasswordField
                label="Password"
                value={password}
                onChangeText={onChangePassword}
                error={passwordError}
                testID="password-input"
              />

              {/* Password confirmation input field */}
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={onChangeConfirm}
                error={confirmPasswordError}
                testID="confirm-password-input"
              />
            </View>

            {/* Terms and conditions checkbox */}
            <View className="mt-6 mb-2 w-80 self-center">
              <TermsConditionsCheckbox
                checked={termsConditions}
                onToggle={() => setTermsConditions((v) => !v)}
                openSheet={() => {
                  termsModalRef.current?.open();
                }}
              />
            </View>

            {/* Continue button */}
            <ThemedPressable
              label="Continue"
              onPress={handleContinue}
              loading={registering}
              disabled={!termsConditions}
              className="mt-6 w-80 self-center bg-brand"
              testID="continue-button"
            />

            {formError ? (
              <Text className="text-red-700 text-sm mt-2 text-center">
                {formError}
              </Text>
            ) : null}
          </View>
          <TermsConditionsPopUp
            ref={termsModalRef}
            onAccept={() => setTermsConditions(true)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
