const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withRozenite } = require('@rozenite/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * Rozenite must be opt-in (`WITH_ROZENITE=true`) so release bundles never host DevTools plugins.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

module.exports = withRozenite(mergeConfig(getDefaultConfig(__dirname), config), {
  enabled: process.env.WITH_ROZENITE === 'true',
  include: ['@rozenite/network-activity-plugin'],
});
