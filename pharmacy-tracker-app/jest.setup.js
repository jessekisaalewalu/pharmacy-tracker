// jest.setup.js
// mock native modules and global setups used by the app tests
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// minimal mock for expo-router's hooks
jest.mock('expo-router', () => ({
  Link: ({ children }) => children,
  useRouter: () => ({ push: () => {} }),
  Tabs: ({ children }) => children,
}));

// mock modules used by the layout
const path = require('path');
try {
  const useColorSchemePath = path.resolve(__dirname, '..', 'components', 'useColorScheme.js');
  jest.mock(useColorSchemePath, () => ({ useColorScheme: () => 'light' }));
} catch (e) {
  // ignore if file not present (TypeScript extensions or different layout)
}
try {
  const useClientOnlyValuePath = path.resolve(__dirname, '..', 'components', 'useClientOnlyValue.js');
  jest.mock(useClientOnlyValuePath, () => ({ useClientOnlyValue: (a, b) => b }));
} catch (e) {
  // ignore
}
