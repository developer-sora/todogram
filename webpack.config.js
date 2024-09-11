const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: ['core-js/stable', './src/js/app.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
      favicon: 'static/favicon.ico',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static/assets', to: 'assets' }],
    }),
    new MiniCssExtractPlugin({ filename: 'styles.css' }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          MiniCssExtractPlugin.loader, // CSS를 별도의 파일로 추출
          'css-loader',
          'postcss-loader', // PostCSS와 Tailwind CSS를 처리
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset/inline',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // console.log 제거
          },
          output: {
            comments: false, // 주석 제거
          },
        },
        extractComments: false, // 별도의 주석 파일 생성하지 않음
      }),
    ],
  },
  devServer: {
    static: { directory: path.join(__dirname, 'dist') },
    compress: true,
    port: 'auto',
    open: true,
    hot: true,
  },
  devtool: 'source-map',
};
