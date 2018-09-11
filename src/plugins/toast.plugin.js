
export default {
    error (err) {
        if (!err) return;
        console.log(err);
        let msg = err.errMsg || err;
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
        })
    },
    confirm: (options = {}) => new Promise((resolve, reject) => {
        wx.showModal({
            title: '温馨提示',
            ...options,
            success: res=>{
                resolve(res);
            },
            fail: err => {
                reject(err);
            },
        });
    })
}
