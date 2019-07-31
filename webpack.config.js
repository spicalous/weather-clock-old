const merge = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpackConfig = require("./webpack.common.config.js");

const babelOptions = {
  presets: [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry",
        "corejs": "2.6.9"
      }
    ]
  ]
};

module.exports = merge(webpackConfig, {
  mode: "production",
  entry: {
    "weather-clock": ["./styles/main.scss", "./src/index.ts"],
    "weather-clock-polyfilled": ["@babel/polyfill", "whatwg-fetch", "./src/index.ts"],
  },
  plugins: [
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: babelOptions
          },
          {
            loader: "ts-loader"
          }
        ]
      },
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
