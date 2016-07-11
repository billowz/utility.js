var path = require('path'),
  webpack = require('webpack'),
  pkg = require('../package.json'),
  bannar = `${pkg.name} v${pkg.version} built in ${new Date().toUTCString()}
Copyright (c) 2016 ${pkg.author}
Released under the ${pkg.license} license
support IE6+ and other browsers
${pkg.homepage}`;


var config = {
  entry: {
    utility: path.resolve(__dirname, '../src/index.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd'
  },
  externals: {
  },
  resolve: {
    modulesDirectories: [path.resolve(__dirname, '../node_modules')],
    extensions: ['', '.js']
  },
  module: {
    loaders: [{
      test: /\.(js)$/,
      loader: 'babel'
    }]
  },
  plugins: [new webpack.BannerPlugin(bannar)],
  devtool: 'source-map'
}

module.exports = config;
