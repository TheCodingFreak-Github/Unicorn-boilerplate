const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ZipPlugin = require('zip-webpack-plugin');
const dotenv = require('dotenv').config();
const isZip = process.env.CONFIG_ZIP === "true";
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = (env) => {

  return {

    mode: 'development',
    entry: './src/app.js',
    output: {
      filename: 'js/app.js',
      path: path.resolve(__dirname, 'build'),
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            "sass-loader",
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/img/[name].webp",
          },
        },
      ]
    },
    devServer: {
      watchFiles: ['src/**/*'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        hash: true,
        filename: 'index.html',
        template: './src/index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'css/style.css'
      }),
      (isZip || env.CONFIG_ZIP) && new ZipPlugin({
  
        path: 'zip',
        filename: process.env.APP_NAME+".zip"
      
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: './src/assets/images', to: 'assets/images' }]
      }),
    ].filter(Boolean),
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
        new ImageMinimizerPlugin({
          minimizer: {
            implementation: ImageMinimizerPlugin.imageminMinify,
            options: {
              plugins: [
                "imagemin-gifsicle",
                "imagemin-mozjpeg",
                "imagemin-pngquant",
                "imagemin-svgo",
              ],
            },
          },
          generator: [
            {
              type: "asset",
              implementation: ImageMinimizerPlugin.imageminGenerate,
              options: {
                plugins: ["imagemin-webp"],
              },
            },
          ],
        }),
      ],
      minimize: true,

    },
  };
};