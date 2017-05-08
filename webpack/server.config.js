const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const VueSSRPlugin = require('vue-ssr-webpack-plugin');
const webpack = require('webpack');
const merge = require('webpack-merge');

const base = require('./base.config');
const isProd = (process.env.NODE_ENV === 'production');

module.exports = merge(base, {
    target: 'node',
    entry: './src/entry/server.ts',
    output: {
        libraryTarget: 'commonjs2'
    },
    externals: Object.keys(require('../package.json').dependencies),
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                VUE_ENV: '"server"',
                API_URL: JSON.stringify(process.env.SERVER_API_URL)
            }
        }),
        new VueSSRPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/templates/index.server.html',
            filename: 'index.server.html',
            minify: isProd
                ? {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                }
                : undefined
        }),
        new CopyWebpackPlugin([
            { from: 'assets/img', to: 'img' },
            { from: 'server.js', to: 'server.js' }
        ])
    ]
});
