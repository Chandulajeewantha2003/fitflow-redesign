
import React from 'react';

import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context';

import Svg, {
    Circle,
    Ellipse,
    Path,
    Rect,
} from 'react-native-svg';

type WelcomeScreenProps = {
    onStart: () => void;
};

function FitnessIllustration() {
    return (
        <Svg
            width="100%"
            height={310}
            viewBox="0 0 340 310"
        >
            {/* Soft background shape */}
            <Ellipse
                cx="170"
                cy="177"
                rx="132"
                ry="115"
                fill="#E4F8EB"
            />

            {/* Decorative leaves */}
            <Path
                d="M58 245 C22 215 39 181 58 205 C78 225 76 241 58 245Z"
                fill="#91D6AE"
            />
            <Path
                d="M70 251 C52 215 78 188 86 217 C93 238 82 248 70 251Z"
                fill="#B8E8C9"
            />
            <Path
                d="M268 252 C299 209 318 218 304 243 C294 259 279 260 268 252Z"
                fill="#90D6AC"
            />
            <Path
                d="M262 260 C265 220 288 208 291 234 C292 254 274 262 262 260Z"
                fill="#B8E8C9"
            />

            {/* Legs */}
            <Path
                d="M139 210 L164 210 L158 279 L136 279Z"
                fill="#263548"
            />
            <Path
                d="M169 210 L194 210 L204 278 L181 278Z"
                fill="#263548"
            />

            {/* Shoes */}
            <Path
                d="M135 275 L158 275 L157 288 L128 288 Q124 281 135 275Z"
                fill="#142334"
            />
            <Path
                d="M182 275 L204 275 L215 287 L180 287Z"
                fill="#142334"
            />

            {/* Left arm resting on waist */}
            <Path
                d="M133 127 C105 139 102 176 110 197 L126 203 L135 188 L125 178 L149 153Z"
                fill="#E9A578"
            />

            {/* Raised right arm */}
            <Path
                d="M198 130 L220 139 L245 91 L231 80 L202 107Z"
                fill="#E9A578"
            />

            {/* Raised fist */}
            <Rect
                x="228"
                y="55"
                width="25"
                height="32"
                rx="9"
                fill="#E9A578"
                transform="rotate(-13 240 71)"
            />

            {/* Green fitness shirt */}
            <Path
                d="M145 124 L164 112 L184 113 L205 125 L224 145 L207 165 L194 155 L196 217 L133 217 L137 156 L122 165 L105 145 L126 125Z"
                fill="#079455"
            />

            {/* Shirt details */}
            <Path
                d="M145 124 L162 137 L184 114"
                fill="none"
                stroke="#067647"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <Path
                d="M137 157 L133 211"
                fill="none"
                stroke="#067647"
                strokeWidth="3"
                strokeLinecap="round"
            />

            {/* Neck */}
            <Rect
                x="158"
                y="100"
                width="24"
                height="27"
                rx="10"
                fill="#E9A578"
            />

            {/* Head */}
            <Ellipse
                cx="171"
                cy="82"
                rx="32"
                ry="38"
                fill="#F0B68C"
            />

            {/* Hair */}
            <Path
                d="M140 84 C132 50 152 39 169 45 C190 34 205 55 199 83 L190 77 L184 60 C176 76 153 77 140 84Z"
                fill="#203246"
            />

            {/* Hair detail */}
            <Path
                d="M146 57 C159 39 182 45 189 55"
                fill="none"
                stroke="#203246"
                strokeWidth="11"
                strokeLinecap="round"
            />

            {/* Face */}
            <Circle cx="160" cy="86" r="2" fill="#263548" />
            <Circle cx="181" cy="86" r="2" fill="#263548" />
            <Path
                d="M163 99 Q171 106 179 99"
                fill="none"
                stroke="#A55443"
                strokeWidth="2.5"
                strokeLinecap="round"
            />

            {/* Ground */}
            <Ellipse
                cx="170"
                cy="290"
                rx="89"
                ry="6"
                fill="#CBECD8"
            />
        </Svg>
    );
}

export default function WelcomeScreen({
    onStart,
}: WelcomeScreenProps) {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.content}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>
                            Fit<Text style={styles.logoAccent}>Flow</Text>
                        </Text>

                        <Pressable
                            onPress={onStart}
                            hitSlop={12}
                            accessibilityRole="button"
                            accessibilityLabel="Skip welcome and go to home"
                        >
                            <Text style={styles.skip}>Skip</Text>
                        </Pressable>
                    </View>

                    {/* Hero illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.illustrationGlow} />

                        <FitnessIllustration />

                        <View style={styles.floatingBadge}>
                            <Text style={styles.badgeEmoji}>💪</Text>
                            <Text style={styles.badgeText}>
                                Stronger every day
                            </Text>
                        </View>
                    </View>

                    {/* Welcome content */}
                    <View style={styles.textContainer}>
                        <View style={styles.smallLabel}>
                            <Text style={styles.smallLabelText}>
                                YOUR FITNESS JOURNEY STARTS HERE Test Chandula
                            </Text>
                        </View>

                        <Text style={styles.title}>
                            Welcome to{'\n'}
                            <Text style={styles.titleAccent}>
                                FitFlow!
                            </Text>
                        </Text>

                        <Text style={styles.description}>
                            Your personal AI-powered fitness companion.
                            Let's build a stronger, healthier you together.
                        </Text>
                    </View>

                    {/* Bottom actions */}
                    <View style={styles.bottomContainer}>
                        <View style={styles.pagination}>
                            <View style={[styles.dot, styles.activeDot]} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                            <View style={styles.dot} />
                        </View>

                        <Pressable
                            style={({ pressed }) => [
                                styles.startButton,
                                pressed && styles.startButtonPressed,
                            ]}
                            onPress={onStart}
                            accessibilityRole="button"
                            accessibilityLabel="Start FitFlow"
                        >
                            <Text style={styles.startButtonText}>
                                Start
                            </Text>
                            <Text style={styles.arrow}>→</Text>
                        </Pressable>

                        <Text style={styles.footerText}>
                            Small steps. Big progress.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    content: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
    },

    logo: {
        color: '#123B2A',
        fontSize: 25,
        fontWeight: '800',
        letterSpacing: -1,
    },

    logoAccent: {
        color: '#079455',
    },

    skip: {
        color: '#079455',
        fontSize: 14,
        fontWeight: '700',
    },

    illustrationContainer: {
        height: 345,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12,
        position: 'relative',
    },

    illustrationGlow: {
        position: 'absolute',
        width: 280,
        height: 280,
        backgroundColor: '#F1FCF5',
        borderRadius: 140,
    },

    floatingBadge: {
        position: 'absolute',
        right: 0,
        bottom: 27,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E3F2E9',
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        shadowColor: '#153C29',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },

    badgeEmoji: {
        fontSize: 15,
    },

    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#164B32',
    },

    textContainer: {
        alignItems: 'center',
        marginTop: 5,
    },

    smallLabel: {
        backgroundColor: '#EAF8EF',
        paddingHorizontal: 13,
        paddingVertical: 7,
        borderRadius: 20,
        marginBottom: 19,
    },

    smallLabelText: {
        color: '#078446',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },

    title: {
        textAlign: 'center',
        fontSize: 39,
        lineHeight: 45,
        letterSpacing: -1.5,
        fontWeight: '800',
        color: '#17202A',
    },

    titleAccent: {
        color: '#079455',
    },

    description: {
        maxWidth: 310,
        textAlign: 'center',
        color: '#667085',
        fontSize: 15,
        lineHeight: 24,
        marginTop: 16,
    },

    bottomContainer: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingTop: 35,
    },

    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        marginBottom: 29,
    },

    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#D6DFDB',
    },

    activeDot: {
        backgroundColor: '#079455',
        width: 24,
    },

    startButton: {
        backgroundColor: '#079455',
        borderRadius: 15,
        minHeight: 58,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#079455',
        shadowOffset: {
            width: 0,
            height: 7,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },

    startButtonPressed: {
        opacity: 0.85,
    },

    startButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '800',
    },

    arrow: {
        color: '#FFFFFF',
        position: 'absolute',
        right: 23,
        fontSize: 24,
    },

    footerText: {
        fontSize: 12,
        color: '#98A2B3',
        marginTop: 16,
    },
});