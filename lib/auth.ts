import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";
const USER_ID_KEY = "userId";
const EMAIL_KEY = "userEmail";

export async function storeAuthData(token: string, userId: string, email: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_ID_KEY, userId);
    await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function getAuthData(): Promise<{ token: string; userId: string; email: string } | null> {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    const userId = await SecureStore.getItemAsync(USER_ID_KEY);
    const email = await SecureStore.getItemAsync(EMAIL_KEY);

    if (token && userId && email) {
        return { token, userId, email };
    }
    return null;
}

export async function clearAuthData(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_ID_KEY);
    await SecureStore.deleteItemAsync(EMAIL_KEY);
}
