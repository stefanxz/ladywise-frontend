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
  StoredAuthData,
} from "@/lib/auth"; // <-- Your storage file
import { setAuthToken } from "@/lib/api"; // <-- Your API file

type AuthContextType = {
  isLoading: boolean;
  token: string | null;
  userId: string | null;
  signIn: (token: string, userId: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  token: null,
  userId: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setTokenState] = useState<string | null>(null);
  const [userId, setUserIdState] = useState<string | null>(null);

  // Check storage when the app loads
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const data = await getAuthData();

        // Check if we have a token and if it hasn't expired yet
        if (data.token && isTokenValid(data) === "VALID") {
          // 1. Update React state
          setTokenState(data.token);
          setUserIdState(data.userId);
          // 2. Configure Axios to use this token for future requests
          setAuthToken(data.token);
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
      // 1. Save to secure storage
      await storeAuthData(newToken, newUserId, newEmail);
      // 2. Update React state
      setTokenState(newToken);
      setUserIdState(newUserId);
      // 3. Configure Axios
      setAuthToken(newToken);
    },
    []
  );

  const signOut = useCallback(async () => {
    // 1. Clear secure storage
    await clearAuthData();
    // 2. Clear React state
    setTokenState(null);
    setUserIdState(null);
    // 3. Clear Axios token
    setAuthToken(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        token,
        userId,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}