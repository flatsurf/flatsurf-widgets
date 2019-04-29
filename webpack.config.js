const path = require('path');
const version = require('./package.json').version;
const { VueLoaderPlugin } = require('vue-loader');

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

const plugins = [ new VueLoaderPlugin() ];

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
      // work around https://github.com/webpack/webpack-dev-server/issues/1591
      writeToDisk: true,
    }
  },
  /**
   * Notebook extension
   *
   * This bundle only contains the part of the JavaScript that is run on load of
   * the notebook.
   */
  {
    entry: './src/extension.ts',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'flatsurf_widgets', 'nbextension', 'static'),
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
      publicPath: 'http://localhost:9000/index.js',
      // public: 'localhost:9000',
      hot: true,
      // work around https://github.com/webpack/webpack-dev-server/issues/1591
      writeToDisk: true,
    }
  },
  /**
   * JupyterLab widget implementation
   *
   * This bundle is imported by the typescript code in bootstrap/
   */
  {
    entry: './src/flatsurf-widgets-bundle.ts',
    output: {
      filename: 'flatsurf-widgets-bundle.js',
      path: path.resolve(__dirname, 'lib'),
      libraryTarget: 'commonjs'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins,
  },

  /**
   * Embeddable flatsurf-widgets bundle
   *
   * This bundle is almost identical to the notebook extension bundle. The only
   * difference is in the configuration of the webpack public path for the
   * static assets.
   *
   * The target bundle is always `dist/index.js`, which is the path required by
   * the custom widget embedder.
   */
  {
    entry: './src/index.ts',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'amd',
        library: "flatsurf-widgets",
        publicPath: 'https://unpkg.com/flatsurf-widgets@' + version + '/dist/'
    },
    devtool: 'source-map',
    module: {
        rules: rules
    },
    externals,
    resolve,
    plugins,
  },


  /**
   * Documentation widget bundle
   *
   * This bundle is used to embed widgets in the package documentation.
   */
  {
    entry: './src/index.ts',
    output: {
      filename: 'embed-bundle.js',
      path: path.resolve(__dirname, 'docs', 'source', '_static'),
      library: "flatsurf-widgets",
      libraryTarget: 'amd'
    },
    module: {
      rules: rules
    },
    devtool: 'source-map',
    externals,
    resolve,
    plugins,
  }

];
