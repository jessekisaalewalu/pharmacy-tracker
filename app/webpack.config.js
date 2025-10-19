const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Alias native-only libs to web-friendly shims
  if (config.resolve && config.resolve.alias) {
    config.resolve.alias['react-native-maps'] = require('path').resolve(__dirname, 'src/shims/ReactNativeMapsWeb.js');
  }

  return config;
};
