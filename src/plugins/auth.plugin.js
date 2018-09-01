
export default {

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
        wx.getUserInfo({
            success: res => {
                resolve(res);
            },
            fail: err => {
                reject(err)
            }
        })
    }),

    getUserInfo1: (options) => new Promise((resolve, reject) => {
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            resolve(res);
                        },
                        fail: err => {
                            reject(err)
                        }
                    })
                }
            },
            fail: err => {
                reject(err)
            }
        })
    }),
}
