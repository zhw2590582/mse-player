const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader');
const name = 'msePlayer';
let isProd = process.env.NODE_ENV === 'production';

module.exports = {
	devtool: !isProd && '#eval-source-map',
	entry: {
		main: './src/index.ts'
	},
	output: {
		path: path.join(__dirname, 'docs'),
		filename: name + '/' + name + '.js',
		libraryTarget: 'umd'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: {
					loader: 'awesome-typescript-loader'
				}
			}
		]
	},
	plugins: [
		new CheckerPlugin(),
		new UglifyJSPlugin({
			uglifyOptions: {
				compress: {
					warnings: false
				}
			}
		})
	]
};
