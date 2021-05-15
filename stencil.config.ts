import { Config } from '@stencil/core';
// import typescript from "rollup-plugin-typescript";

const { namespace } = require('./package.json');

export const config: Config = {
  namespace,
  buildEs5: false,
  taskQueue: "async",
  plugins: [
  ],
  rollupPlugins: {
    // before: [typescript()],
  },
  globalStyle: 'src/css/global.css',
  globalScript: "src/global.ts",
  devServer: {
    reloadStrategy: 'hmr',
    openBrowser: false,
  },
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "www",
      serviceWorker: null,
      baseUrl: "https://fireenjin.com",
    },
    {
      type: "docs-readme",
    },
    {
      type: "docs-json",
      file: "www/core.json",
    },
  ],
};
