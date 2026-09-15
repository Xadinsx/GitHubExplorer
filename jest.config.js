module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest/setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@env$': '<rootDir>/jest/envMock.ts',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|@tanstack|@legendapp|react-native-unistyles|react-native-mmkv|react-i18next|i18next|react-native-localize|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|@d11)/)',
  ],
};
