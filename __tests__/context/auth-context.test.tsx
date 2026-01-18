import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import * as authLib from "@/lib/auth";
import * as apiLib from "@/lib/api";

jest.mock("@/lib/auth", () => ({
  getAuthData: jest.fn(),
  storeAuthData: jest.fn(),
  clearAuthData: jest.fn(),
  isTokenValid: jest.fn(),
}));

jest.mock("@/lib/api", () => ({
  setAuthToken: jest.fn(),
}));

describe("AuthContext", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Initialization (useEffect)", () => {
    it("loads valid user session on mount", async () => {
      // mocking successful data retrieval.
      (authLib.getAuthData as jest.Mock).mockResolvedValue({
        token: "stored-token",
        userId: "user-123",
        email: "test@test.com",
      });
      (authLib.isTokenValid as jest.Mock).mockReturnValue("VALID");

      const { result } = renderHook(() => useAuth(), { wrapper });

      // waiting for useEffect to finish
      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.token).toBe("stored-token");
      expect(result.current.userId).toBe("user-123");
      expect(result.current.email).toBe("test@test.com");
      expect(apiLib.setAuthToken).toHaveBeenCalledWith("stored-token");
    });

    it("logs out if stored token is invalid/expired", async () => {
      (authLib.getAuthData as jest.Mock).mockResolvedValue({
        token: "expired-token",
        userId: "user-123",
      });
      (authLib.isTokenValid as jest.Mock).mockReturnValue("EXPIRED");

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.token).toBeNull();
      expect(authLib.clearAuthData).toHaveBeenCalled();
      expect(apiLib.setAuthToken).toHaveBeenCalledWith(null);
    });

    it("handles storage errors gracefully", async () => {
      (authLib.getAuthData as jest.Mock).mockRejectedValue(
        new Error("Storage fail"),
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => expect(result.current.isLoading).toBe(false));
      expect(result.current.token).toBeNull();
    });
  });

  describe("signIn", () => {
    it("stores data and updates state", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.signIn("new-token", "new-user", "new@test.com");
      });

      expect(authLib.storeAuthData).toHaveBeenCalledWith(
        "new-token",
        "new-user",
        "new@test.com",
      );
      expect(apiLib.setAuthToken).toHaveBeenCalledWith("new-token");
      expect(result.current.token).toBe("new-token");
      expect(result.current.userId).toBe("new-user");
    });
  });

  describe("signOut", () => {
    it("clears data and resets state", async () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

      // logging in first to set state
      await act(async () => {
        await result.current.signIn("t", "u", "e");
      });

      // logging out
      await act(async () => {
        await result.current.signOut();
      });

      expect(authLib.clearAuthData).toHaveBeenCalled();
      expect(apiLib.setAuthToken).toHaveBeenCalledWith(null);
      expect(result.current.token).toBeNull();
      expect(result.current.userId).toBeNull();
    });
  });
});
