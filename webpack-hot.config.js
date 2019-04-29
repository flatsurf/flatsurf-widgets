const path = require('path');
const version = require('./package.json').version;
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

// Custom webpack rules
const rules = [
  { test: /\.ts$/, loader: 'ts-loader' , options: {
    appendTsSuffixTo: [/\.vue$/],
  } },
  { test: /\.js$/, loader: 'source-map-loader' },
  { test: /\.css$/, use: ['style-loader', 'css-loader']},
  { test: /\.vue$/, use: ['vue-loader']}
];

// Packages that shouldn't be bundled but loaded at runtime
const externals = ['@jupyter-widgets/base'];

const plugins = [
  new VueLoaderPlugin(),
];

const resolve = {
  // Add '.ts' and '.tsx' as resolvable extensions.
  extensions: [".webpack.js", ".web.js", ".ts", ".js"],
};

module.exports = [
  /**
   * Notebook extension for hot reloading
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      // HACK: Webpack wants to load from the current directory
      // (notebooks/examples when looking at the example notebook.)
      // So we write hot updates there with the writeToDisk: true below.
      path: path.resolve(__dirname, 'examples'),
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins,
    devServer: {
      port: 9000,
      hot: true,
      public: 'localhost:9000',
      // work around https://github.com/webpack/webpack-dev-server/issues/1591
      writeToDisk: true,
    }
  },
];
