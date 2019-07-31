const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackConfig = require("./webpack.common.config.js");

module.exports = merge(webpackConfig, {
  mode: "development",
  entry: {
    viewer: ["./viewer/viewer.scss", "./viewer/viewer.ts"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Weather clock viewer"
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/, loader: "ts-loader"
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  }
});
