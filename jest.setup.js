import '@testing-library/jest-native/extend-expect';

// Mock AsyncStorage
// eslint-disable-next-line no-undef
jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    // eslint-disable-next-line no-undef
    setItem: jest.fn(() => Promise.resolve()),
    // eslint-disable-next-line no-undef
    getItem: jest.fn(() => Promise.resolve(null)),
    // eslint-disable-next-line no-undef
    removeItem: jest.fn(() => Promise.resolve()),
    // eslint-disable-next-line no-undef
    clear: jest.fn(() => Promise.resolve()),
  },
}));
