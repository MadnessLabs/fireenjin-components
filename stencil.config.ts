import { Config } from "@stencil/core";

const { namespace } = require("./package.json");

export const config: Config = {
  namespace,
  taskQueue: "async",
  plugins: [],
  rollupPlugins: {},
  globalStyle: "src/css/global.css",
  globalScript: "src/global.ts",
  devServer: {
    reloadStrategy: "hmr",
    openBrowser: false,
  },
  outputTargets: [
    {
      type: "dist",
    },
    {
      type: "dist-hydrate-script",
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
