import { AppBar } from "@/components/AppBarBackButton/AppBarBackButton";
import { EmailField } from "@/components/EmailField/EmailField";
import { PasswordField } from "@/components/PasswordField/PasswordField";
import { SocialSignOn } from "@/components/SocialSignOn/SocialSignOn";
import { TermsConditionsCheckbox } from "@/components/TermsConditionsCheckbox/TermsConditionsCheckbox";
import TermsConditionsPopUp from "@/components/TermsConditionsPopUp/TermsConditionsPopUp";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import { isEmailValid, isPasswordValid } from "@/utils/validations";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

//Main page for registering
//Contains email, password, password confirmation, option for social sign up
export default function RegisterIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsConditions, setTermsConditions] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);

  const router = useRouter();

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

  const handleContinue = async () => {
    setFormError(null);
    setEmailError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);

    {
      /* Error handling - if validation finds error on the entered input, error flag is set*/
    }
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
        "Password must contain at least 8 characters, 1 upper case, 1 lower case and 1 number (and no spaces)."
      );
      hasError = true;
    }

    if (confirmPassword !== password || !confirmPassword.trim()) {
      setConfirmPasswordError("Please make sure the passwords match.");
      hasError = true;
    }
    {
      /* If there is error, do not route, stay on the same page */
    }
    if (hasError) return;

    // setRegistering(true);
    // try {
    //   await registerUser({ email, password });
    //   router.push("/register2");
    // } catch (e) {
    //   setFormError(e instanceof Error ? e.message : "Registration failed.");
    // } finally {
    //   setRegistering(false);
    // }
    router.push("/(auth)/register/personal-details");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="w-full bg-gray-50" style={{ zIndex: 10, elevation: 10 }}>
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
            onShowModal={() => setShowModal(true)}
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
            {
              /*TODO: Actual social media sign on*/
            }
            console.log("SSO pressed:", provider);
          }}
        />
      </View>
      <TermsConditionsPopUp
        visible={showModal}
        onAccept={() => {
          setShowModal(false);
          setTermsConditions(true);
        }}
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}
