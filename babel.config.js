module.exports = function (api) {
  api.cache(true);

  const plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
        },
        extensions: ['.ios.js', '.android.js', '.js', '.jsx', '.json', '.tsx', '.ts'],
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env',
        safe: false,
        allowUndefined: true,
      },
    ],
  ];

  if (process.env.NODE_ENV !== 'test') {
    plugins.push([
      'react-native-unistyles/plugin',
      {
        root: 'src',
      },
    ]);
  }

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins,
  };
};
