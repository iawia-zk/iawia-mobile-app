export const presets = [
  ['@babel/preset-env', { targets: { node: 'current' } }],
  '@babel/preset-typescript',
  'babel-preset-expo',
];

export const plugins = [
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
  [
    'module:react-native-dotenv',
    {
      moduleName: '@env',
      path: '.env',
      blacklist: null,
      whitelist: null,
      safe: false,
      allowUndefined: true,
    },
  ],
  'react-native-reanimated/plugin',
];
