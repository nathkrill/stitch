const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    stitch: './src/js/Stitch.js',
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist/js'),
  },
};