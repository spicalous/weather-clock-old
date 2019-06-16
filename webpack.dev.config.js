const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require("./webpack.config.js");

module.exports = merge(webpackConfig, {
  mode: "development",
  entry: {
    viewer: ["./viewer/viewer.scss", "./viewer/viewer.js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Weather clock viewer"
    })
  ]
});
