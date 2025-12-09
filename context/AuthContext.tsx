import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  getAuthData,
  storeAuthData,
  clearAuthData,
  isTokenValid,
} from "@/lib/auth";
import { setAuthToken } from "@/lib/api";

type AuthContextType = {
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  email: string | null;
  signIn: (token: string, userId: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

/**
 * Authentication context
 *
 * Provides authentication state and methods throughout the application. Should
 * not be used directly: use the `useAuth()` hook.
 */
const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  token: null,
  userId: null,
  email: null,
  signIn: async () => {},
  signOut: async () => {},
});

/**
 * Custom hook to access authentication context.
 *
 * @example
 * ```tsx
 * const { isLoading, token, userId } = useAuth();
 *
 * if (isLoading) return <Loading />;
 * ```
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Authentication provider
 *
 * Manages authentication across the application, including loading auth data
 * from secure storage on mount, validating token expiry, persisting auth state
 * across app restarts, and configuring API client with auth tokens.
 *
 * @param children
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // Check storage when the app loads
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const data = await getAuthData();

        // Check if we have a token and if it hasn't expired yet
        if (data.token && isTokenValid(data) === "VALID") {
          setTokenState(data.token);
          setUserIdState(data.userId);
          setAuthToken(data.token);
          setEmail(data.email);
        } else {
          // Token is missing or expired, clean up
          await signOut();
        }
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const signIn = useCallback(
    async (newToken: string, newUserId: string, newEmail: string) => {
      await storeAuthData(newToken, newUserId, newEmail);
      setTokenState(newToken);
      setUserIdState(newUserId);
      setAuthToken(newToken);
      setEmail(newEmail);
    },
    [],
  );

  const signOut = useCallback(async () => {
    await clearAuthData();
    setTokenState(null);
    setUserIdState(null);
    setAuthToken(null);
    setEmail(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        token,
        userId,
        email,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
