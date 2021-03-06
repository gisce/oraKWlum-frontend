const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var OfflinePlugin = require('offline-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'bootstrap-loader',
        'webpack-hot-middleware/client',
        './src/index',
    ],
    output: {
        publicPath: '/dist/',
    },

    module: {
        loaders: [{
            test: /\.scss$/,
            loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
        },
        {
            test: /\.json$/,
            loader: "json-loader"
        }],
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"',
            },
            __DEVELOPMENT__: true,
        }),
        new ExtractTextPlugin('bundle.css'),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
        }),
        new OfflinePlugin({
            updateStrategy: 'changed',
            autoUpdate: 1000 * 60 * 60 * 1, //1h
            ServiceWorker:{
                entry: 'sw.js',
                events: true,
                navigateFallbackURL: '/',
            }
        }),
    ],
};
