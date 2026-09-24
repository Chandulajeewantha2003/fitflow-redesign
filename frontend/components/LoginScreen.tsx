import React, { useState } from 'react';

import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    Ionicons,
} from '@expo/vector-icons';

import {
    AuthUser,
    loginUser,
    saveSession,
} from '../services/auth';

type Props = {
    onBack: () => void;
    onRegister: () => void;
    onSuccess: (user: AuthUser) => void;
    onGoogle: () => void;
};

export default function LoginScreen({
    onBack,
    onRegister,
    onSuccess,
    onGoogle,
}: Props) {
    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState('');

    async function handleLogin() {
        try {
            setError('');

            if (
                !email.trim() ||
                !password
            ) {
                setError(
                    'Please enter your email and password.'
                );
                return;
            }

            setLoading(true);

            const result =
                await loginUser(
                    email.trim(),
                    password
                );

            await saveSession(result);

            onSuccess(result.user);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Login failed.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : undefined
                }
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={
                        styles.content
                    }
                >
                    <Pressable
                        onPress={onBack}
                        style={styles.backButton}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={27}
                            color="#17202A"
                        />
                    </Pressable>

                    <View style={styles.brandRow}>
                        <View style={styles.logoMark}>
                            <Ionicons
                                name="fitness"
                                size={23}
                                color="#FFFFFF"
                            />
                        </View>

                        <Text style={styles.logo}>
                            Fit
                            <Text
                                style={styles.logoAccent}
                            >
                                Flow
                            </Text>
                        </Text>
                    </View>

                    <Text style={styles.title}>
                        Welcome back
                    </Text>

                    <Text style={styles.subtitle}>
                        Sign in to continue your
                        FitFlow journey.
                    </Text>

                    <Text style={styles.label}>
                        Email address
                    </Text>

                    <View style={styles.inputBox}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#98A2B3"
                        />

                        <TextInput
                            value={email}
                            onChangeText={setEmail}
                            placeholder="name@example.com"
                            placeholderTextColor="#98A2B3"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            style={styles.input}
                        />
                    </View>

                    <Text style={styles.label}>
                        Password
                    </Text>

                    <View style={styles.inputBox}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#98A2B3"
                        />

                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            placeholderTextColor="#98A2B3"
                            secureTextEntry={
                                !showPassword
                            }
                            style={styles.input}
                        />

                        <Pressable
                            onPress={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                        >
                            <Ionicons
                                name={
                                    showPassword
                                        ? 'eye-off-outline'
                                        : 'eye-outline'
                                }
                                size={21}
                                color="#667085"
                            />
                        </Pressable>
                    </View>

                    <Pressable
                        style={
                            styles.forgotButton
                        }
                    >
                        <Text
                            style={styles.forgotText}
                        >
                            Forgot Password?
                        </Text>
                    </Pressable>

                    {error ? (
                        <View style={styles.errorBox}>
                            <Ionicons
                                name="alert-circle-outline"
                                size={18}
                                color="#D92D20"
                            />

                            <Text style={styles.errorText}>
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    <Pressable
                        disabled={loading}
                        onPress={handleLogin}
                        style={({ pressed }) => [
                            styles.primaryButton,
                            pressed &&
                            styles.buttonPressed,
                            loading &&
                            styles.buttonDisabled,
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                            />
                        ) : (
                            <>
                                <Text
                                    style={
                                        styles.primaryButtonText
                                    }
                                >
                                    Sign In
                                </Text>

                                <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color="#FFFFFF"
                                />
                            </>
                        )}
                    </Pressable>

                    <View style={styles.divider}>
                        <View style={styles.line} />

                        <Text
                            style={styles.dividerText}
                        >
                            or continue with
                        </Text>

                        <View style={styles.line} />
                    </View>

                    <Pressable
                        onPress={onGoogle}
                        style={styles.googleButton}
                    >
                        <View
                            style={
                                styles.googleIconCircle
                            }
                        >
                            <Text
                                style={styles.googleIcon}
                            >
                                G
                            </Text>
                        </View>

                        <Text
                            style={styles.googleText}
                        >
                            Continue with Google
                        </Text>
                    </Pressable>

                    <View style={styles.footer}>
                        <Text
                            style={styles.footerText}
                        >
                            Don't have an account?
                        </Text>

                        <Pressable
                            onPress={onRegister}
                        >
                            <Text
                                style={styles.footerLink}
                            >
                                Create Account
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 25,
        paddingTop: 8,
        paddingBottom: 35,
    },

    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        marginLeft: -8,
        marginBottom: 8,
    },

    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },

    logoMark: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#079455',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 9,
    },

    logo: {
        fontSize: 25,
        fontWeight: '800',
        color: '#18392A',
        letterSpacing: -1,
    },

    logoAccent: {
        color: '#079455',
    },

    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#101828',
        letterSpacing: -0.8,
    },

    subtitle: {
        color: '#667085',
        fontSize: 15,
        lineHeight: 23,
        marginTop: 8,
        marginBottom: 31,
    },

    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#344054',
        marginBottom: 8,
    },

    inputBox: {
        minHeight: 56,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 14,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 19,
    },

    input: {
        flex: 1,
        fontSize: 15,
        color: '#101828',
        marginLeft: 11,
    },

    forgotButton: {
        alignSelf: 'flex-end',
        marginTop: -7,
        marginBottom: 24,
    },

    forgotText: {
        color: '#079455',
        fontSize: 13,
        fontWeight: '700',
    },

    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3F2',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        gap: 8,
    },

    errorText: {
        flex: 1,
        color: '#D92D20',
        fontSize: 13,
    },

    primaryButton: {
        minHeight: 57,
        borderRadius: 14,
        backgroundColor: '#079455',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        shadowColor: '#079455',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.18,
        shadowRadius: 12,
        elevation: 3,
    },

    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    buttonPressed: {
        opacity: 0.88,
    },

    buttonDisabled: {
        opacity: 0.65,
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 28,
    },

    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#EAECF0',
    },

    dividerText: {
        fontSize: 12,
        color: '#98A2B3',
        marginHorizontal: 12,
    },

    googleButton: {
        minHeight: 56,
        borderWidth: 1,
        borderColor: '#D0D5DD',
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    googleIconCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 11,
    },

    googleIcon: {
        fontSize: 19,
        fontWeight: '900',
        color: '#4285F4',
    },

    googleText: {
        color: '#101828',
        fontSize: 15,
        fontWeight: '700',
    },

    footer: {
        marginTop: 32,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
    },

    footerText: {
        color: '#667085',
        fontSize: 14,
    },

    footerLink: {
        color: '#079455',
        fontSize: 14,
        fontWeight: '800',
    },
});