import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { SettingsPageLayout } from "@/components/Settings/SettingsPageLayout";
import { useAuth } from "@/context/AuthContext";
import { getUserById, getUserHealth } from "@/lib/api";
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

/**
 * Screen for managing user profile information (questionnaire data).
 * Fetches current user data and displays it.
 */
export default function ProfileSettings() {
  const { token, userId } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
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

  // Handlers for local state updates (UI interaction only for now)
  const toggleAnemiaCondition = (id: string) => {
    setAnemiaConditions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleThrombosisCondition = (id: string) => {
    setThrombosisConditions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
          onPress={() => showToast("Changes saved!", "success")}
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
          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email
            </Text>
            <ThemedTextInput
              value={user?.email || ""}
              onChangeText={() => {}}
              className="bg-gray-100 text-gray-500"
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
