import { renderHook, act } from "@testing-library/react-native";
import { useHealthRealtime } from "@/hooks/useHealthRealtime";
import { Client } from "@stomp/stompjs";

// mock external dependencies
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
  
  // Captures for internal client handlers
  let capturedOnConnect: (() => void) | undefined;
  let capturedOnStompError: ((frame: any) => void) | undefined;

  // Spy on console to verify debug/error logs
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedOnConnect = undefined;
    capturedOnStompError = undefined;

    mockActivate = jest.fn();
    mockDeactivate = jest.fn();
    mockSubscribe = jest.fn();

    // Mock console to keep test output clean and verify logging logic
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    // Setup the Client mock
    (Client as unknown as jest.Mock).mockImplementation((config) => {
      const clientInstance: any = {
        activate: mockActivate,
        deactivate: mockDeactivate,
        subscribe: mockSubscribe,
        active: true,
        // Expose the config passed to constructor so we can test 'debug' function
        _config: config, 
      };

      // Capture onConnect
      Object.defineProperty(clientInstance, "onConnect", {
        set: (fn) => { capturedOnConnect = fn; },
        get: () => capturedOnConnect,
      });

      // Capture onStompError
      Object.defineProperty(clientInstance, "onStompError", {
        set: (fn) => { capturedOnStompError = fn; },
        get: () => capturedOnStompError,
      });

      return clientInstance;
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("should initialize and activate client when auth is provided", () => {
    renderHook(() => useHealthRealtime(mockUserId, mockToken));
    expect(Client).toHaveBeenCalledTimes(1);
    expect(mockActivate).toHaveBeenCalledTimes(1);
  });

  it("should handle Thrombosis trend updates specifically", () => {
    const { result } = renderHook(() => useHealthRealtime(mockUserId, mockToken));

    // Connect
    act(() => {
      if (capturedOnConnect) capturedOnConnect();
    });

    // Find subscription for thrombosis
    const thrombosisTopic = `/topic/insights/thrombosis/${mockUserId}`;
    const thrombosisCallback = mockSubscribe.mock.calls.find(
      (call) => call[0] === thrombosisTopic
    )[1];

    expect(thrombosisCallback).toBeDefined();

    const mockTrend = { trend: "improving", description: "Clot risk lower" };

    // Trigger update
    act(() => {
      thrombosisCallback({ body: JSON.stringify(mockTrend) });
    });

    expect(result.current.thrombosisTrend).toEqual(mockTrend);
  });

  it("should safely ignore messages with empty bodies", () => {
    const { result } = renderHook(() => useHealthRealtime(mockUserId, mockToken));

    act(() => {
      if (capturedOnConnect) capturedOnConnect();
    });

    const riskCallback = mockSubscribe.mock.calls.find(
      (call) => call[0] === `/topic/risks/${mockUserId}`
    )[1];

    // Trigger update with NO body (simulate empty frame)
    act(() => {
      riskCallback({ body: null });
    });

    // State should remain null
    expect(result.current.realtimeRisks).toBeNull();
  });

  it("should handle STOMP broker errors", () => {
    renderHook(() => useHealthRealtime(mockUserId, mockToken));

    const errorFrame = {
      headers: { message: "Invalid Sub" },
      body: "Subscription ID missing",
    };

    // Simulate the error event
    act(() => {
      if (capturedOnStompError) capturedOnStompError(errorFrame);
    });

    // Verify console.error was called (covering the onStompError function)
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "❌ STOMP Broker Error:", 
      "Invalid Sub"
    );
  });

  it("should filter heartbeat logs in debug configuration", () => {
    renderHook(() => useHealthRealtime(mockUserId, mockToken));

    // Access the config passed to the Client constructor
    const clientConstructorCall = (Client as unknown as jest.Mock).mock.calls[0][0];
    const debugFn = clientConstructorCall.debug;

    // Test 1: PING - should be ignored
    debugFn("<<< PING");
    expect(consoleLogSpy).not.toHaveBeenCalledWith("[STOMP Internal]:", expect.stringContaining("PING"));

    // Test 2: actual message - should be logged
    debugFn("Connected to Broker");
    expect(consoleLogSpy).toHaveBeenCalledWith("[STOMP Internal]:", "Connected to Broker");
  });

  it("should deactivate client on unmount", () => {
    const { unmount } = renderHook(() => useHealthRealtime(mockUserId, mockToken));
    unmount();
    expect(mockDeactivate).toHaveBeenCalledTimes(1);
  });
});