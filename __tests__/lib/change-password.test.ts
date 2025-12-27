import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "@/lib/types/payloads";
import { changePassword } from "@/lib/api";

jest.mock("axios", () => {
  const mockInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };

  return {
    __esModule: true,
    default: {
      create: jest.fn(() => mockInstance),
      isAxiosError: jest.fn(),
    },
    create: jest.fn(() => mockInstance),
    isAxiosError: jest.fn(),
  };
});

const mockAxios = require("axios").default;
const mockApi = mockAxios.create();

describe("changePassword", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.create.mockReturnValue(mockApi);
  });

  it("should successfully change password with valid credentials", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "newSecurePassword456",
    };

    const mockResponse: ChangePasswordResponse = {
      changedAt: "2024-12-13T10:30:00.000Z",
    };

    mockApi.post.mockResolvedValue({ data: mockResponse });

    const result = await changePassword(payload);

    expect(result).toEqual(mockResponse);
    expect(mockApi.post).toHaveBeenCalledWith(
      "/api/auth/change-password",
      payload,
    );
    expect(mockApi.post).toHaveBeenCalledTimes(1);
  });

  it("should reject when current password is incorrect", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "wrongPassword",
      newPassword: "newPassword123",
    };

    const mockError = new Error("Current password is incorrect");
    (mockError as any).response = {
      status: 401,
      data: {
        message: "Current password is incorrect",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(mockError);

    await expect(changePassword(payload)).rejects.toThrow(
      "Current password is incorrect",
    );
    expect(mockApi.post).toHaveBeenCalledWith(
      "/api/auth/change-password",
      payload,
    );
  });

  it("should reject when new password does not meet requirements", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "weak",
    };

    const mockError = new Error(
      "New password does not meet security requirements",
    );
    (mockError as any).response = {
      status: 400,
      data: {
        message: "New password does not meet security requirements",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(mockError);

    await expect(changePassword(payload)).rejects.toThrow(
      "New password does not meet security requirements",
    );
  });

  it("should reject when new password is the same as current password", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "samePassword123",
      newPassword: "samePassword123",
    };

    const mockError = new Error(
      "New password must be different from current password",
    );
    (mockError as any).response = {
      status: 400,
      data: {
        message: "New password must be different from current password",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(mockError);

    await expect(changePassword(payload)).rejects.toThrow(
      "New password must be different from current password",
    );
  });

  it("should reject when user is not authenticated", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    };

    const mockError = new Error("Authentication required");
    (mockError as any).response = {
      status: 401,
      data: {
        message: "Authentication required",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(mockError);

    await expect(changePassword(payload)).rejects.toThrow(
      "Authentication required",
    );
  });

  it("should handle network errors gracefully", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    };

    const networkError = new Error("Network Error");
    (networkError as any).response = undefined;

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(networkError);

    await expect(changePassword(payload)).rejects.toThrow("Network Error");
  });

  it("should handle server errors (500)", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    };

    const mockError = new Error("Internal server error");
    (mockError as any).response = {
      status: 500,
      data: {
        message: "Internal server error",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(mockError);

    await expect(changePassword(payload)).rejects.toThrow(
      "Internal server error",
    );
  });

  it("should handle timeout errors", async () => {
    const payload: ChangePasswordPayload = {
      currentPassword: "oldPassword123",
      newPassword: "newPassword456",
    };

    const timeoutError = new Error("timeout of 10000ms exceeded");
    (timeoutError as any).code = "ECONNABORTED";

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.post.mockRejectedValue(timeoutError);

    await expect(changePassword(payload)).rejects.toThrow(
      "timeout of 10000ms exceeded",
    );
  });
});
