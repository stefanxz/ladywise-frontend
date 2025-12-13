import { deleteCurrentUser } from "@/lib/api";

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

describe("deleteCurrentUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.create.mockReturnValue(mockApi);
  });

  it("should successfully delete the current user account", async () => {
    mockApi.delete.mockResolvedValue({ status: 204, data: undefined });

    await expect(deleteCurrentUser()).resolves.toBeUndefined();
    expect(mockApi.delete).toHaveBeenCalledWith("/api/users/me");
    expect(mockApi.delete).toHaveBeenCalledTimes(1);
  });

  it("should reject when user is not authenticated", async () => {
    const mockError = new Error("Authentication required");
    (mockError as any).response = {
      status: 401,
      data: {
        message: "Authentication required",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(mockError);

    await expect(deleteCurrentUser()).rejects.toThrow(
      "Authentication required",
    );
    expect(mockApi.delete).toHaveBeenCalledWith("/api/users/me");
  });

  it("should reject when user is not found (404)", async () => {
    const mockError = new Error("User not found");
    (mockError as any).response = {
      status: 404,
      data: {
        message: "User not found",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(mockError);

    await expect(deleteCurrentUser()).rejects.toThrow("User not found");
  });

  it("should handle network errors gracefully", async () => {
    const networkError = new Error("Network Error");
    (networkError as any).response = undefined;

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(networkError);

    await expect(deleteCurrentUser()).rejects.toThrow("Network Error");
  });

  it("should handle server errors (500)", async () => {
    const mockError = new Error("Internal server error");
    (mockError as any).response = {
      status: 500,
      data: {
        message: "Internal server error",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(mockError);

    await expect(deleteCurrentUser()).rejects.toThrow("Internal server error");
  });

  it("should handle timeout errors", async () => {
    const timeoutError = new Error("timeout of 10000ms exceeded");
    (timeoutError as any).code = "ECONNABORTED";

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(timeoutError);

    await expect(deleteCurrentUser()).rejects.toThrow(
      "timeout of 10000ms exceeded",
    );
  });

  it("should handle forbidden access (403)", async () => {
    const mockError = new Error("Insufficient permissions");
    (mockError as any).response = {
      status: 403,
      data: {
        message: "Insufficient permissions",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(mockError);

    await expect(deleteCurrentUser()).rejects.toThrow(
      "Insufficient permissions",
    );
  });

  it("should handle malformed authorization token", async () => {
    const mockError = new Error("Invalid authorization token");
    (mockError as any).response = {
      status: 401,
      data: {
        message: "Invalid authorization token",
      },
    };

    mockAxios.isAxiosError.mockReturnValue(true);
    mockApi.delete.mockRejectedValue(mockError);

    await expect(deleteCurrentUser()).rejects.toThrow(
      "Invalid authorization token",
    );
  });
});
