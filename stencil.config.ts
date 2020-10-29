import { Config } from '@stencil/core';

const { namespace, distDirs } = require('./package.json');

export const config: Config = {
  namespace,
  buildEs5: false,
  taskQueue: "async",
  plugins: [
  ],
  globalStyle: 'src/css/global.css',
  globalScript: "src/global.ts",
  devServer: {
    reloadStrategy: 'hmr',
    openBrowser: false,
  },
  outputTargets: [
    // creates /dist dir
    {
      type: 'dist',
      dir: distDirs.stencil,
      copy: [
        // copy fonts into static for storybook and stencil build
        { src: 'fonts' },
      ],
    },
    // one file in es6
    {
      type: 'dist-custom-elements-bundle',
      dir: distDirs.stencil,
    },
    // creates readme.md for components
    {
      type: 'docs-readme',
      dir: distDirs.stencil,
    },
    // create components(.d.ts|json) into dist
    {
      type: 'docs-json',
      file: `${distDirs.stencil}/components.json`,
    },
  ],
};
