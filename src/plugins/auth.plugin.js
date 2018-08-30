
export default {

    // 登录
    login: (options) => new Promise((resolve, reject) => {
        wx.login({
            success: (response) => {
                let { code, errMsg } = response;
                if (!code) return reject(errMsg);
                resolve(code);
            },
            fail: (error) => {
                reject(error)
            }
        });
    }),

    // 获取用户信息
}
