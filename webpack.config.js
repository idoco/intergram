const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    widget: [
      path.join(__dirname, 'src', 'widget', 'widget-index.js')
    ],
    chat: [
      path.join(__dirname, 'src', 'chat', 'chat-index.js')
    ],
  },
  output: {
    path: path.join(__dirname, 'dist', 'js'),
    filename: '[name].js',
    publicPath: '/js/'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000
  }
}
