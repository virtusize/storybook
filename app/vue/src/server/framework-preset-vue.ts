import { Configuration } from 'webpack';

export function webpack(config: Configuration) {
  return {
    ...config,
    plugins: [...config.plugins],
    module: {
      ...config.module,
      rules: [...config.module.rules],
    },
    resolve: {
      ...config.resolve,
      extensions: [...config.resolve.extensions],
      alias: {
        ...config.resolve.alias,
        vue$: require.resolve('vue/dist/vue.esm.js'),
      },
    },
  };
}

export function babelDefault(config: any) {
  return {
    ...config,
    presets: [...config.presets],
  };
}
