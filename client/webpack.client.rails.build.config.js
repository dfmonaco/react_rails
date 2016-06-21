// Run like this:
// cd client && npm run build:client
// Note that Foreman (Procfile.dev) has also been configured to take care of this.

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('./webpack.client.base.config');
const devBuild = process.env.NODE_ENV !== 'production';
const combineLoaders = require('webpack-combine-loaders');

// tell Webpack how to write the compiled files to disk
config.output = {
  // Specifies the name of each output file on disk
  // [name] is replaced by the name of the chunk.
  // [hash] is replaced by the hash of the compilation.
  // [chunkhash] is replaced by the hash of the chunk.
  // vendor-bundle.js and app-bundle.js
  filename: '[name]-bundle.js',
  // The output directory as absolute path (required).
  path: '../app/assets/webpack',
};

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
  },
  {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style', combineLoaders([
      {
        loader: 'css',
        query: {
          minimize: true,
          // This enables Local scoped CSS by default.
          modules: true,
          // configure which loaders should be applied to @imported resources.
          // That many loaders after the css-loader are used to import resources.
          importLoaders: 1,
          // The loader replaces local selectors with unique identifiers.
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      },
      {
        loader: 'postcss'
      },
    ])),
  },
  {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style', combineLoaders([
      {
        loader: 'css',
        query: {
          minimize: true,
          // This enables Local scoped CSS by default.
          modules: true,
          // configure which loaders should be applied to @imported resources.
          // That many loaders after the css-loader are used to import resources.
          importLoaders: 3,
          // The loader replaces local selectors with unique identifiers.
          localIdentName: '[name]__[local]__[hash:base64:5]'
        }
      },
      {
        loader: 'postcss'
      },
      {
        loader: 'sass'
      },
    ])),
  }
);

config.plugins.push(
  // It moves every require("style.css") in entry chunks into a separate css output file.
  // So your styles are no longer inlined into the javascript,
  // allChunks extract from all additional chunks too (by default it extracts only from the initial chunk(s))
  // but separate in a css bundle file (vendor-bundle.css, app-bundle.css).
  new ExtractTextPlugin('[name]-bundle.css', { allChunks: true }),
  // If you use some libraries with cool dependency trees, it may occur that some files are identical.
  // Webpack can find these files and deduplicate them. 
  new webpack.optimize.DedupePlugin()
);

if (devBuild) {
  console.log('Webpack dev build for Rails'); // eslint-disable-line no-console
  // Choose a developer tool to enhance debugging.
  // Each module is executed with eval and a SourceMap is added as DataUrl to the eval.
  config.devtool = 'eval-source-map';
} else {
  console.log('Webpack production build for Rails'); // eslint-disable-line no-console
}

module.exports = config;
