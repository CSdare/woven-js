const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'dev/testApp.js'),
  output: {
    path: path.resolve(__dirname, 'dev/dist'),
    filename: "bundle.js",
  },
  resolveLoader: {
    modules: [ 'node_modules', path.resolve(__dirname, 'loaders') ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [ path.resolve(__dirname, 'dev/woven_functions') ],
        loader: [ 'babel-loader' ],
      },
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, 'dev/woven_functions') ],
        loader: [ 'babel-loader', 'woven-loader' ],
      },
    ],
  },
}