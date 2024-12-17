module.exports = {
  root: true,
  globals: {
    expect: true,
    describe: true,
    __DEV__: true,
    fetch: true,
    window: true,
  },
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'react/no-unstable-nested-components': 'off',
    'react-native/no-inline-styles': 'off',
  },
  overrides: [
    {
      files: ['**/*.test.tsx', '**/*.test.ts'],
      env: {
        jest: true,
      },
      rules: {
        'no-undef': 'off',
      },
    },
    {
      files: ['**/*.json'],
      env: {
        jest: true,
      },
      rules: {
        'no-unused-expressions': 'off',
        'comma-dangle': 'off',
        quotes: 'off',
        semi: 'off',
      },
    },
  ],
};
