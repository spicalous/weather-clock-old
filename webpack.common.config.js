const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/**
 * Common for all configs
 */
module.exports = {
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: [".ts", ".js"]
  }
};
