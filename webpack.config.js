const path = require('path');
const WXAppWebpackPlugin = require('wxapp-webpack-plugin').default;
console.log(WXAppWebpackPlugin)
module.exports = {
    // 引入 `app.js`
    entry: './src/app.js',
    output: {
        filename: 'bundle.js',
        // 此处 `dist` 为微信开发者工具引入的开发目录
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        // 引入插件
        new WXAppWebpackPlugin(),
    ],
    module: {
        rules: [], // 各种 loaders 在这里添加
    },
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.js'],
    },
};
