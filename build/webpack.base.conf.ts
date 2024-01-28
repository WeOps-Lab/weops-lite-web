// @ts-ignore
"use strict";
const path = require("path");
const utils = require("./utils.ts");
const config = require("../config/index.ts");
const vueLoaderConfig = require("./vue-loader.conf.ts");
const webpack = require("webpack");
const { VueLoaderPlugin } = require("vue-loader");

const fs = require("fs");

const projectsDir = path.resolve(__dirname, "../src/projects");
const projects = fs.readdirSync(projectsDir);
const extAlias = {};
projects.forEach((project) => {
    const aliasName = `@${project}`;
    const projectPath = path.resolve(projectsDir, project);
    extAlias[aliasName] = projectPath;
});

function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

const isOpenEsLint =
    config.dev.useEslint && process.env.NODE_ENV !== "production";

const createLintingRule = () => ({
    test: /\.(js|vue)$/,
    loader: "eslint-loader",
    enforce: "pre",
    include: [resolve("src"), resolve("test")],
    options: {
        formatter: require("eslint-friendly-formatter"),
        emitWarning: !config.dev.showEslintErrorsInOverlay,
    },
});

const createTsLintingRule = () => ({
    test: /\.(vue|ts|tsx)$/,
    exclude: /node_modules/,
    enforce: "pre",
    use: [
        {
            loader: "tslint-loader",
            options: {
                tsConfigFile: "tsconfig.json",
            },
        },
    ],
});

module.exports = {
    externals: {
        // 新增
        microRouter: "microRouter",
    },
    context: path.resolve(__dirname, "../"),
    entry: {
        app: "./src/main.ts",
    },
    output: {
        path: config.build.assetsRoot,
        filename: "[name].js",
        publicPath:
            process.env.NODE_ENV === "production"
                ? config.build.assetsPublicPath
                : config.dev.assetsPublicPath,
    },
    resolve: {
        extensions: [".js", ".vue", ".json", ".ts"],
        // modules: [
        //     resolve('src'),
        //     resolve('node_modules')
        //   ],
        alias: {
            vue$: "vue/dist/vue.esm.js",
            "@": resolve("src"),
            ...extAlias,
        },
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            jquery: "jquery",
            "window.jQuery": "jquery",
        }),
        new VueLoaderPlugin(),
        // new HardSourceWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    resolve("src"),
                    resolve("test"),
                    resolve("node_modules/webpack-dev-server/client"),
                ],
                use: [
                    {
                        loader: "thread-loader",
                        options: {
                            workers: 2, // 进程2个
                        },
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                        },
                    },
                ],
            },
            ...(isOpenEsLint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: vueLoaderConfig,
            },
            {
                test: /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/,
                type: "asset/inline",
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                type: "asset/inline",
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                type: "asset/inline",
            },
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                    transpileOnly: true,
                    happyPackMode: true,
                },
            },
        ],
    },
};
