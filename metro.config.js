const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withZephyr } = require('zephyr-metro-plugin');
const { withModuleFederation } = require('@module-federation/metro');

const miniAppPort = process.env.MINI_APP_PORT ?? '8082';

const config = {
  resolver: { useWatchman: false },
};

const getConfig = async () => {
  const zephyrConfig = await withZephyr()({
    name: 'hostApp',
    remotes: {
      miniApp: `miniApp@http://localhost:${miniAppPort}/mf-manifest.json`,
    },
    shared: {
      react: {
        singleton: true,
        eager: true,
        requiredVersion: '19.2.3',
        version: '19.2.3',
      },
      'react-native': {
        singleton: true,
        eager: true,
        requiredVersion: '0.86.2',
        version: '0.86.2',
      },
    },
    shareStrategy: 'loaded-first',
  });

  return withModuleFederation(
    mergeConfig(getDefaultConfig(__dirname), config),
    zephyrConfig,
    {
      flags: {
        unstable_patchHMRClient: true,
        unstable_patchInitializeCore: true,
        unstable_patchRuntimeRequire: true,
      },
    },
  );
};

module.exports = getConfig;
