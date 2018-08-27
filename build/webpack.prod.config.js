
const path = require('path');
const fs = require('fs-extra');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const webpackConfig = require('../config');
const entry = {};
let walkFun = '';
let uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin({
    compress: {
        unused: true,
        dead_code: true,
        warnings: false,
        screw_ie8: true,
    }
});

/**
 * 遍历获取目录结构
 * */
(walkFun = (dir) => {
    dir = dir || '.';
    let directory = path.join(__dirname, '../src', dir);
    fs.readdirSync(directory).forEach((file) => {
        let full_path = path.join(directory, file);
        let dir_arr = full_path.replace(/\\/g, '/').split('\/');
        let name_arr = full_path.substring(full_path.indexOf('src') + 4).replace(/\\/g, '/').split('\/');
        let last_dir = dir_arr[dir_arr.length - 1];
        let stat = fs.statSync(full_path);
        let ext_name = path.extname(full_path);
        if (stat.isFile() && ext_name === '.js') {
            let page_name = name_arr.join('/').replace('.js', '');
            entry[page_name] = full_path;
        } else if (['js','css','img','scss', 'images', 'image'].indexOf(last_dir) === -1 && stat.isDirectory()) {
            let sub_dir = path.join(dir, file);
            walkFun(sub_dir);
        }
    })
})();

const config = {
    entry: entry,
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '..' + webpackConfig.outputPath)
    },
    resolve: {
        alias: {
            'utils': path.resolve(__dirname, '../src/utils/'),
        }
    },
    module: {
        rules: [
            {
                test: /\.js(\?[^?]+)?$/,
                loaders: ['babel-loader'],
                exclude: /node_modules/
            },
            //处理css文件
            {
                test: /\.wxss/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                }),
            },
            // {
            //     test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            //     loader: 'url-loader',
            //     exclude: /node_modules/,
            //     options: {
            //         name: 'media/[name].[ext]'
            //     }
            // },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: './build/copy-loader.js',
                exclude: /node_modules/,
            },
            {
                test: /\.wxml/,
                loader: './build/copy-loader.js',
                exclude: /node_modules/,
            },
            {
                test: /\.json/,
                loader: './build/copy-loader.js',
                exclude: /node_modules/,
            },
        ]
    },
    node: {
        fs: 'empty'
    },
    plugins: [
        uglifyJsPlugin,
        new ExtractTextPlugin('[name].wxss'),
    ]
};

module.exports = config;
