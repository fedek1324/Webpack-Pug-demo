const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const PugPlugin = require('pug-plugin');


const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        index: './index.pug',
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.js', '.png'], // теперь можно писать import '../jsFile' без .js в конце
                            // (но на самом деле это стандартная конфигуряция для .js)
        alias: {
            '@models': path.resolve(__dirname, 'src/models'),
            '@': path.resolve(__dirname, 'src'),
        }
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            `...`,
            new CssMinimizerPlugin(),
          ],
    },
    devServer: {
        open: true,
        port: 4200,
        hot: isDev
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]  
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css', 
        }),
        new PugPlugin({
            extractCss: {
              // output filename of CSS files
              filename: '[name].[contenthash:8].css',
            },
          })
    ],
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: ['css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource'
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                type: 'asset/resource'
            },
            {
                test: /\.pug$/,
                loader: PugPlugin.loader, // PugPlugin already contain the pug-loader
                options: {
                  method: 'render', // fastest method to generate static HTML files
                }
            },
        ]
    }
}