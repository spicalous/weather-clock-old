const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackConfig = require("./webpack.common.config.js");

module.exports = merge(webpackConfig, {
  mode: "production",
  entry: {
    viewer: ["./viewer/viewer.scss", "./viewer/viewer.js"]
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
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              // webpack requires an identifier (ident) in options when {Function}/require is used (Complex Options).
              // The ident can be freely named as long as it is unique. It's recommended to name it (ident: 'postcss')
              ident: "postcss",
              plugins: () => [
                require("autoprefixer")(),
                require("cssnano")()
              ]
            }
          },
          "sass-loader"
        ]
      }
    ]
  }
});
