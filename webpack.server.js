const path = require('path');
const fs = require('fs');
const EncodingPlugin = require('webpack-encoding-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/server/main.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.sql'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src/server'),
      path.resolve(__dirname, './src/shared'),
      path.resolve(__dirname, './generated')
    ]
  },
  output: {
    path: __dirname + '/dist/server',
    publicPath: '/',
    filename: 'bundle.js',
    libraryTarget: 'umd'
  },
  plugins: [
    new EncodingPlugin({
      encoding: 'iso-8859-1'
    }),
  ],
  target: 'node',
  optimization: {
    minimizer: [
      // we specify a custom UglifyJsPlugin here to get source maps in production
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: false,
          ecma: 6,
          mangle: false
        },
        sourceMap: true
      })
    ]
  }
};
