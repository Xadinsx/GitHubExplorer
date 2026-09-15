module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  ignorePatterns: [
    'android/**',
    'ios/**',
    'coverage/**',
    'node_modules/**',
    '.yarn/**',
    'jest/setup.js',
    'metro.config.js',
    'babel.config.js',
    'jest.config.js',
  ],
  rules: {
    'react-native/no-inline-styles': 'error',
    curly: ['error', 'all'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-alert': 'error',
    'no-void': 'off',
  },
};
