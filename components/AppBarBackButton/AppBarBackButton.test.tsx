import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import AppBar from "./AppBarBackButton";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// Mock expo-router
jest.mock("expo-router", () => {
  const back = jest.fn();
  const replace = jest.fn();
  let can = true;
  return {
    useRouter: () => ({
      back,
      replace,
      canGoBack: () => can,
      // helpers to flip state in tests:
      __setCanGoBack: (v: boolean) => (can = v),
      __mocks: { back, replace },
    }),
  };
});

// small helper to access the mocks (typed)
type TestRouterWithHelpers = {
  __mocks: { back: jest.Mock; replace: jest.Mock };
  __setCanGoBack: (v: boolean) => void;
};

const getRouterMocks = () => {
  const { useRouter } = jest.requireMock("expo-router") as {
    useRouter: () => TestRouterWithHelpers;
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRouter().__mocks;
};

// flip the canGoBack state (typed)
const setCanGoBack = (v: boolean) => {
  const { useRouter } = jest.requireMock("expo-router") as {
    useRouter: () => TestRouterWithHelpers;
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useRouter().__setCanGoBack(v);
};

describe("AppBarBackButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls router.back when history exists", () => {
    setCanGoBack(true);
    const { getByTestId } = render(<AppBar />);
    fireEvent.press(getByTestId("back-pressable"));
    const { back, replace } = getRouterMocks();
    expect(back).toHaveBeenCalledTimes(1);
    expect(replace).not.toHaveBeenCalled();
  });

  it("falls back to router.replace('/') when no history", () => {
    setCanGoBack(false);
    const { getByTestId } = render(<AppBar />);
    fireEvent.press(getByTestId("back-pressable"));
    const { back, replace } = getRouterMocks();
    expect(back).not.toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/");
  });

  it("calls custom onBackPress when provided", () => {
    const onBackPress = jest.fn();
    const { getByTestId } = render(<AppBar onBackPress={onBackPress} />);
    fireEvent.press(getByTestId("back-pressable"));
    expect(onBackPress).toHaveBeenCalledTimes(1);

    // Ensure default handler wasn't called
    const { back, replace } = getRouterMocks();
    expect(back).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });
});
