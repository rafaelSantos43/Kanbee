/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// Suprimir advertencias no necesarias en tests
global.console = {
  ...console,
  warn: jest.fn(),
  // Mantener otros métodos
  error: console.error,
  info: console.info,
  debug: console.debug,
  log: console.log,
};

// Mocks básicos para que Jest no explote con Expo
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
  useLocalSearchParams: () => ({}),
  useSegments: () => [],
  Stack: { Screen: () => null },
  Tabs: {
    Screen: () => null,
  },
}));

// Mock de react-navigation native para useNavigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    dispatch: jest.fn(),
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

// Mock para evitar el error de SQLite en entorno Node
jest.mock('expo-sqlite', () => ({
  openDatabaseSync: jest.fn(() => ({
    execSync: jest.fn(),
    runAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runSync: jest.fn(),
    close: jest.fn(),
  })),
}));

// Mock de AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock de expo-localization
jest.mock('expo-localization', () => ({
  getLocales: jest.fn(() => [{ languageCode: 'en' }]),
  isRTL: false,
}));

// Mock de react-navigation drawer
jest.mock('@react-navigation/drawer', () => ({
  DrawerActions: {
    openDrawer: () => ({ type: 'OPEN_DRAWER' }),
    closeDrawer: () => ({ type: 'CLOSE_DRAWER' }),
  },
}));

// Mock de SafeAreaView
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: any) => children,
}));