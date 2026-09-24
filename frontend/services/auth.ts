import * as SecureStore from 'expo-secure-store';
import { apiRequest } from './api';

export type AuthUser = {
    id: string;
    email: string;
    name?: string;
    photo?: string;
    providers: string[];
    onboardingCompleted: boolean;
};

export type AuthResponse = {
    accessToken: string;
    user: AuthUser;
};

async function authRequest(
    endpoint: string,
    body: object
): Promise<AuthResponse> {
    const response = await apiRequest(
        endpoint,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        let message = 'Something went wrong';

        if (Array.isArray(data.message)) {
            message = data.message.join(', ');
        } else if (data.message) {
            message = data.message;
        }

        throw new Error(message);
    }

    return data;
}

export async function registerUser(
    email: string,
    password: string
) {
    return authRequest('/auth/register', {
        email,
        password,
    });
}

export async function loginUser(
    email: string,
    password: string
) {
    return authRequest('/auth/login', {
        email,
        password,
    });
}

export async function saveSession(
    response: AuthResponse
) {
    await SecureStore.setItemAsync(
        'fitflow_token',
        response.accessToken
    );

    await SecureStore.setItemAsync(
        'fitflow_user',
        JSON.stringify(response.user)
    );
}

export async function getStoredUser() {
    const value =
        await SecureStore.getItemAsync(
            'fitflow_user'
        );

    if (!value) {
        return null;
    }

    return JSON.parse(value) as AuthUser;
}

export async function logoutUser() {
    await SecureStore.deleteItemAsync(
        'fitflow_token'
    );

    await SecureStore.deleteItemAsync(
        'fitflow_user'
    );
}
