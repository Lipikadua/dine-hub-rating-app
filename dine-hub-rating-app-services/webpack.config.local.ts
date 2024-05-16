import nodeBuiltins from 'builtin-modules';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

const LAMBDA_DIR = './src/services';
const lambdaNames = fs.readdirSync(path.join(__dirname, LAMBDA_DIR));

/**
 * Type definitions
 */
type entryMap = Record<string, string[]>;
type externalsMap = Record<string, string>;

// Create entry points for all the lambdas
const lambdaEntries = lambdaNames.reduce((entryMap: entryMap, lambdaName: string) => {
  entryMap[lambdaName] = [path.join(__dirname, LAMBDA_DIR, `${lambdaName}/index.ts`)];
  return entryMap;
}, {} as entryMap);

// Exclude all the non required packages from the bundle
const externals = ['aws-sdk'].concat(nodeBuiltins).reduce((externalsMap, moduleName) => {
  externalsMap[moduleName] = moduleName;
  return externalsMap;
}, {} as externalsMap);

const config: webpack.Configuration = {
  entry: lambdaEntries,
  externals,
  output: {
    path: path.join(__dirname, '.build'),
    libraryTarget: 'commonjs',
    filename: '[name]/index.js',
    clean: true,
  },
  devtool: 'source-map',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [
              '@babel/plugin-transform-runtime',
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-class-properties',
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    mainFields: ['main', 'module'],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // Cleans the /dist directory before the build process
    new CleanWebpackPlugin({
      cleanAfterEveryBuildPatterns: ['./**/*.LICENSE.txt'],
    }),
  ],
};

module.exports = config;
