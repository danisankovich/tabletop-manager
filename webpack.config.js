const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 1. Require the plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { library } = require('webpack');

module.exports = {
  // Set the mode (development or production)
  mode: 'development', 
  // Define the entry point of your application
  entry: './src/index.ts',
  // Configure the output bundle
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output to a 'dist' folder
  },
  // Define rules for handling different file types
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Test for .ts or .tsx files
        use: 'ts-loader', // Use ts-loader to compile them
        exclude: /node_modules/, // Exclude node_modules
      },
    //   {
    //     test: /\.css$/i, // Regex to match .css files
    //     use: [
    //       MiniCssExtractPlugin.loader, // Use MiniCssExtractPlugin loader for production build
    //       'css-loader', // Handles CSS imports
    //     ],
    //   },
    ],
  },
  // Resolve file extensions
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  // Add source maps for easier debugging in the browser
  devtool: 'inline-source-map',
  // Configure the development server
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    compress: true,
    port: 3000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 2. Specify the source HTML template file
      title: 'Tabletop Manager', // Optional: customize the HTML title tag
    }),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css', // Output path and filename for the CSS file in dist
    // }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/battle_maps', // Source glob pattern
          to: 'battle_maps',         // Destination in the dist folder (e.g., dist/json/data.json)
        }, {
          from: 'src/styles', // Source glob pattern
          to: 'styles',         // Destination in the dist folder (e.g., dist/json/data.json)
        },
      ],
    })
  ]
};
