import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AuthUser } from "../services/auth";
import { apiRequest } from "../services/api";
import { goals } from "./OnboardingScreen";

type Workout = {
  id: number;
  title: string;
  duration: number;
  difficulty: string;
};
type Tab = "Home" | "Plan" | "Progress";
export default function HomeScreen({
  user,
  onSignOut,
}: {
  user: AuthUser;
  onSignOut: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Home");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [profile, setProfile] = useState(false);
  const [selected, setSelected] = useState<Workout | null>(null);
  const goal = goals.find((item) => item.value === user.fitnessGoal);
  const name = user.name?.split(" ")[0] || user.email.split("@")[0];
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    apiRequest("/workouts")
      .then(async (response) => {
        if (!response.ok)
          throw new Error("Could not load workouts. Please try again.");
        const data = await response.json();
        if (!Array.isArray(data))
          throw new Error("Could not load workouts. Please try again.");
        if (active) setWorkouts(data);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "Could not load workouts.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [retry]);
  const featured =
    workouts.find((item) =>
      user.fitnessGoal === "build_strength"
        ? item.title.includes("Strength")
        : user.fitnessGoal === "improve_endurance"
          ? item.title.includes("Cardio")
          : item.title.includes("Full Body"),
    ) ?? workouts[0];
  const workoutList = (
    <>
      {loading ? (
        <ActivityIndicator color="#079455" style={{ marginVertical: 30 }} />
      ) : error ? (
        <View style={styles.empty}>
          <Text style={styles.muted}>{error}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() => setRetry(retry + 1)}
            style={styles.retry}
          >
            <Text style={styles.greenText}>Try again</Text>
          </Pressable>
        </View>
      ) : workouts.length ? (
        workouts.map((workout) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => setSelected(workout)}
            key={workout.id}
            style={styles.workout}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="barbell-outline" size={23} color="#067647" />
            </View>
            <View style={styles.grow}>
              <Text style={styles.rowTitle}>{workout.title}</Text>
              <Text style={styles.small}>
                {workout.duration} min · {workout.difficulty}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={19} color="#667085" />
          </Pressable>
        ))
      ) : (
        <Text style={styles.muted}>
          Your workouts will appear here when available.
        </Text>
      )}
    </>
  );
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.brand}>FitFlow</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View your profile"
          onPress={() => setProfile(true)}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>
            {name.slice(0, 1).toUpperCase()}
          </Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {tab === "Home" ? (
          <>
            <Text accessibilityRole="header" style={styles.greeting}>
              {greeting}, {name}
            </Text>
            <Text style={styles.muted}>Ready for today?</Text>
            <View style={styles.hero}>
              <View style={styles.heroRow}>
                <View style={styles.grow}>
                  <Text style={styles.heroLabel}>YOUR DAILY FLOW</Text>
                  <Text style={styles.heroTitle}>
                    {featured
                      ? `${featured.duration} min ${featured.title.replace(" Workout", "")}`
                      : "Make time for you"}
                  </Text>
                  <Text style={styles.heroDescription}>
                    {goal
                      ? `Your focus: ${goal.title.toLowerCase()}`
                      : "Start with a workout that suits you."}
                  </Text>
                </View>
                <View style={styles.heroIcon}>
                  <Ionicons name="barbell" size={39} color="#FFFFFF" />
                </View>
              </View>
              <Pressable
                accessibilityRole="button"
                onPress={() =>
                  featured ? setSelected(featured) : setTab("Plan")
                }
                style={({ pressed }) => [
                  styles.start,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <Text style={styles.greenText}>
                  {featured ? "VIEW WORKOUT" : "EXPLORE WORKOUTS"}
                </Text>
              </Pressable>
            </View>
            <View style={styles.dots}>
              <View style={styles.dotActive} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <View style={styles.stats}>
              {[
                ["Workouts", "0"],
                ["Streak", "0 days"],
                ["Calories", "—"],
              ].map(([label, value]) => (
                <View key={label} style={styles.stat}>
                  <Text style={styles.statLabel}>{label}</Text>
                  <Text style={styles.statValue}>{value}</Text>
                </View>
              ))}
            </View>
            <Text accessibilityRole="header" style={styles.section}>
              Quick actions
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setTab("Plan")}
              style={styles.action}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="barbell" size={22} color="#067647" />
              </View>
              <Text style={[styles.rowTitle, styles.grow]}>Find a Workout</Text>
              <Ionicons name="chevron-forward" size={18} color="#667085" />
            </Pressable>
            {[
              ["restaurant", "Log Meal"],
              ["people", "Join Challenge"],
            ].map(([icon, label]) => (
              <View
                key={label}
                style={styles.action}
                accessibilityLabel={`${label}, coming soon`}
              >
                <View style={styles.actionIcon}>
                  <Ionicons
                    name={icon as "restaurant" | "people"}
                    size={22}
                    color="#667085"
                  />
                </View>
                <Text style={[styles.rowTitle, styles.grow]}>{label}</Text>
                <Text style={styles.coming}>Coming soon</Text>
              </View>
            ))}
            <View style={styles.focus}>
              <Text style={styles.small}>YOUR GOAL</Text>
              <Text style={styles.rowTitle}>
                {goal?.title ?? "Build a healthy routine"}
              </Text>
              <Text style={styles.small}>
                One step at a time. Your first workout is a great place to
                begin.
              </Text>
            </View>
          </>
        ) : tab === "Plan" ? (
          <>
            <Text accessibilityRole="header" style={styles.greeting}>
              Your workout plan
            </Text>
            <Text style={styles.muted}>Find your next move.</Text>
            <View style={{ marginTop: 24 }}>{workoutList}</View>
          </>
        ) : (
          <>
            <Text accessibilityRole="header" style={styles.greeting}>
              Your starting point
            </Text>
            <Text style={styles.muted}>
              The profile you created for your journey.
            </Text>
            <View style={styles.profileDetails}>
              {[
                ["Age", `${user.age ?? "—"} years`],
                ["Height", `${user.height ?? "—"} cm`],
                ["Weight", `${user.weight ?? "—"} kg`],
                ["Goal", goal?.title ?? "Not selected"],
              ].map(([label, value]) => (
                <View key={label} style={styles.detailRow}>
                  <Text style={styles.muted}>{label}</Text>
                  <Text style={styles.rowTitle}>{value}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.muted}>
              No activity recorded yet. Workout tracking will be available in a
              future update.
            </Text>
          </>
        )}
      </ScrollView>
      <View style={styles.nav}>
        {(["Home", "Plan", "Progress", "Community", "Nutrition"] as const).map(
          (label, index) => {
            const available = index < 3;
            const icons = [
              "home",
              "clipboard",
              "trending-up",
              "people",
              "nutrition",
            ] as const;
            return (
              <Pressable
                key={label}
                accessibilityRole="tab"
                accessibilityState={{
                  selected: tab === label,
                  disabled: !available,
                }}
                accessibilityLabel={available ? label : `${label}, coming soon`}
                disabled={!available}
                onPress={() => setTab(label as Tab)}
                style={styles.navItem}
              >
                <Ionicons
                  name={icons[index]}
                  size={23}
                  color={tab === label ? "#079455" : "#98A2B3"}
                />
                <Text
                  style={[
                    styles.navLabel,
                    tab === label && { color: "#079455" },
                  ]}
                >
                  {label}
                </Text>
                {!available && <Text style={styles.soon}>Soon</Text>}
              </Pressable>
            );
          },
        )}
      </View>
      <Modal
        visible={profile || !!selected}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setProfile(false);
          setSelected(null);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.sheet}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close details"
              onPress={() => {
                setProfile(false);
                setSelected(null);
              }}
              style={styles.close}
            >
              <Ionicons name="close" size={25} color="#344054" />
            </Pressable>
            {profile ? (
              <>
                <Text style={styles.greeting}>Your profile</Text>
                <Text style={styles.muted}>{user.email}</Text>
                <Text style={styles.section}>{goal?.title}</Text>
                <Text style={styles.muted}>
                  {user.age} years · {user.height} cm · {user.weight} kg
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={onSignOut}
                  style={styles.logout}
                >
                  <Text style={styles.greenText}>Sign out</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.greeting}>{selected?.title}</Text>
                <Text style={styles.muted}>
                  {selected?.duration} minutes · {selected?.difficulty}
                </Text>
                <Text style={[styles.muted, { marginTop: 20 }]}>
                  Guided exercises and workout tracking are not available yet.
                  You can browse the workout options while we build your next
                  step.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 20,
  },
  brand: {
    color: "#00994F",
    fontSize: 29,
    fontStyle: "italic",
    fontWeight: "800",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF5EE",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#067647", fontWeight: "700", fontSize: 19 },
  content: { paddingHorizontal: 24, paddingBottom: 26 },
  greeting: {
    fontSize: 23,
    fontWeight: "800",
    color: "#101828",
    marginBottom: 5,
  },
  muted: { fontSize: 14, color: "#667085", lineHeight: 22 },
  grow: { flex: 1 },
  hero: {
    backgroundColor: "#00994F",
    borderRadius: 14,
    padding: 17,
    marginTop: 20,
    shadowColor: "#079455",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  heroRow: { flexDirection: "row", gap: 12, alignItems: "center" },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 10,
  },
  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: "#FFFFFF",
    marginTop: 6,
  },
  heroIcon: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#FFFFFF20",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-25deg" }],
  },
  start: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 17,
  },
  greenText: { color: "#067647", fontSize: 13, fontWeight: "800" },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginVertical: 14,
  },
  dot: { width: 5, height: 5, backgroundColor: "#E4E7EC", borderRadius: 3 },
  dotActive: {
    width: 5,
    height: 5,
    backgroundColor: "#079455",
    borderRadius: 3,
  },
  stats: { flexDirection: "row", gap: 10 },
  stat: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  statLabel: { fontSize: 12, color: "#475467" },
  statValue: {
    fontSize: 19,
    fontWeight: "800",
    color: "#101828",
    marginTop: 5,
  },
  section: {
    fontSize: 18,
    fontWeight: "700",
    color: "#101828",
    marginTop: 24,
    marginBottom: 12,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 10,
    minHeight: 55,
    backgroundColor: "#F4F5F7",
    borderRadius: 9,
    marginBottom: 9,
  },
  actionIcon: {
    width: 34,
    height: 34,
    backgroundColor: "#E3F3E9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  rowTitle: { color: "#101828", fontSize: 14, fontWeight: "600" },
  coming: { fontSize: 10, color: "#667085" },
  focus: { marginTop: 20, gap: 7 },
  small: { fontSize: 12, color: "#667085", lineHeight: 19 },
  nav: {
    borderTopWidth: 1,
    borderTopColor: "#EAECF0",
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 7,
  },
  navItem: { flex: 1, alignItems: "center", minHeight: 51, gap: 4 },
  navLabel: { fontSize: 10, color: "#667085" },
  soon: { fontSize: 9, color: "#667085" },
  workout: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  empty: { paddingVertical: 20 },
  retry: { minHeight: 44, justifyContent: "center" },
  profileDetails: { marginVertical: 25 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 15,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  overlay: {
    flex: 1,
    backgroundColor: "#10182866",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    paddingBottom: 48,
  },
  close: {
    alignSelf: "flex-end",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  logout: { minHeight: 48, justifyContent: "center", marginTop: 20 },
});
