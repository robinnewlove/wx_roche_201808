

const RouterConfig = require('./../config/router.config');

module.exports = {

    push: (url, type = false) => new Promise((resolve, reject) => {
        let key = type ? 'redirectTo' : 'navigateTo';
        handle(url, key, resolve, reject)
    }),

    root: (url, type = false) => new Promise((resolve, reject) => {
        let key = type ? 'reLaunch' : 'switchTab';
        handle(url, key, resolve, reject)
    }),

    pop(delta) {
        wx.navigateBack({delta});
    }
};

function handle(url, key, resolve, reject) {
    url = RouterConfig[url] || '';
    if (!url) return reject('未找到对应页面');
    wx[key]({
        url,
        success: (e) => {
            resolve(e);
        },
        fail: (e) => {
            reject(e);
        },
    });
}
