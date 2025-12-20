import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useHealthRealtime } from "@/hooks/useHealthRealtime";
import { Client } from "@stomp/stompjs";

// 1. Mock External Dependencies
jest.mock("sockjs-client", () => {
  return jest.fn().mockImplementation(() => ({}));
});

jest.mock("@stomp/stompjs", () => {
  return {
    Client: jest.fn(),
  };
});

// Polyfill TextEncoder for Jest environment if needed
if (typeof global.TextEncoder === "undefined") {
  const { TextEncoder } = require("util");
  global.TextEncoder = TextEncoder;
}

describe("useHealthRealtime Hook", () => {
  const mockUserId = "user-123";
  const mockToken = "auth-token-xyz";

  let mockActivate: jest.Mock;
  let mockDeactivate: jest.Mock;
  let mockSubscribe: jest.Mock;
  // We'll capture the 'onConnect' function assigned by the hook here
  let capturedOnConnect: (() => void) | undefined;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnConnect = undefined;

    mockActivate = jest.fn();
    mockDeactivate = jest.fn();
    mockSubscribe = jest.fn();

    // Setup the Client mock to capture the onConnect assignment
    (Client as unknown as jest.Mock).mockImplementation(() => {
      const clientInstance: any = {
        activate: mockActivate,
        deactivate: mockDeactivate,
        subscribe: mockSubscribe,
        active: true, // Added to satisfy the hook's cleanup check
      };

      // Define a setter for onConnect to capture it when the hook writes to it
      Object.defineProperty(clientInstance, "onConnect", {
        set: (fn) => {
          capturedOnConnect = fn;
        },
        get: () => capturedOnConnect,
      });

      return clientInstance;
    });
  });

  it("should not activate client if userId or token is missing", () => {
    renderHook(() => useHealthRealtime(null, null));
    expect(Client).not.toHaveBeenCalled();

    renderHook(() => useHealthRealtime("user", null));
    expect(Client).not.toHaveBeenCalled();
  });

  it("should initialize and activate client when auth is provided", () => {
    renderHook(() => useHealthRealtime(mockUserId, mockToken));

    expect(Client).toHaveBeenCalledTimes(1);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  it("should subscribe to channels and update state on message receipt", async () => {
    const { result } = renderHook(() =>
      useHealthRealtime(mockUserId, mockToken)
    );

    // 1. Verify initial state
    expect(result.current.isConnected).toBe(false);
    expect(result.current.realtimeRisks).toBeNull();

    // 2. Simulate Connection Event
    // We wrapped this in act because it triggers state updates (setIsConnected)
    act(() => {
      if (capturedOnConnect) capturedOnConnect();
    });

    expect(result.current.isConnected).toBe(true);

    // 3. Verify Subscriptions were made
    // The hook subscribes to 3 topics. Let's find the callback for risks.
    expect(mockSubscribe).toHaveBeenCalledWith(
      `/topic/risks/${mockUserId}`,
      expect.any(Function)
    );

    // 4. Simulate Incoming Risk Data
    // Extract the callback function passed to .subscribe for the risks topic
    const riskCallback = mockSubscribe.mock.calls.find(
      (call) => call[0] === `/topic/risks/${mockUserId}`
    )[1];

    const mockRiskPayload = {
      anemia: { risk: "High", key_inputs: [], summary_sentence: "Bad." },
      thrombosis: { risk: "Low", key_inputs: [], summary_sentence: "Good." },
    };

    // Execute the callback with a mock STOMP message
    act(() => {
      riskCallback({ body: JSON.stringify(mockRiskPayload) });
    });

    // 5. Verify State Update
    expect(result.current.realtimeRisks).toEqual(mockRiskPayload);
  });

  it("should update trend state when trend messages arrive", () => {
    const { result } = renderHook(() =>
      useHealthRealtime(mockUserId, mockToken)
    );

    // Connect
    act(() => {
      if (capturedOnConnect) capturedOnConnect();
    });

    // Find the anemia subscription callback
    const anemiaCallback = mockSubscribe.mock.calls.find(
      (call) => call[0] === `/topic/insights/anemia/${mockUserId}`
    )[1];

    const mockTrend = {
      trend: "worsening",
      description: "Iron levels dropping.",
    };

    // Simulate Message
    act(() => {
      anemiaCallback({ body: JSON.stringify(mockTrend) });
    });

    expect(result.current.anemiaTrend).toEqual(mockTrend);
  });

  it("should deactivate client on unmount", () => {
    const { unmount } = renderHook(() =>
      useHealthRealtime(mockUserId, mockToken)
    );

    unmount();

    expect(mockDeactivate).toHaveBeenCalledTimes(1);
  });
});
