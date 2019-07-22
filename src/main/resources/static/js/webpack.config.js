const path = require('path');

module.exports={
    mode: 'none',
    entry: './fairwidget.js',
    output: {
        path: path.resolve(__dirname, ''),
        filename: 'bundle.js'
      }
}