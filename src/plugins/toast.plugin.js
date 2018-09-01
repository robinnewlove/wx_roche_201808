
export default {
    error (err) {
        console.log(err);
        let msg = err.errMsg || err;
        wx.showToast({
            title: msg,
            icon: 'none',
            duration: 3000
        })
    }
}
