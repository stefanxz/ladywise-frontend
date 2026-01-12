import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getUserById,
  getUserHealth,
  updateHealthDocument,
  updateUser,
} from "@/lib/api";
import { HealthDocument, UserResponse } from "@/lib/types/payloads";
import { UnitInputField } from "@/components/UnitInputField/UnitInputField";
import { ThemedTextInput } from "@/components/ThemedTextInput/ThemedTextInput";
import { ThemedPressable } from "@/components/ThemedPressable/ThemedPressable";
import {
  BinaryChoiceGroup,
  MultiSelectGroup,
} from "@/app/onboarding/components/QuestionScreen";
import { ANEMIA_RISK_OPTIONS } from "@/data/anemia-risk-options";
import { THROMBOSIS_RISK_OPTIONS } from "@/data/thrombosis-risk-options";
import { useToast } from "@/hooks/useToast";

const NONE_OPTION = "none";

/**
 * Screen for managing user profile information (questionnaire data).
 * Fetches current user data and displays it.
 */
export default function ProfileSettings() {
  const { token, userId } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);

  // Local state for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const [familyAnemia, setFamilyAnemia] = useState<boolean | null>(null);
  const [familyThrombosis, setFamilyThrombosis] = useState<boolean | null>(
    null,
  );

  const [anemiaConditions, setAnemiaConditions] = useState<string[]>([]);
  const [thrombosisConditions, setThrombosisConditions] = useState<string[]>(
    [],
  );

  const [estrogenPill, setEstrogenPill] = useState<boolean | null>(null);
  const [biosensorCup, setBiosensorCup] = useState<boolean | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!token || !userId) return;

      try {
        setLoading(true);
        const userData = await getUserById(token, userId);
        const userHealthDocument = await getUserHealth();

        setUser(userData);
        populateFields(userData, userHealthDocument);
      } catch (error) {
        showToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showToast, token, userId]);

  const populateFields = (
    data: UserResponse,
    healthDocument: HealthDocument,
  ) => {
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");

    const personalDetails = healthDocument.health.personalDetails;

    setAge(personalDetails.age ? String(personalDetails.age) : "");
    setWeight(personalDetails.weight ? String(personalDetails.weight) : "");
    setHeight(personalDetails.height ? String(personalDetails.height) : "");

    const family = healthDocument.health.familyHistory;
    setFamilyAnemia(family.familyHistoryAnemia ?? null);
    setFamilyThrombosis(family.familyHistoryThrombosis ?? null);

    // Conditions
    const anemiaConditions = family.anemiaConditions ?? [];
    setAnemiaConditions(
      Array.isArray(anemiaConditions) ? anemiaConditions : [],
    );

    const thrombosisConditions = family.thrombosisConditions ?? [];
    setThrombosisConditions(
      Array.isArray(thrombosisConditions) ? thrombosisConditions : [],
    );

    setEstrogenPill(healthDocument.health.estrogenPill ?? null);
    setBiosensorCup(healthDocument.health.biosensorCup ?? null);
  };

  const toggleAnemiaCondition = (id: string) => {
    setAnemiaConditions((prev) => {
      // If "None" is clicked
      if (id === NONE_OPTION) {
        // If "None" is already selected, deselect it
        if (prev.includes(NONE_OPTION)) {
          return [];
        }
        // Otherwise, select only "None" (clear all others)
        return [NONE_OPTION];
      }

      // If any other option is clicked
      // Remove "None" if it was selected, then toggle the clicked option
      const withoutNone = prev.filter((i) => i !== NONE_OPTION);
      if (withoutNone.includes(id)) {
        return withoutNone.filter((i) => i !== id);
      } else {
        return [...withoutNone, id];
      }
    });
  };

  const toggleThrombosisCondition = (id: string) => {
    setThrombosisConditions((prev) => {
      // If "None" is clicked
      if (id === NONE_OPTION) {
        // If "None" is already selected, deselect it
        if (prev.includes(NONE_OPTION)) {
          return [];
        }
        // Otherwise, select only "None" (clear all others)
        return [NONE_OPTION];
      }

      // If any other option is clicked
      // Remove "None" if it was selected, then toggle the clicked option
      const withoutNone = prev.filter((i) => i !== NONE_OPTION);
      if (withoutNone.includes(id)) {
        return withoutNone.filter((i) => i !== id);
      } else {
        return [...withoutNone, id];
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!age.trim()) {
      newErrors.age = "Age is required";
    } else {
      const ageNum = parseInt(age, 10);
      if (isNaN(ageNum)) {
        newErrors.age = "Age must be a valid number";
      } else if (ageNum < 13 || ageNum > 56) {
        newErrors.age = `Age must be between 13 and 56`;
      }
    }

    if (!weight.trim()) {
      newErrors.weight = "Weight is required";
    } else {
      const weightNum = parseFloat(weight);
      if (isNaN(weightNum)) {
        newErrors.weight = "Weight must be a valid number";
      } else if (weightNum < 5 || weightNum > 540) {
        newErrors.weight = `Weight must be between 5 and 540 kg`;
      }
    }

    if (!height.trim()) {
      newErrors.height = "Height is required";
    } else {
      const heightNum = parseFloat(height);
      if (isNaN(heightNum)) {
        newErrors.height = "Height must be a valid number";
      } else if (heightNum < 62 || heightNum > 216) {
        newErrors.height = `Height must be between 62 and 216 cm`;
      }
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !userId) {
      showToast("Unable to save: user data not loaded", "error");
      return;
    }

    if (!validateForm()) {
      showToast("Please fix the errors before saving", "error");
      return;
    }

    try {
      setSaving(true);

      // Update user's basic info (first name, last name)
      await updateUser({
        id: userId,
        email: user.email,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Update health document
      await updateHealthDocument({
        personalDetails: {
          age: age ? parseInt(age, 10) : undefined,
          weight: weight ? parseFloat(weight) : undefined,
          height: height ? parseFloat(height) : undefined,
        },
        familyHistory: {
          familyHistoryAnemia: familyAnemia ?? undefined,
          familyHistoryThrombosis: familyThrombosis ?? undefined,
          anemiaConditions:
            anemiaConditions.length > 0 ? anemiaConditions : undefined,
          thrombosisConditions:
            thrombosisConditions.length > 0 ? thrombosisConditions : undefined,
        },
        estrogenPill: estrogenPill ?? undefined,
        biosensorCup: biosensorCup ?? undefined,
      });

      showToast("Changes saved successfully!", "success");
    } catch (error) {
      showToast("Failed to save changes", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SettingsPageLayout title="Profile" description="Loading your profile...">
        <ActivityIndicator size="large" color="#E63946" className="mt-10" />
      </SettingsPageLayout>
    );
  }

  return (
    <SettingsPageLayout
      title="Profile"
      description="Manage your personal information and health details."
      floatingAction={
        <ThemedPressable
          label="Save"
          onPress={handleSave}
          disabled={saving}
          className="shadow-lg w-[45%]"
        />
      }
    >
      {/* Basic Info Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-4">
          Personal Details
        </Text>
        <View className="gap-y-4">
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              First Name
            </Text>
            <ThemedTextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
              testID="first-name-input"
            />
          </View>
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Last Name
            </Text>
            <ThemedTextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
              testID="last-name-input"
            />
          </View>
          <View className="mt-2">
            <Text className="text-sm font-medium text-gray-700 mb-1">Age</Text>
            <ThemedTextInput
              value={age}
              onChangeText={setAge}
              placeholder="Age"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Weight
            </Text>
            <UnitInputField
              unit="kg"
              value={weight}
              onChangeText={setWeight}
              placeholder="Weight"
            />
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Height
            </Text>
            <UnitInputField
              unit="cm"
              value={height}
              onChangeText={setHeight}
              placeholder="Height"
            />
          </View>
        </View>
      </View>

      {/* Family History Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-6">
          Family History
        </Text>

        <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Anemia
        </Text>
        <BinaryChoiceGroup
          question=""
          value={familyAnemia}
          onChange={setFamilyAnemia}
        />

        <View className="mt-5">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Thrombosis
          </Text>

          <BinaryChoiceGroup
            question=""
            value={familyThrombosis}
            onChange={setFamilyThrombosis}
          />
        </View>
      </View>
      {/* Risk Factors Section */}
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-6">
        <Text className="text-lg font-bold text-headingText mb-6">
          Risk Factors
        </Text>

        <View className="mb-6">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Anemia Risk Factors
          </Text>
          <MultiSelectGroup
            question=""
            options={ANEMIA_RISK_OPTIONS}
            selected={anemiaConditions}
            onToggle={toggleAnemiaCondition}
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Thrombosis Risk Factors
          </Text>

          <MultiSelectGroup
            question=""
            options={THROMBOSIS_RISK_OPTIONS}
            selected={thrombosisConditions}
            onToggle={toggleThrombosisCondition}
          />
        </View>
      </View>
      <View className="bg-white rounded-2xl shadow-sm px-4 py-6 mb-20">
        <Text className="text-lg font-bold text-headingText mb-6">Other</Text>

        <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
          Estrogen Contraception
        </Text>
        <BinaryChoiceGroup
          question=""
          value={estrogenPill}
          onChange={setEstrogenPill}
        />

        <View className="mt-5">
          <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
            Biosensor Cup
          </Text>
          <BinaryChoiceGroup
            question=""
            value={biosensorCup}
            onChange={setBiosensorCup}
          />
        </View>
      </View>
    </SettingsPageLayout>
  );
}
