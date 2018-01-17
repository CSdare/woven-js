const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'webpack_test/app.js'),
  output: {
    path: path.resolve(__dirname, 'webpack_test'),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [ 
          { loader: 'babel-loader' },
          { 
            loader: path.resolve('./cat_loader/cat-loader.js'),
            options: { animal: 'kitten', saying: 'pet me' },
          }
        ],
      },
    ],
  },
}