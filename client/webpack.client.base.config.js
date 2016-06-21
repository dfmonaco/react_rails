// Common client-side webpack configuration used by webpack.hot.config and webpack.rails.config.

const webpack = require('webpack');
const path = require('path');
const autoprefixer = require('autoprefixer');

const devBuild = process.env.NODE_ENV !== 'production';
const nodeEnv = devBuild ? 'development' : 'production';

console.log(__dirname);

module.exports = {

  // CONTEXT
  // The base directory (absolute path!) for resolving the entry option.
  // set to: <project_dir>/client
  context: __dirname,
  // ENTRY
  // The entry point for the bundle.
  // If you pass an object: Multiple entry bundles are created.
  // The key is the chunk name. The value can be a string or an array.
  entry: {
    // Append multiple files that are NOT dependent on each other
    // generates: vendor-bundle.js
    vendor: [
      // Babel can’t support all of ES6 with compilation alone
      // it also requires some runtime support
      'babel-polyfill',
      // Monkey-patch JavaScript context to contain all EcmaScript 5 methods
      // that can be faithfully emulated with a legacy JavaScript engine
      'es5-shim/es5-shim',
      // Monkey-patch other ES5 methods as closely as possible.
      'es5-shim/es5-sham',
      'jquery',
      'jquery-ujs',
      'turbolinks',
      'mirror-creator',
      'immutable',
      'redux',
      'redux-thunk',
      'react',
      'react-redux',
      'react-on-rails',
      'react-toolbox',
    ],
    // Append multiple files that are NOT dependent on each other
    // generates: app-bundle.js
    app: [
      './app/bundles/HelloWorld/startup/HelloWorldApp',
    ],
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
      libs: path.join(__dirname, 'app', 'libs'),
    },
  },

  // PLUGINS
  plugins: [
    // Define free variables.
    // Each key passed into DefinePlugin is an identifier
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
      },
      TRACE_TURBOLINKS: devBuild,
    }),
    // Move modules that occur in multiple entry chunks to a new entry chunk (the commons chunk).
    new webpack.optimize.CommonsChunkPlugin({
      // An existing chunk can be selected by passing a name of an existing chunk.
      name: 'vendor',
      // The minimum number of chunks which need to contain a module before
      // it’s moved into the commons chunk
      // Infinity ensures that no other module goes into the vendor chunk
      minChunks: Infinity,
    }),
  ],
  module: {
    loaders: [
      // FILE
      // Emits the file into the output folder and returns the (relative) url.
      { test: /\.(ttf|eot)$/, loader: 'file' },
      // URL
      // works like the file loader, but can return a Data Url if the file is smaller than a limit.
      { test: /\.(jpe?g|woff2?|png|gif|svg|ico)$/, loader: 'url?limit=10000' },
      // EXPOSE
      // Expose exports from a module to the global context
      // require.resolve gives you the absolute path to the module
      { test: require.resolve("jquery"), loader: "expose?$!expose?jQuery" },
      // IMPORTS
      // Used to inject variables into the scope of a module.
      // Useful when a file has dependencies that are not imported via require().
      // This loader allows you to put some modules or arbitrary JavaScript onto a local variable of the file.
      // Modules relying on this being the window object.
      // require.resolve gives you the absolute path to the module
      { test: require.resolve('turbolinks'), loader: 'imports?this=>window' },
      { test: require.resolve('jquery-ujs'), loader: 'imports?jQuery=jquery' },
      {
        test: require.resolve('react'),
        loader: 'imports',
        query: {
          shim: 'es5-shim/es5-shim',
          sham: 'es5-shim/es5-sham',
        },
      },
    ],
  },
  // postcss-loader
  // Place here all postCSS plugins here, so postcss-loader will apply them
  // Parse CSS and add vendor prefixes to CSS rules using values from Can I Use
  postcss: [autoprefixer],
};

