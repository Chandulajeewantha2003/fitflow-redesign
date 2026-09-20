
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

type Workout = {
  id: number;
  title: string;
  duration: number;
  difficulty: string;
};

// IMPORTANT: Replace this with your computer's current IPv4 address.
const API_URL = 'http://10.218.237.129:3000';

export default function App() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(`${API_URL}/workouts`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: Workout[] = await response.json();

        if (!controller.signal.aborted) {
          setWorkouts(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to connect to backend'
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchWorkouts();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom']}
      >
        <Text style={styles.title}>
          FitFlow
        </Text>

        <Text style={styles.subtitle}>
          Your Fitness Journey
        </Text>

        <Text style={styles.heading}>
          My Workouts
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color="#16A34A"
            />

            <Text style={styles.loadingText}>
              Loading workouts...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>
              Unable to load workouts
            </Text>

            <Text style={styles.error}>
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                No workouts available.
              </Text>
            }
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.workoutTitle}>
                  {item.title}
                </Text>

                <Text style={styles.details}>
                  {item.duration} minutes
                </Text>

                <Text style={styles.details}>
                  {item.difficulty}
                </Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#16A34A',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 32,
  },

  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },

  listContent: {
    paddingBottom: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
    elevation: 2,
  },

  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },

  details: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 4,
  },

  center: {
    alignItems: 'center',
    marginTop: 40,
  },

  loadingText: {
    marginTop: 12,
    color: '#64748B',
  },

  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 12,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
    marginBottom: 6,
  },

  error: {
    fontSize: 14,
    color: '#DC2626',
  },

  emptyText: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 30,
  },
});