const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: 'src/index.html',
        to: 'index.html'
      },
      {
        from: 'node_modules/pdfjs-dist/build/pdf.worker.js',
        to: 'pdf.worker.js'
      },
      {
        from: 'node_modules/pdfjs-dist/build/pdf.worker.js.map',
        to: 'pdf.worker.js.map'
      }
    ])
  ]
};
