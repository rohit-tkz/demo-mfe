const path = require("path");

const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
require("dotenv").config();

const deps = require("./package.json").dependencies;

const CONTAINER_APP_URL = process.env.REACT_APP_CONTAINER_APP;
const APP_PUBLIC_PATH = process.env.REACT_APP_PUBLIC_APP;

module.exports = {
  entry: { remote: "./src/index.js" },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-react"],
        },
        resolve: {
          extensions: [".js", ".jsx"],
        },
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack", "file-loader"],
      },
      {
        test: /\.(sass|scss)$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: true,
                localIdentName: "[name]--[local]--[hash:base64:10]",
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(woff|woff2|ttf|eot|png|jpg|gif)$/i,
        use: ["file-loader"],
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  name: "MfeDemo",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: APP_PUBLIC_PATH,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/templates/index.html",
      //   template: "./src/App.jsx",
    }),
    new ModuleFederationPlugin({
      name: "MfeDemoRemote",
      filename: "remoteEntry.js",
      exposes: {
        "./demo": "./src/App.jsx",
      },
      remotes: {
        McpContainer: `McpContainer@${CONTAINER_APP_URL}remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },

        "react-dom": {
          singleton: true,
          requiredVersion: deps["react-dom"],
        },
      },
    }),
    new MiniCssExtractPlugin({
      runtime: false,
    }),
    new webpack.ProvidePlugin({ process: "process/browser.js" }),
    new Dotenv(),
  ],
};
