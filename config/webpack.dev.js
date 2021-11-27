const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { HotModuleReplacementPlugin } = require("webpack");
const { default: merge } = require("webpack-merge")
const common = require("./webpack.common")

/** @type {import('webpack').Configuration} */
const devConfig = {
    mode: "development",
    devServer: {
        port: 3004,
        static: {
            directory: "../dist",
        },
        open: "/signIn",
        hot: true,
        historyApiFallback: true
    },
    plugins: [new HotModuleReplacementPlugin(), new ReactRefreshWebpackPlugin()],
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                use: ["style-loader", "css-loader", "sass-loader"],
                test: /\.(css|scss|sass)$/,
            },
        ]
    }
}

module.exports = merge(common, devConfig);