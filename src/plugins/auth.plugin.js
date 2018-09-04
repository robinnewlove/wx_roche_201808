
const $USER_TOKEN = '$USER_TOKEN';

export default {

    // 获取存储的用户相关信息
    getToken: () => new Promise((resolve, reject) => {
        let userToken = wx.getStorageSync($USER_TOKEN);
        if (userToken) resolve(userToken);
        else reject('userToken is undefined');
    }),

    // 更新存储的用户相关信息
    updateToken (user = {}) {
        let _that = this;
        return new Promise((resolve, reject) => {
            let userToken = {};
            _that.getToken().then((res) => {
                userToken = {
                    ...res,
                    ...user,
                };
            }).catch(() => {
                userToken = user;
            }).finally(() => {
                wx.setStorageSync($USER_TOKEN, userToken);
                resolve(userToken);
            });
        })
    },

    // 登录
    login: (options) => new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                let { code, errMsg } = res;
                if (!code) return reject(errMsg);
                resolve(code);
            },
            fail: err => {
                reject(err)
            }
        });
    }),

    // 获取用户信息
    getUserInfo: (options) => new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                if (!res.authSetting['scope.userInfo']) return reject({code: -1, errMsg: 'user no auth'});
                wx.getUserInfo({
                    success: res => {
                        resolve(res);
                    },
                    fail: err => {
                        reject({code: -1, errMsg: 'user no auth'})
                    }
                })
            },
            fail: err => {
                reject({code: -1, errMsg: 'user no auth'})
            }
        });
    }),
}
