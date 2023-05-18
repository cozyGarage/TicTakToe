const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV ?? 'development',
  entry: './src/entrypoint.jsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
  },
};