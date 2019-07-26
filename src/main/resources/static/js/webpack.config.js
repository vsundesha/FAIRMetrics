const path = require('path');

module.exports={
  mode: 'none',
  entry: './fairwidget.js',
  output: {
    path: path.resolve(__dirname, ''),
    libraryTarget: 'this',
    filename: 'bundle.js'
  },
  module: {
    // rules will get concatenated!
    rules: [{
      test: /\.css$/,
      use: [{
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
        },
      ]
    }],
  },
}