const path = require('path')
const CopyPlugin = require("copy-webpack-plugin")

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/icons", to: "icons" },
        { from: "src/backgrounds", to: "backgrounds" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        type: 'asset',
      },
    ],
  },
};