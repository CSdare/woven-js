const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'dev/webpack_test/app.js'),
  output: {
    path: path.resolve(__dirname, 'dev/webpack_test'),
    filename: "bundle.js",
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'custom_loaders')]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [ path.resolve(__dirname, 'dev/functions') ],
        use: [ 
          { loader: 'babel-loader' },
          { 
            loader: 'cat-loader',
            options: { animal: 'kitten', saying: 'pet me' },
          }
        ],
      },
      {
        test: /\.js$/,
        include: [ path.resolve(__dirname, 'dev/functions') ],
        loader: [ 'babel-loader', 'woven-loader' ],
      },
    ],
  },
}