module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          jest: './jest',
          mocks: './__mocks__',
          storybook: './storybook',
          assets: './assets',
        },
      },
    ],
  ],
};
