const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const path = require("path");
const webpack = require('webpack');

/** @type {import('webpack').Configuration} */
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "[name].[contenthash].js",
    publicPath: "",
  },
  module: {
    rules: [
      {
        use: "babel-loader",
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      },
      {
        type: "asset",
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: path.resolve(__dirname, './node_modules/bootstrap-icons/font/fonts'),
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'webfonts',
                publicPath: '../webfonts',
            },
        }
      }
    ],
  },
  resolve: {
    extensions: [".js", ".json", ".jsx"],
    alias: {
      process: 'process/browser',
      stream: "stream-browserify",
      zlib: "browserify-zlib"
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new Dotenv()
  ],
};
