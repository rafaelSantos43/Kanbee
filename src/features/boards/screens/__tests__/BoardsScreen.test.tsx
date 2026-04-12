import BoardsScreen from "@/app/(main)/(board)/index";
import { useBoardStore } from "@/store/useBoardStore";
import { render, screen, waitFor } from "@testing-library/react-native";

// MOCK STORES
jest.mock("@/store/useBoardStore", () => ({
  useBoardStore: jest.fn(),
}));

jest.mock("@/store/useSessionStore", () => ({
  useSessionStore: jest.fn((selector: any) =>
    selector({
      user: { id: "user-123", username: "test" },
      authenticated: true,
    }),
  ),
}));

// MOCK UI COMPONENTS
jest.mock("@/components/Screen", () => {
  const { View } = require("react-native");
  return {
    Screen: ({ children }: any) => <View testID="mock-screen">{children}</View>,
  };
});

jest.mock("@/components/KText", () => {
  const { Text } = require("react-native");

  return {
    KText: ({ label, children, ...props }: any) => (
      <Text {...props}>{label || children}</Text>
    ),
  };
});

// MOCK INFRASTRUCTURE
jest.mock("@/infrastructure/database/client", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("expo-sqlite", () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
  })),
}));

// MOCK ROUTER
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
  Stack: {
    Screen: () => null,
  },
}));

describe("BoardsScreen Integration Test", () => {
  const mockFetchBoards = jest.fn();
  const mockAddBoard = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchBoards: mockFetchBoards,
      addBoard: mockAddBoard,
      boards: [],
      searchQuery: "",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("debería cargar la pantalla y ejecutar fetchBoards", async () => {
    render(<BoardsScreen />);

    await waitFor(() => {
      expect(mockFetchBoards).toHaveBeenCalled();
    });
  });

  it("debería mostrar los tableros si el store tiene datos", async () => {
    (useBoardStore as unknown as jest.Mock).mockReturnValue({
      isLoading: false,
      fetchBoards: mockFetchBoards,
      addBoard: mockAddBoard,
      boards: [
        {
          id: "1",
          title: "Proyecto Abeja",
          color: "#FFD24D",
        },
      ],
      searchQuery: "",
    });

    render(<BoardsScreen />);

    await waitFor(() => {
      expect(screen.getByText("Proyecto Abeja")).toBeTruthy();
    });
  });
});
