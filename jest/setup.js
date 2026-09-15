import 'react-native-gesture-handler/jestSetup';

const mockMemory = new Map();

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    getString: key => mockMemory.get(key),
    set: (key, value) => {
      mockMemory.set(key, String(value));
    },
    remove: key => mockMemory.delete(key),
    contains: key => mockMemory.has(key),
    clearAll: () => mockMemory.clear(),
    getAllKeys: () => Array.from(mockMemory.keys()),
  }),
}));

jest.mock('react-native-localize', () => ({
  getLocales: () => [{ languageCode: 'en', countryCode: 'US' }],
}));

jest.mock('@d11/react-native-fast-image', () => {
  const { Image } = require('react-native');
  return {
    __esModule: true,
    default: Image,
  };
});

jest.mock('react-native-unistyles', () => {
  const { StyleSheet } = require('react-native');
  const mockLightTheme = {
    colors: {
      background: '#F4F6F8',
      surface: '#FFFFFF',
      text: '#111827',
      textMuted: '#6B7280',
      border: '#E5E7EB',
      accent: '#0969DA',
      star: '#9A6700',
      danger: '#B42318',
      banner: '#FFF4E5',
      onBanner: '#93370D',
    },
    spacing: { xs: 4, sm: 8, md: 16, lg: 24 },
    radius: { sm: 8, md: 12 },
  };
  return {
    StyleSheet: {
      hairlineWidth: StyleSheet.hairlineWidth,
      configure: jest.fn(),
      create: styles => {
        if (typeof styles === 'function') {
          return StyleSheet.create(styles(mockLightTheme));
        }
        return StyleSheet.create(styles);
      },
      absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
      absoluteFillObject: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      flatten: StyleSheet.flatten,
      compose: StyleSheet.compose,
    },
    UnistylesRuntime: {
      setTheme: jest.fn(),
      setAdaptiveThemes: jest.fn(),
      themeName: 'light',
      hasAdaptiveThemes: true,
    },
    useUnistyles: () => ({
      theme: mockLightTheme,
      rt: { themeName: 'light' },
    }),
  };
});

jest.mock('@legendapp/list/react-native', () => {
  const { FlatList } = require('react-native');
  return { LegendList: FlatList };
});

jest.mock('react-native-nitro-modules', () => ({
  NitroModules: { createHybridObject: jest.fn() },
}));
