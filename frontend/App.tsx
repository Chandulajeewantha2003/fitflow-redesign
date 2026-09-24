import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import WelcomeScreen from './components/WelcomeScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import { API_URL } from './services/api';

import {
  AuthUser,
} from './services/auth';

// ==========================================
// TYPES
// ==========================================

type Workout = {
  id: number;
  title: string;
  duration: number;
  difficulty: string;
};

type Screen =
  | 'welcome'
  | 'login'
  | 'register'
  | 'home';


// ==========================================
// HOME SCREEN
// ==========================================

function HomeScreen({
  user,
}: {
  user: AuthUser | null;
}) {
  const [workouts, setWorkouts] =
    useState<Workout[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  useEffect(() => {
    const controller =
      new AbortController();

    async function fetchWorkouts() {
      try {
        setLoading(true);
        setError('');

        const response = await fetch(
          `${API_URL}/workouts`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data: Workout[] =
          await response.json();

        if (
          !controller.signal.aborted
        ) {
          setWorkouts(data);
        }
      } catch (err) {
        if (
          !controller.signal.aborted
        ) {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to connect to backend'
          );
        }
      } finally {
        if (
          !controller.signal.aborted
        ) {
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

        {user?.email ? (
          <View style={styles.userCard}>
            <Text style={styles.welcomeText}>
              Welcome back 👋
            </Text>

            <Text style={styles.userEmail}>
              {user.email}
            </Text>
          </View>
        ) : null}

        <Text style={styles.heading}>
          My Workouts
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator
              size="large"
              color="#079455"
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading workouts...
            </Text>
          </View>
        ) : error ? (
          <View
            style={styles.errorBox}
          >
            <Text
              style={
                styles.errorTitle
              }
            >
              Unable to load workouts
            </Text>

            <Text
              style={styles.error}
            >
              {error}
            </Text>
          </View>
        ) : (
          <FlatList
            data={workouts}
            keyExtractor={(item) =>
              item.id.toString()
            }
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.listContent
            }
            ListEmptyComponent={
              <Text
                style={
                  styles.emptyText
                }
              >
                No workouts available.
              </Text>
            }
            renderItem={({
              item,
            }) => (
              <View
                style={styles.card}
              >
                <Text
                  style={
                    styles.workoutTitle
                  }
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.details
                  }
                >
                  {item.duration}{' '}
                  minutes
                </Text>

                <Text
                  style={
                    styles.details
                  }
                >
                  {item.difficulty}
                </Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>
  );
}

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [screen, setScreen] =
    useState<Screen>('welcome');

  const [
    currentUser,
    setCurrentUser,
  ] = useState<AuthUser | null>(
    null
  );

  // ========================================
  // LOGIN / REGISTER SUCCESS
  // ========================================

  function handleAuthSuccess(
    user: AuthUser
  ) {
    setCurrentUser(user);

    // For now:
    // Login/Register -> Home
    //
    // Later we will change registration to:
    // Register
    // -> Age
    // -> Height
    // -> Weight
    // -> Goal
    // -> Welcome Complete
    // -> Home

    setScreen('home');
  }

  // ========================================
  // GOOGLE BUTTON
  // ========================================

  function handleGoogle() {
    Alert.alert(
      'Google Sign In',
      'Google authentication will be connected using the Android development build.'
    );
  }

  // ========================================
  // WELCOME
  // ========================================

  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onStart={() =>
          setScreen('login')
        }
      />
    );
  }

  // ========================================
  // LOGIN
  // ========================================

  if (screen === 'login') {
    return (
      <LoginScreen
        onBack={() =>
          setScreen('welcome')
        }
        onRegister={() =>
          setScreen('register')
        }
        onGoogle={handleGoogle}
        onSuccess={
          handleAuthSuccess
        }
      />
    );
  }

  // ========================================
  // REGISTER
  // ========================================

  if (screen === 'register') {
    return (
      <RegisterScreen
        onBack={() =>
          setScreen('login')
        }
        onLogin={() =>
          setScreen('login')
        }
        onGoogle={handleGoogle}
        onSuccess={
          handleAuthSuccess
        }
      />
    );
  }

  // ========================================
  // HOME
  // ========================================

  return (
    <HomeScreen
      user={currentUser}
    />
  );
}

// ==========================================
// HOME SCREEN STYLES
// ==========================================

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
      paddingHorizontal: 24,
      paddingTop: 24,
    },

    title: {
      fontSize: 34,
      fontWeight: '800',
      color: '#079455',
      letterSpacing: -1,
    },

    subtitle: {
      fontSize: 15,
      color: '#64748B',
      marginTop: 3,
      marginBottom: 24,
    },

    userCard: {
      backgroundColor: '#EAF8EF',
      borderRadius: 16,
      padding: 16,
      marginBottom: 25,
      borderWidth: 1,
      borderColor: '#D3F0DE',
    },

    welcomeText: {
      color: '#166534',
      fontSize: 14,
      fontWeight: '700',
    },

    userEmail: {
      color: '#475467',
      fontSize: 13,
      marginTop: 4,
    },

    heading: {
      fontSize: 22,
      fontWeight: '800',
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

      shadowColor: '#101828',

      shadowOffset: {
        width: 0,
        height: 3,
      },

      shadowOpacity: 0.06,
      shadowRadius: 8,

      elevation: 2,
    },

    workoutTitle: {
      fontSize: 18,
      fontWeight: '700',
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
      fontWeight: '700',
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
