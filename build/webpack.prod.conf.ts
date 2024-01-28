// @ts-ignore
"use strict";
const path = require("path");
const utils = require("./utils.ts");
const webpack = require("webpack");
const config = require("../config/index.ts");
const { merge } = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf.ts");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ReplaceTemplateStaticUrlPlugin = require("./replace-template-static-url-plugin.ts");
const date = new Date();
const time = `${date.getFullYear()}${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
}${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
const webpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    output: {
        publicPath: "./",
        path: config.build.assetsRoot,
        filename: utils.assetsPath("js/[name].[chunkhash].js"),
        chunkFilename: utils.assetsPath("js/[name].[chunkhash].js"),
    },
    // devtool: config.build.productionSourceMap ? config.build.devtool : false,
    optimization: {
        // 压缩
        minimize: true,

        minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],

        runtimeChunk: {
            name: "manifest",
        },
        splitChunks: {
            // all modules imported more than once
            chunks: "all",
            minSize: 30000, // Minimum size, in bytes, for a chunk to be generated.
            maxSize: 0, // Maximum size, in bytes, for a chunk to be generated.
            minChunks: 1, // Minimum number of chunks that should use a module before splitting.
            maxAsyncRequests: 6, // Maximum number of parallel requests when on-demand loading.
            maxInitialRequests: 4, // Maximum number of parallel requests at the initial page load.
            automaticNameDelimiter: "~", // Delimiter used in the generated names.

            // Cache groups inherits the configuration from above, but with some additional options and defaults override
            cacheGroups: {
                defaultVendors: {
                    // A cache group for node_modules.
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                },

                default: {
                    // A cache group for reused code across multiple chunks.
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },

                twice: {
                    // A cache group for code used in multiple chunks.
                    minChunks: 2,
                    name: "twice",
                    chunks: "all",
                    priority: 6,
                },
            },
        },
    },
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.build.productionSourceMap,
            extract: true,
            usePostCSS: true,
        }),
    },
    plugins: [
        ...utils.getDllManifest(),

        new MiniCssExtractPlugin({
            filename: utils.assetsPath("css/[name].[chunkhash].css"),
            chunkFilename: utils.assetsPath("css/[name].[chunkhash].css"),
            ignoreOrder: true,
        }),

        // generate dist index.html with correct asset hash for caching.
        // you can customize output by editing /index.html
        // see https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: config.build.index,
            template: "index.html",
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            sourceMap: true,

            staticUrl: "{{ STATIC_URL }}",
            timeStamp: time,
        }),

        new ReplaceTemplateStaticUrlPlugin(),
    ],
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require("compression-webpack-plugin");

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: new RegExp(
                "\\.(" + config.build.productionGzipExtensions.join("|") + ")$"
            ),
            threshold: 10240,
            minRatio: 0.8,
        })
    );
}

if (config.build.bundleAnalyzerReport) {
    const BundleAnalyzerPlugin =
        require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
    webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
