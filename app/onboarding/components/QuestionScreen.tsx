import { QUESTIONNAIRE_TOTAL_STEPS } from "@/app/onboarding/QuestionnaireContext";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { cn } from "@/utils/helpers";
import { ReactNode } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_EDGE_OFFSET = 0.08;

type QuestionScreenProps = {
  step: number;
  totalSteps?: number;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onSkip?: () => void;
  showSkip?: boolean;
  edgeOffset?: number;
};

export function QuestionScreen({
  step,
  totalSteps = QUESTIONNAIRE_TOTAL_STEPS,
  title,
  description,
  children,
  footer,
  onSkip,
  showSkip = true,
  edgeOffset = DEFAULT_EDGE_OFFSET,
}: QuestionScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background items-center">
      <View className="w-full max-w-md mt-2 px-10 pt-[16px]">
        <View className="flex-row items-center">
          <View className="flex-1">
            <ProgressBar
              currentStep={step}
              totalSteps={totalSteps}
              edgeOffset={edgeOffset}
            />
          </View>
          {showSkip ? (
            <View className="w-1/6">
              <Pressable onPress={onSkip}>
                <Text className="text-inter-regular text-right text-lightGrey android:pr-1">
                  Skip
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="w-1/6"></View>
          )}
        </View>
      </View>

      <ScrollView
        className="w-full max-w-md mt-2 gap-y-4 px-10 pt-[71px] pb-12"
        contentContainerStyle={{ alignItems: "flex-start" }}
      >
        <Text className="text-3xl font-inter-semibold text-brand text-left">
          {title}
        </Text>

        {description ? (
          <Text className="pr-8 text-inter-regular text-regularText text-left leading-relaxed">
            {description}
          </Text>
        ) : null}

        <View className={cn("w-full mt-6 gap-y-6")}>{children}</View>

        {footer ? <View className="w-full mt-10">{footer}</View> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type BinaryChoiceGroupProps = {
  question: string;
  value: boolean | null;
  onChange: (val: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  testIDPrefix?: string;
};

export function BinaryChoiceGroup({
  question,
  value,
  onChange,
  yesLabel = "Yes",
  noLabel = "No",
  testIDPrefix,
}: BinaryChoiceGroupProps) {
  const options: { label: string; value: boolean }[] = [
    { label: yesLabel, value: true },
    { label: noLabel, value: false },
  ];

  return (
    <View className="gap-y-3">
      <Text className="text-inter-semibold text-regularText">{question}</Text>
      <View className="gap-y-2">
        {options.map((option) => (
          <Pressable
            key={option.label}
            onPress={() => onChange(option.value)}
            testID={
              testIDPrefix
                ? `${testIDPrefix}-${option.value ? "yes" : "no"}`
                : undefined
            }
            className={cn(
              "w-full rounded-2xl border border-transparent px-4 py-3",
              value === option.value ? "bg-brand/10 border-brand" : "bg-white",
            )}
          >
            <Text
              className={cn(
                "text-inter-semibold text-left",
                value === option.value ? "text-brand" : "text-regularText",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type MultiSelectOption = {
  id: string;
  label: string;
};

type MultiSelectGroupProps = {
  question: string;
  options: MultiSelectOption[];
  selected: string[];
  onToggle: (id: string) => void;
};

export function MultiSelectGroup({
  question,
  options,
  selected,
  onToggle,
}: MultiSelectGroupProps) {
  return (
    <View className="gap-y-3">
      <Text className="text-inter-semibold text-regularText">{question}</Text>
      <View className="gap-y-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <Pressable
              key={option.id}
              onPress={() => onToggle(option.id)}
              testID={`multiselect-option-${option.id}`}
              accessibilityState={{ selected: isSelected }}
              className={cn(
                "w-full rounded-2xl border border-transparent px-4 py-3",
                isSelected ? "bg-brand/10 border-brand" : "bg-white",
              )}
            >
              <Text
                className={cn(
                  "text-inter-semibold text-left",
                  isSelected ? "text-brand" : "text-regularText",
                )}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
