const merge = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackCommonConfig = require("./webpack.common.config.js");

/**
 * Common config for viewer builds
 * - dev viewer
 * - production viewer
 */
module.exports = merge.strategy({ 
  "resolve.extensions": "replace"
})(webpackCommonConfig, {
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Weather clock viewer"
    }),
    new MiniCssExtractPlugin()
  ],
});
