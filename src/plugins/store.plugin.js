export default {
    get: (key) => new Promise((resolve, reject) => {
        let userToken = wx.getStorageSync(key);
        if (userToken) resolve(key);
        else reject(`${key} is undefined`);
    }),
    set: (key, value) => new Promise((resolve, reject) => {
        wx.setStorageSync(key, value);
        return resolve(value);
    }),
    remove: (key, ) => new Promise((resolve, reject) => {
        wx.setStorageSync(key, value);
        return resolve(value);
    }),
}
