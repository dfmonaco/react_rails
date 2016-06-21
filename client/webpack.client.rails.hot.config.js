// Run with Rails server like this:
// rails s
// cd client && babel-node server-rails-hot.js
// Note that Foreman (Procfile.dev) has also been configured to take care of this.

const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.client.base.config');
const hotRailsPort = process.env.HOT_RAILS_PORT || 3500;
const combineLoaders = require('webpack-combine-loaders');

config.entry.app.unshift(
  // Needed for Inline mode
  // (a small webpack-dev-server client entry is added to the
  // bundle which refresh the page on change)
  `webpack-dev-server/client?http://localhost:${hotRailsPort}`,
  // Needed for HMR
  //add an entry point to the webpack configuration: webpack/hot/dev-server.
  //add the new webpack.HotModuleReplacementPlugin() to the webpack configuration.
  //add hot: true to the webpack-dev-server configuration to enable HMR on the server.
  'webpack/hot/dev-server'
);

// tell Webpack how to write the compiled files to disk
config.output = {
  // Specifies the name of each output file on disk
  // [name] is replaced by the name of the chunk.
  // [hash] is replaced by the hash of the compilation.
  // [chunkhash] is replaced by the hash of the chunk.
  // vendor-bundle.js and app-bundle.js
  filename: '[name]-bundle.js',
  // The output directory as absolute path (required).
  path: path.join(__dirname, 'public'),
  // specifies the public URL address of the output files when referenced in a browser. 
  // The Webpack Dev Server also uses this to determine the path
  // where the output files are expected to be served from
  publicPath: `http://localhost:${hotRailsPort}/`,
};

config.module.loaders.push(
  {
    test: /\.jsx?$/,
    loader: 'babel',
    exclude: /node_modules/,
    query: {
      plugins: [
        [
          'react-transform',
          {
            superClasses: ['React.Component', 'BaseComponent', 'Component'],
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: ['react'],
                locals: ['module'],
              },
            ],
          },
        ],
      ],
    },
  },
  {
    test: /\.css$/,
    loader: combineLoaders([
      {
        loader: 'style'
      },
      {
        loader: 'css',
        query: {
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
    ]),
  },
  {
    test: /\.scss$/,
    loader: combineLoaders([
      {
        loader: 'style'
      },
      {
        loader: 'css',
        query: {
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
    ]),
  },
);

config.plugins.push(
  // inject updated modules into the active runtime.
  new webpack.HotModuleReplacementPlugin(),
  // will pause when it encounters a syntax error.
  // Once you fix the error it will automatically resume hot loading.
  new webpack.NoErrorsPlugin()
);

// Choose a developer tool to enhance debugging.
// Each module is executed with eval and a SourceMap is added as DataUrl to the eval.
config.devtool = 'eval-source-map';

console.log('Webpack dev build for Rails'); // eslint-disable-line no-console

module.exports = config;
