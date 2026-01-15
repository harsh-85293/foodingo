const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/App.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      clean: true,
      publicPath: '/',
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { 
                  runtime: 'automatic',
                  development: false
                }]
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: 'body',
        favicon: './public/favicon.ico',
      }),
      new CopyWebpackPlugin({
        patterns: [
          { from: 'public/favicon.ico', to: 'favicon.ico' },
          { from: 'public/_redirects', to: '_redirects', toType: 'file' }
        ],
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: false,
    performance: {
      hints: false,
    },
  };
};