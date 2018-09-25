/**
 * Created by Administrator on 2018/1/24.
 */
module.exports = {
    publicPath: '/dist',
    outputPath: '/dist',
    copyArr: [
        { from: '../src/assets', to: '../dist/assets' },
        { from: '../src/components', to: '../dist/components' },
        { from: '../src/templates', to: '../dist/templates' },
        { from: '../src/pages', to: '../dist/pages' },
    ]
};
