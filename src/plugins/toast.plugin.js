
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
    }
}
