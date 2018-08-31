
export default {
    error (err) {
        let msg = err.errMsg || err;
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
        })
    }
}
