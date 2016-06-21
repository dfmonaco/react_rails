// Common webpack configuration for server bundle

const webpack = require('webpack');
const path = require('path');
const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';
const combineLoaders = require('webpack-combine-loaders');

module.exports = {
  // CONTEXT
  // The base directory (absolute path!) for resolving the entry option.
  // set to: <project_dir>/client
  context: __dirname,
  // ENTRY
  // The entry point for the bundle.
  // If you pass an object: Multiple entry bundles are created.
  // The key is the chunk name. The value can be a string or an array.
  entry: [
    // Babel can’t support all of ES6 with compilation alone
    // it also requires some runtime support
    'babel-polyfill',
    './app/bundles/HelloWorld/startup/HelloWorldApp',
  ],
  output: {
    filename: 'server-bundle.js',
    path: '../app/assets/webpack',
  },
  // RESOLVE
  // Options affecting the resolving of modules.
  resolve: {
    // An array of extensions that should be used to resolve modules.
    // to help resolve imports without extensions
    extensions: ['', '.js', '.jsx'],
    // Replace modules with other modules or paths.
    // Expected an object with keys being module names. The value is the new path.
    alias: {
      libs: path.join(process.cwd(), 'app', 'libs'),
    },
  },
  plugins: [
    // Define free variables.
    // Each key passed into DefinePlugin is an identifier
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
    }),
  ],
  module: {
    loaders: [
      { test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/ },
      {
        test: /\.css$/,
        // For prerendering with extract-text-webpack-plugin you should use css-loader/locals
        // It doesn't embed CSS but only exports the identifier mappings.
        loader: 'css/locals',
        query: {
          // This enables Local scoped CSS by default.
          modules: true,
          // configure which loaders should be applied to @imported resources.
          // That many loaders after the css-loader are used to import resources.
          importLoaders: 0,
          // The loader replaces local selectors with unique identifiers.
          localIdentName: '[name]__[local]__[hash:base64:5]'
        },
      },
      {
        test: /\.scss$/,
        loader: combineLoaders([
          {
            // For prerendering with extract-text-webpack-plugin you should use css-loader/locals
            // It doesn't embed CSS but only exports the identifier mappings.
            loader: 'css/locals',
            query: {
              // This enables Local scoped CSS by default.
              modules: true,
              // configure which loaders should be applied to @imported resources.
              // That many loaders after the css-loader are used to import resources.
              importLoaders: 2,
              // The loader replaces local selectors with unique identifiers.
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass'
          },
        ]),
      },
    ],
  },
};
