module.exports = {
  parser: 'sugarss',
  plugins: {
    'postcss-import': {
      root: __dirname,
    },
    'postcss-cssnext': {}
  },
};