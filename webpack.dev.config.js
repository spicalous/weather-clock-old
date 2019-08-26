const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackCommonViewerConfig = require("./webpack.common.viewer.config.js");

module.exports = merge(webpackCommonViewerConfig, {
  mode: "development",
  entry: {
    viewer: ["./viewer/viewer.scss", "./viewer/viewer.tsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, 
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.viewer.json"
        }
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  }
});
