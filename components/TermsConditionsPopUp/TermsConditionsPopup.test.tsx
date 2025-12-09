import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import TermsConditionsPopUp, {
  TermsConditionsPopUpRef,
} from "./TermsConditionsPopUp";

// Mock the bottom sheet library
jest.mock("@gorhom/bottom-sheet", () => {
  const React = require("react");
  const { View, Text, Pressable } = require("react-native");

  return {
    BottomSheetModal: React.forwardRef(
      ({ children, backdropComponent }: any, ref: any) => {
        const [isVisible, setIsVisible] = React.useState(false);

        React.useImperativeHandle(ref, () => ({
          present: () => setIsVisible(true),
          close: () => setIsVisible(false),
        }));

        if (!isVisible) return null;

        return <View testID="bottom-sheet-modal">{children}</View>;
      },
    ),
    BottomSheetBackdrop: ({ children }: any) => <View>{children}</View>,
    BottomSheetScrollView: ({ children }: any) => <View>{children}</View>,
  };
});

describe("TermsConditionsPopUp", () => {
  const mockOnAccept = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not be visible initially", () => {
    const ref = React.createRef<TermsConditionsPopUpRef>();
    const { queryByTestId } = render(
      <TermsConditionsPopUp ref={ref} onAccept={mockOnAccept} />,
    );

    expect(queryByTestId("bottom-sheet-modal")).toBeNull();
  });

  it("should open when open() is called", async () => {
    const ref = React.createRef<TermsConditionsPopUpRef>();
    const { getByTestId } = render(
      <TermsConditionsPopUp ref={ref} onAccept={mockOnAccept} />,
    );

    ref.current?.open();

    await waitFor(() => {
      expect(getByTestId("bottom-sheet-modal")).toBeTruthy();
    });
  });

  describe('mode="accept"', () => {
    it("should show Cancel and Accept & Continue buttons", async () => {
      const ref = React.createRef<TermsConditionsPopUpRef>();
      const { getByText } = render(
        <TermsConditionsPopUp
          ref={ref}
          onAccept={mockOnAccept}
          mode="accept"
        />,
      );

      ref.current?.open();

      await waitFor(() => {
        expect(getByText("Cancel")).toBeTruthy();
        expect(getByText("Accept & Continue")).toBeTruthy();
      });
    });

    it("should call onAccept and close when Accept & Continue is pressed", async () => {
      const ref = React.createRef<TermsConditionsPopUpRef>();
      const { getByText, queryByTestId } = render(
        <TermsConditionsPopUp
          ref={ref}
          onAccept={mockOnAccept}
          mode="accept"
        />,
      );

      ref.current?.open();

      await waitFor(() => {
        expect(getByText("Accept & Continue")).toBeTruthy();
      });

      fireEvent.press(getByText("Accept & Continue"));

      expect(mockOnAccept).toHaveBeenCalledTimes(1);

      await waitFor(() => {
        expect(queryByTestId("bottom-sheet-modal")).toBeNull();
      });
    });

    it("should close without calling onAccept when Cancel is pressed", async () => {
      const ref = React.createRef<TermsConditionsPopUpRef>();
      const { getByText, queryByTestId } = render(
        <TermsConditionsPopUp
          ref={ref}
          onAccept={mockOnAccept}
          mode="accept"
        />,
      );

      ref.current?.open();

      await waitFor(() => {
        expect(getByText("Cancel")).toBeTruthy();
      });

      fireEvent.press(getByText("Cancel"));

      expect(mockOnAccept).not.toHaveBeenCalled();

      await waitFor(() => {
        expect(queryByTestId("bottom-sheet-modal")).toBeNull();
      });
    });
  });

  describe('mode="display"', () => {
    it("should show only OK button", async () => {
      const ref = React.createRef<TermsConditionsPopUpRef>();
      const { getByText, queryByText } = render(
        <TermsConditionsPopUp ref={ref} mode="display" />,
      );

      ref.current?.open();

      await waitFor(() => {
        expect(getByText("OK")).toBeTruthy();
        expect(queryByText("Cancel")).toBeNull();
        expect(queryByText("Accept & Continue")).toBeNull();
      });
    });

    it("should close when OK is pressed", async () => {
      const ref = React.createRef<TermsConditionsPopUpRef>();
      const { getByText, queryByTestId } = render(
        <TermsConditionsPopUp ref={ref} mode="display" />,
      );

      ref.current?.open();

      await waitFor(() => {
        expect(getByText("OK")).toBeTruthy();
      });

      fireEvent.press(getByText("OK"));

      await waitFor(() => {
        expect(queryByTestId("bottom-sheet-modal")).toBeNull();
      });
    });
  });

  it("should display terms content", async () => {
    const ref = React.createRef<TermsConditionsPopUpRef>();
    const { getByText } = render(
      <TermsConditionsPopUp ref={ref} onAccept={mockOnAccept} />,
    );

    ref.current?.open();

    await waitFor(() => {
      // Weird text interaction, this layout works tho
      expect(getByText(/Privacy Policy &/)).toBeTruthy();
      expect(getByText(/Terms of Service/)).toBeTruthy();
    });
  });
});
