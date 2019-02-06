const webpack = require('webpack');
const path = require('path');

const postcssPlugins = [
  require('postcss-cssnext')(),
  require('postcss-modules-values')
];

const scssLoader = [
  { loader: 'style-loader' },
  { loader: 'css-loader' },
  { loader: 'sass-loader' }
];

const postcssLoader = [
  { loader: 'style-loader' },
  {
    loader: 'css-loader',
    options: {
      modules: true, // default is false
      sourceMap: true,
      importLoaders: 1,
      localIdentName: "[name]--[local]--[hash:base64:8]"
    }
  },
  { loader: 'postcss-loader', options: { plugins: () => [...postcssPlugins] } }
];

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.(scss|sass)$/,
        loader: scssLoader,
        include: [__dirname]
      },
      {
        test: /\.css$/,
        loader: postcssLoader,
        include: [__dirname]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css', '.scss', '.sass'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, './src')
    ]
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    require('postcss-cssnext')
  ],
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
