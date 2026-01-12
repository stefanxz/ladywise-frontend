import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import TutorialsScreen from "@/app/(main)/settings/questions";
import * as api from "@/lib/api";
import { ToastProvider } from "@/context/ToastContext";

// Mock dependencies
jest.mock("@/lib/api", () => ({
  getTutorials: jest.fn(),
}));

jest.mock("expo-video", () => ({
  useVideoPlayer: jest.fn(() => ({
    play: jest.fn(),
    pause: jest.fn(),
    loop: false,
  })),
  VideoView: (props: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="video-view" style={props.style}>
        <Text>Video Player</Text>
      </View>
    );
  },
}));

jest.mock("@/components/AppBarBackButton/AppBarBackButton", () => ({
  AppBar: () => {
    const { View, Text } = require("react-native");
    return (
      <View testID="app-bar">
        <Text>Back</Text>
      </View>
    );
  },
}));

jest.mock("@/components/Settings/SettingsPageLayout", () => ({
  SettingsPageLayout: ({ children, title, description }: any) => {
    const { View, Text } = require("react-native");
    return (
      <View testID="settings-page-layout">
        <Text>{title}</Text>
        <Text>{description}</Text>
        {children}
      </View>
    );
  },
}));

jest.mock("@/components/Settings/SettingItem", () => ({
  SettingItem: (props: any) => {
    const { TouchableOpacity, Text, View } = require("react-native");
    return (
      <View>
        <TouchableOpacity
          testID={`setting-item-${props.item.name}`}
          onPress={props.item.onPress}
        >
          <Text>{props.item.name}</Text>
        </TouchableOpacity>
      </View>
    );
  },
}));

jest.mock("@expo/vector-icons", () => ({ Ionicons: "Ionicons" }));

// Mock useToast hook
const mockShowToast = jest.fn();
jest.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    showToast: mockShowToast,
  }),
}));

const mockGetTutorials = api.getTutorials as jest.Mock;

const mockTutorials = [
  {
    id: "1",
    title: "Getting Started",
    description: "Learn the basics",
    videoUrl: "https://example.com/video1.mp4",
    order: 1,
  },
  {
    id: "2",
    title: "Advanced Features",
    description: "Deep dive into features",
    videoUrl: "https://example.com/video2.mp4",
    order: 2,
  },
];

// Helper function to render with ToastProvider
const renderWithToast = (component: React.ReactElement) => {
  return render(<ToastProvider>{component}</ToastProvider>);
};

describe("TutorialsScreen - Rendering", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the tutorials screen with title and header", () => {
    mockGetTutorials.mockResolvedValue([]);
    renderWithToast(<TutorialsScreen />);

    expect(screen.getByText("Questions")).toBeTruthy();
    expect(
      screen.getByText(
        "Watch our tutorial videos to get started with Ladywise.",
      ),
    ).toBeTruthy();
    expect(screen.getByText("Video Help Resources (Tutorials)")).toBeTruthy();
  });

  it("shows loading state initially", () => {
    mockGetTutorials.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );
    renderWithToast(<TutorialsScreen />);

    expect(screen.getByText("Loading tutorials...")).toBeTruthy();
  });

  it("shows empty state when no tutorials available", async () => {
    mockGetTutorials.mockResolvedValue([]);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("No tutorials available yet")).toBeTruthy();
    });
  });

  it("fetches and displays tutorials", async () => {
    mockGetTutorials.mockResolvedValue(mockTutorials);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
      expect(screen.getByText("Advanced Features")).toBeTruthy();
    });
  });
});

describe("TutorialsScreen - API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calls getTutorials on mount", () => {
    mockGetTutorials.mockResolvedValue([]);
    renderWithToast(<TutorialsScreen />);

    expect(mockGetTutorials).toHaveBeenCalledTimes(1);
  });

  it("shows toast and sets empty array on API error", async () => {
    const consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockGetTutorials.mockRejectedValue(new Error("Network Error"));

    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("No tutorials available yet")).toBeTruthy();
      expect(mockShowToast).toHaveBeenCalledWith(
        "Unable to load tutorials. Please try again later",
        "error",
      );
    });

    consoleErrorSpy.mockRestore();
  });
});

describe("TutorialsScreen - Video Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("does not show video modal initially", async () => {
    mockGetTutorials.mockResolvedValue(mockTutorials);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
    });

    expect(screen.queryByTestId("video-view")).toBeNull();
  });

  it("opens video modal when tutorial is pressed", async () => {
    mockGetTutorials.mockResolvedValue(mockTutorials);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
    });

    const tutorialItem = screen.getByTestId("setting-item-Getting Started");
    fireEvent.press(tutorialItem);

    await waitFor(() => {
      expect(screen.getByTestId("video-view")).toBeTruthy();
    });
  });

  it("closes video modal when close button is pressed", async () => {
    mockGetTutorials.mockResolvedValue(mockTutorials);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
    });

    // Open modal
    const tutorialItem = screen.getByTestId("setting-item-Getting Started");
    fireEvent.press(tutorialItem);

    await waitFor(() => {
      expect(screen.getByTestId("video-view")).toBeTruthy();
    });

    // Close modal
    const closeButton = screen.getByTestId("close-video-modal");
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId("video-view")).toBeNull();
    });
  });
});

describe("TutorialsScreen - Tutorial List", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all tutorials in order", async () => {
    mockGetTutorials.mockResolvedValue(mockTutorials);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
      expect(screen.getByText("Advanced Features")).toBeTruthy();
    });
  });

  it("handles single tutorial", async () => {
    const singleTutorial = [mockTutorials[0]];
    mockGetTutorials.mockResolvedValue(singleTutorial);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Getting Started")).toBeTruthy();
    });
  });

  it("renders tutorials with empty videoUrl", async () => {
    const tutorialsWithoutUrl = [
      {
        id: "3",
        title: "No Video Tutorial",
        description: "This has no video",
        videoUrl: "",
        order: 3,
      },
    ];
    mockGetTutorials.mockResolvedValue(tutorialsWithoutUrl);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("No Video Tutorial")).toBeTruthy();
    });
  });

  it("does not trigger onPress for tutorials without videoUrl", async () => {
    const tutorialsWithoutUrl = [
      {
        id: "3",
        title: "No Video Tutorial",
        description: "This has no video",
        videoUrl: "",
        order: 3,
      },
    ];
    mockGetTutorials.mockResolvedValue(tutorialsWithoutUrl);
    renderWithToast(<TutorialsScreen />);

    await waitFor(() => {
      expect(screen.getByText("No Video Tutorial")).toBeTruthy();
    });

    const tutorialItem = screen.getByTestId("setting-item-No Video Tutorial");
    fireEvent.press(tutorialItem);

    // Modal should not open
    expect(screen.queryByTestId("video-view")).toBeNull();
  });
});
