import path from "path"
import webpack, { Configuration, WebpackPluginInstance, RuleSetUseItem } from "webpack"
import { WebpackManifestPlugin } from "webpack-manifest-plugin"
import TerserPlugin from "terser-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin"
import LoadablePlugin from "@loadable/webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"

export const isDev = process.env.NODE_ENV === "development"
const isLocal = process.env.LOCAL === "true"
const isRegisterDiscordCommands = process.env.REGISTER_DISCORD_COMMANDS === "true"

const getStyleLoaders = (isWeb: boolean, isSass?: boolean) => {
    let loaders: RuleSetUseItem[] = [
        {
            loader: "css-loader",
            options: {
                importLoaders: isSass ? 2 : 1,
                modules: {
                    auto: true,
                    localIdentName: "[path][name]__[local]", // Don't use hash:base64, a bug makes it generate different hashes in the .js and the .css files
                    exportOnlyLocals: !isWeb,
                },
            },
        },
        { loader: "postcss-loader" },
    ]

    if (isWeb) loaders = [MiniCssExtractPlugin.loader, ...loaders]

    if (isSass) loaders = [...loaders, { loader: "sass-loader" }]

    return loaders
}

const getPlugins = (isWeb: boolean) => {
    let plugins = [
        new webpack.ProgressPlugin(),
        new WebpackManifestPlugin({
            fileName: path.resolve(process.cwd(), "public/webpack-assets.json"),
            filter: (file) => file.isInitial,
        }),
        new LoadablePlugin({
            writeToDisk: true,
            filename: "../loadable-stats.json",
        }),
        // Setting global variables
        new webpack.DefinePlugin({
            __CLIENT__: isWeb,
            __SERVER__: !isWeb,
            __DEV__: isDev,
            __LOCAL__: isLocal,
            __REGISTER_DISCORD_COMMANDS__: isRegisterDiscordCommands,
            API_URL: `"${process.env.API_URL}"` || "'http://localhost:3000'",
        }),
    ]

    if (isDev)
        plugins = [
            ...plugins,
            // Runs TypeScript type checker on a separate process
            new ForkTsCheckerWebpackPlugin({
                // (Required) Same as eslint command
                eslint: { files: "./src/**/*.{js,jsx,ts,tsx}" },
            }),
        ]

    if (!isDev)
        plugins = [
            ...plugins,
            // Visualize size of webpack output files, see: https://github.com/webpack-contrib/webpack-bundle-analyzer
            new BundleAnalyzerPlugin({
                analyzerMode: process.env.NODE_ENV === "analyze" ? "server" : "disabled",
            }),
        ]

    return plugins
}

const config = (isWeb = false): Configuration => ({
    mode: isDev ? "development" : "production",
    stats: "minimal",
    context: path.resolve(process.cwd()),
    output: { clean: true },
    optimization: {
        minimizer: [
            new TerserPlugin({
                // See more options: https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                terserOptions: { compress: { drop_console: false } },
            }),
        ],
    },
    plugins: getPlugins(isWeb) as WebpackPluginInstance[],
    module: {
        rules: [
            {
                test: /\.(t|j)sx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    caller: { target: isWeb ? "web" : "node" },
                    cacheDirectory: isDev,
                },
            },
            {
                test: /\.css$/,
                use: getStyleLoaders(isWeb),
            },
            {
                test: /\.(scss|sass)$/,
                use: getStyleLoaders(isWeb, true),
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset",
                generator: { emit: isWeb },
            },
            {
                test: /\.(png|svg|jpe?g|gif)$/i,
                type: "asset",
                generator: { emit: isWeb },
            },
        ],
    },
    resolve: {
        modules: ["src", "node_modules"],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    },
})

export function getClientEnvironment(allowedKeys: string[]): any {
    const raw = Object.keys(process.env)
        // Custom regex to allow only a certain category of variables available to the application
        .filter((key) => allowedKeys.indexOf(key) >= 0)
        .reduce(
            (env: any, key: string) => {
                env[key] = process.env[key]
                return env
            },
            {
                NODE_ENV: process.env.NODE_ENV || "development",
            }
        )
    // Stringify all values so we can feed into Webpack DefinePlugin
    const stringified = {
        "process.env": Object.keys(raw).reduce((env: any, key: string) => {
            env[key] = JSON.stringify(raw[key])
            return env
        }, {}),
    }

    return stringified
}

export default config
