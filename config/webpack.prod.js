var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var api = require('./api.prod');


const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    mode: 'production',
    devtool: 'source-map',

    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].chunk.js'
    },

    /*htmlLoader: {
        minimize: false // workaround for ng2
    },*/

    plugins: [
        /*new webpack.NoErrorsPlugin(),*/
        /*new webpack.optimize.DedupePlugin(),*/
        /*new webpack.optimize.UglifyJsPlugin(),*/
        new MiniCssExtractPlugin({
          chunkFilename: '[name].[hash].css'
        }),
        new CopyWebpackPlugin([
            { from: 'public', to: 'public' }
        ]),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV),
                'API': JSON.stringify(api)
            }
        })
    ]
});
