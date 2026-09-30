import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Line, Rect, Text as SvgText } from "react-native-svg";
import { AuthUser, completeOnboarding, FitnessGoal } from "../services/auth";
import { FitnessIllustration } from "./WelcomeScreen";

export const goals: {
  value: FitnessGoal;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  {
    value: "lose_weight",
    title: "Lose Weight",
    description: "Burn fat and get leaner",
    icon: "flame",
  },
  {
    value: "build_strength",
    title: "Build Strength",
    description: "Get stronger and fitter",
    icon: "barbell",
  },
  {
    value: "improve_endurance",
    title: "Improve Endurance",
    description: "Boost stamina and energy",
    icon: "walk",
  },
];
const steps = [
  {
    title: "What's your age?",
    description: "This helps us create a plan that fits you.",
    unit: "years",
    min: 13,
    max: 120,
  },
  {
    title: "What's your height?",
    description: "This helps us calculate your BMI and personalize your plan.",
    unit: "cm",
    min: 80,
    max: 250,
  },
  {
    title: "What's your weight?",
    description: "Helps us track your progress accurately.",
    unit: "kg",
    min: 20,
    max: 350,
  },
];

export default function OnboardingScreen({
  user,
  onComplete,
  onSignOut,
}: {
  user: AuthUser;
  onComplete: (user: AuthUser) => void;
  onSignOut: () => void;
}) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState([
    String(user.age ?? 24),
    String(user.height ?? 170),
    String(user.weight ?? 65),
  ]);
  const [goal, setGoal] = useState<FitnessGoal | undefined>(user.fitnessGoal);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const submitting = useRef(false);
  const current = steps[step];
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (!saving && step > 0) {
          setStep(step - 1);
          setError("");
        }
        return true;
      },
    );
    return () => subscription.remove();
  }, [step, saving]);
  function change(value: string) {
    setValues((previous) =>
      previous.map((old, i) => (i === step ? value : old)),
    );
    setError("");
  }
  async function next() {
    if (submitting.current) return;
    if (step < 3) {
      const value = Number(values[step]);
      if (
        !values[step].trim() ||
        !Number.isFinite(value) ||
        value < current.min ||
        value > current.max ||
        (step === 0 && !Number.isInteger(value))
      ) {
        setError(
          `Enter ${step === 0 ? "a whole number" : "a number"} between ${current.min} and ${current.max} ${current.unit}.`,
        );
        return;
      }
      setError("");
      setStep(step + 1);
      return;
    }
    if (!goal) {
      setError("Choose your primary fitness goal to continue.");
      return;
    }
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      const updated = await completeOnboarding({
        age: Number(values[0]),
        height: Number(values[1]),
        weight: Number(values[2]),
        fitnessGoal: goal,
      });
      onComplete(updated);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save your profile. Please try again.",
      );
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.top}>
          <View
            accessibilityRole="progressbar"
            accessibilityValue={{ min: 0, max: 4, now: step + 1 }}
            accessibilityLabel="Profile setup progress"
            style={styles.track}
          >
            <View style={[styles.fill, { width: `${(step + 1) * 25}%` }]} />
          </View>
          <View style={styles.stepRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous step"
              disabled={step === 0 || saving}
              onPress={() => {
                setStep(step - 1);
                setError("");
              }}
              style={[styles.back, step === 0 && { opacity: 0 }]}
            >
              <Ionicons name="chevron-back" size={22} color="#344054" />
            </Pressable>
            <Text style={styles.step}>Step {step + 1} of 4</Text>
            <View style={styles.back} />
          </View>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <Text accessibilityRole="header" style={styles.title}>
            {current?.title ?? "What's your goal?"}
          </Text>
          <Text style={styles.description}>
            {current?.description ?? "Choose your primary fitness goal."}
          </Text>
          {step < 3 ? (
            <>
              <View style={styles.counter}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Decrease ${["age", "height", "weight"][step]}`}
                  disabled={Number(values[step]) <= current.min}
                  onPress={() =>
                    change(
                      String(
                        Math.max(
                          current.min,
                          Math.round(
                            ((Number(values[step]) || current.min) - 1) * 10,
                          ) / 10,
                        ),
                      ),
                    )
                  }
                  style={({ pressed }) => [
                    styles.round,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="remove" size={25} color="#17202A" />
                </Pressable>
                <View style={styles.numberBlock}>
                  <TextInput
                    key={step}
                    accessibilityLabel={
                      [
                        "Age in years",
                        "Height in centimeters",
                        "Weight in kilograms",
                      ][step]
                    }
                    value={values[step]}
                    onChangeText={change}
                    keyboardType={step === 0 ? "number-pad" : "decimal-pad"}
                    selectTextOnFocus
                    maxLength={5}
                    style={styles.number}
                  />
                  <Text style={styles.unit}>{current.unit}</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Increase ${["age", "height", "weight"][step]}`}
                  disabled={Number(values[step]) >= current.max}
                  onPress={() =>
                    change(
                      String(
                        Math.min(
                          current.max,
                          Math.round(
                            ((Number(values[step]) || current.min) + 1) * 10,
                          ) / 10,
                        ),
                      ),
                    )
                  }
                  style={({ pressed }) => [
                    styles.round,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="add" size={25} color="#17202A" />
                </Pressable>
              </View>
              <View
                accessible={false}
                importantForAccessibility="no-hide-descendants"
                style={styles.art}
              >
                {step === 2 ? (
                  <View style={styles.scaleBackdrop}>
                    <Svg width={210} height={210} viewBox="0 0 210 210">
                      <Rect
                        x="35"
                        y="30"
                        width="140"
                        height="160"
                        rx="26"
                        fill="#E2EAEB"
                      />
                      <Rect
                        x="43"
                        y="40"
                        width="124"
                        height="140"
                        rx="19"
                        fill="#293F49"
                      />
                      <Rect
                        x="79"
                        y="48"
                        width="53"
                        height="32"
                        rx="7"
                        fill="#FFFFFF"
                      />
                      <SvgText
                        x="105"
                        y="69"
                        textAnchor="middle"
                        fontSize="17"
                        fill="#293F49"
                      >
                        kg
                      </SvgText>
                      <Line
                        x1="64"
                        y1="100"
                        x2="64"
                        y2="157"
                        stroke="#405962"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      <Line
                        x1="146"
                        y1="100"
                        x2="146"
                        y2="157"
                        stroke="#405962"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </Svg>
                  </View>
                ) : (
                  <>
                    <FitnessIllustration />
                    {step === 1 && (
                      <View style={styles.ruler}>
                        {Array.from({ length: 19 }, (_, i) => (
                          <View
                            key={i}
                            style={{
                              width: i % 3 === 0 ? 18 : 10,
                              height: 1,
                              backgroundColor: "#079455",
                            }}
                          />
                        ))}
                      </View>
                    )}
                  </>
                )}
              </View>
            </>
          ) : (
            <View style={styles.goals}>
              {goals.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{
                    checked: goal === option.value,
                    disabled: saving,
                  }}
                  disabled={saving}
                  onPress={() => {
                    setGoal(option.value);
                    setError("");
                  }}
                  style={({ pressed }) => [
                    styles.goal,
                    goal === option.value && styles.selected,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name={option.icon} size={30} color="#172B38" />
                  <View style={styles.goalText}>
                    <Text style={styles.goalTitle}>{option.title}</Text>
                    <Text style={styles.goalDescription}>
                      {option.description}
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      goal === option.value
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={22}
                    color={goal === option.value ? "#079455" : "#D0D5DD"}
                  />
                </Pressable>
              ))}
            </View>
          )}
        </ScrollView>
        <View style={styles.footer}>
          {!!error && (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={next}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.pressed,
              saving && { opacity: 0.65 },
            ]}
          >
            {saving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                {step === 3 ? "Continue" : "Next"}
              </Text>
            )}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={saving}
            onPress={onSignOut}
            style={styles.signOut}
          >
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  flex: { flex: 1 },
  top: { paddingHorizontal: 24, paddingTop: 16 },
  track: {
    height: 5,
    backgroundColor: "#EEF1F4",
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: 5, backgroundColor: "#079455", borderRadius: 4 },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  back: { width: 44, height: 44, justifyContent: "center" },
  step: { fontSize: 13, color: "#667085" },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 22,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#101828",
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#667085",
    textAlign: "center",
    marginTop: 10,
    maxWidth: 290,
  },
  counter: {
    width: "100%",
    maxWidth: 290,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 34,
  },
  round: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  numberBlock: { alignItems: "center", width: 110, flexShrink: 1 },
  number: {
    fontSize: 38,
    fontWeight: "800",
    color: "#101828",
    textAlign: "center",
    width: "100%",
    padding: 4,
  },
  unit: { color: "#667085", fontSize: 15, marginTop: 3 },
  art: {
    width: "100%",
    maxWidth: 340,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 250,
  },
  scaleBackdrop: {
    backgroundColor: "#E8F8ED",
    borderRadius: 110,
    marginVertical: 25,
  },
  ruler: {
    position: "absolute",
    right: 30,
    top: 30,
    height: 255,
    borderLeftWidth: 2,
    borderLeftColor: "#079455",
    justifyContent: "space-between",
  },
  goals: { width: "100%", marginTop: 30, gap: 16 },
  goal: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  selected: { borderColor: "#079455", backgroundColor: "#F2FBF5" },
  goalText: { flex: 1 },
  goalTitle: { fontSize: 16, fontWeight: "700", color: "#101828" },
  goalDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#667085",
    marginTop: 5,
  },
  footer: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 4 },
  button: {
    minHeight: 54,
    backgroundColor: "#00994F",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { fontSize: 16, fontWeight: "700", color: "#FFFFFF" },
  pressed: { opacity: 0.72 },
  error: { color: "#B42318", fontSize: 14, lineHeight: 20, marginBottom: 12 },
  signOut: { minHeight: 44, alignItems: "center", justifyContent: "center" },
  signOutText: { fontSize: 12, color: "#667085" },
});
