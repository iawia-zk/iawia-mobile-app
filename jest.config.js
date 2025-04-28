export default {
  preset: 'react-native',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],
  transformIgnorePatterns: ['node_modules/(?!(chai|@react-native)/)'],
};
