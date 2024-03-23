import path from "path"
import webpack, { Configuration } from "webpack"
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import CssMinimizerPlugin from "css-minimizer-webpack-plugin"
import CompressionPlugin from "compression-webpack-plugin"
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin"
import merge from "webpack-merge"

import baseConfig, { isDev, getClientEnvironment } from "./base.config"

const getPlugins = () => {
    let plugins = [
        new MiniCssExtractPlugin({
            // Don't use hash in development, we need the persistent for "renderHtml.ts"
            filename: isDev ? "[name].css" : "[name].[contenthash].css",
            chunkFilename: isDev ? "[id].css" : "[id].[contenthash].css",
        }),
        new webpack.DefinePlugin(getClientEnvironment(["FORCE_ORANGE_PUBLIC_VAPID_KEY"])),
    ] as any[]

    if (isDev)
        plugins = [
            ...plugins,
            new webpack.HotModuleReplacementPlugin(),
            new ReactRefreshWebpackPlugin({ overlay: { sockIntegration: "whm" } }),
            new webpack.DefinePlugin({
                process: "process/browser",
            }),
        ]

    if (!isDev)
        plugins = [
            ...plugins,
            // Prepare compressed versions of assets to serve them with Content-Encoding
            new CompressionPlugin(),
            new ImageMinimizerPlugin({
                // Lossless optimization with default option, feel free to experiment with options for better result for you
                // See https://github.com/webpack-contrib/image-minimizer-webpack-plugin#getting-started
                minimizerOptions: {
                    plugins: [["gifsicle"], ["jpegtran"], ["optipng"], ["svgo"]],
                },
            }),
        ]

    return plugins
}

const config: Configuration = {
    devtool: isDev ? "inline-source-map" : "hidden-source-map",
    entry: isDev ? ["webpack-hot-middleware/client?reload=true", "./src/client"] : "./src/client",
    output: {
        filename: isDev ? "[name].js" : "[name].[contenthash].js",
        chunkFilename: isDev ? "[id].js" : "[id].[contenthash].js",
        path: path.resolve(process.cwd(), "public/assets"),
        publicPath: "/assets/",
    },
    optimization: { minimizer: [new CssMinimizerPlugin()] },
    plugins: getPlugins(),
    performance: {
        maxAssetSize: 512000,
        maxEntrypointSize: 512000,
    },
}

export default merge(baseConfig(true), config)
