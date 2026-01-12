import { useAuth } from "@/context/AuthContext";
import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { EmailField } from "@/components/EmailField/EmailField";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { SocialSignOn } from "@/components/SocialSignOn/SocialSignOn";
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
 * RegisterIndex
 *
 * The initial screen in the user registration flow.
 * Collects email, password, and terms agreement.
 *
 * @returns {JSX.Element} The rendered registration screen
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

  useEffect(() => {
    console.log("[RegisterIndex] Component MOUNTED");
    return () => {
      console.log("[RegisterIndex] Component UNMOUNTED");
    };
  }, []);

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

  const isSubmittingRef = useRef(false);

  const handleContinue = async () => {
    console.log("[RegisterIndex] 'Continue' pressed");

    // Prevent double submission via Ref (Synchronous check)
    if (isSubmittingRef.current) {
      console.warn("[RegisterIndex] Blocked double submission attempt.");
      return;
    }

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

    if (hasError) {
      console.log("[RegisterIndex] Validation failed", {
        emailError,
        passwordError,
      });
      return;
    }

    console.log("[RegisterIndex] Validation passed. Starting registration...");
    isSubmittingRef.current = true;
    setRegistering(true);

    try {
      console.log("[RegisterIndex] Calling registerUser API...");
      const loginResponse = await registerUser({
        email: email.trim(),
        password: password.trim(),
        consentGiven: termsConditions,
        consentVersion: termsData.version,
      });
      console.log(
        "[RegisterIndex] Registration successful. UserId: ",
        loginResponse.userId,
      );

      await signIn(
        loginResponse.token,
        loginResponse.userId || (loginResponse as any).id,
        loginResponse.email,
      );

      console.log("[RegisterIndex] Navigating to personal-details...");
      router.replace("/(auth)/register/personal-details");
    } catch (e: unknown) {
      console.error("[RegisterIndex] Registration failed", e);
      // Reset the lock on failure so user can try again
      isSubmittingRef.current = false;

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
      // Note: We do NOT reset isSubmittingRef.current = false on success
      // because we want to block further clicks while navigating away.
      // It will be reset when the component unmounts and is recreated next time.
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

            <View className="gap-y-8 w-80 self-center">
              {/* Email input field */}
              <EmailField
                label="Email"
                value={email}
                onChangeText={onChangeEmail}
                placeholder="Your email"
                error={emailError}
                testID="email-input"
                inputProps={
                  {
                    autoCapitalize: "none",
                    autoComplete: "off",
                    textContentType: "none",
                    importantForAutofill: "no",
                  } as any
                }
              />

              {/* Password input field */}
              <PasswordField
                label="Password"
                value={password}
                onChangeText={onChangePassword}
                error={passwordError}
                testID="password-input"
                inputProps={
                  {
                    autoCapitalize: "none",
                    autoComplete: "off",
                    textContentType: "none",
                    importantForAutofill: "no",
                  } as any
                }
              />

              {/* Password confirmation input field */}
              <PasswordField
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={onChangeConfirm}
                error={confirmPasswordError}
                testID="confirm-password-input"
                inputProps={
                  {
                    autoCapitalize: "none",
                    autoComplete: "off",
                    textContentType: "none",
                    importantForAutofill: "no",
                  } as any
                }
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

            {/* Social media sign on buttons */}
            <SocialSignOn
              onPress={(provider) => {
                // TODO: Actual social media sign on
                console.log("SSO pressed:", provider);
              }}
            />
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
