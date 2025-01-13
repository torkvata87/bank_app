const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env) => ({
  mode: env.prod ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // Минимальный размер чанка
      maxSize: 50000, // Максимальный размер чанка (можно установить на ваше усмотрение)
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      automaticNameDelimiter: '~',
    },
    minimize: true,
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
  devServer: {
    historyApiFallback: true,
    static: './dist',
    port: 8080,
    hot: true,
  },
});


// const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
//
// module.exports = (env) => ({
//   mode: env.prod ? 'production' : 'development',
//   entry: './src/index.js',
//   output: {
//     filename: 'main.js',
//     path: path.resolve(__dirname, 'dist'),
//     publicPath: '/',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(png|svg|jpg|jpeg|gif|ttf)$/i,
//         type: 'asset/resource',
//       },
//       {
//         test: /\.js$/i,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//           options: {
//             presets: [['@babel/preset-env', { targets: 'defaults' }]],
//           },
//         },
//       },
//       {
//         test: /\.css$/i,
//         use: [
//           env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
//           'css-loader',
//         ],
//       },
//     ],
//   },
//   plugins: [
//     new HtmlWebpackPlugin({
//       filename: 'index.html',
//       template: 'index.html',
//     }),
//     new MiniCssExtractPlugin({
//       filename: 'main.css',
//     }),
//   ],
//   optimization: {
//     minimize: true,
//     minimizer: [
//       `...`,
//       new CssMinimizerPlugin(),
//     ],
//   },
//   devServer: {
//     historyApiFallback: true,
//     static: './dist',
//     port: 8080,
//     hot: true,
//   },
// });
