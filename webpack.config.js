const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/App.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
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
                  development: !isProduction
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
        favicon: false,
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'eval-source-map',
    devServer: {
      port: 3000,
      hot: false, // Disable hot reload for production
      historyApiFallback: true,
      allowedHosts: 'all',
      client: {
        webSocketURL: 'auto://0.0.0.0:0/ws', // Fix WebSocket connection
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxAssetSize: 500000,
      maxEntrypointSize: 500000,
    },
  };
};