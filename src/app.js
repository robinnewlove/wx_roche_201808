import './app.json'
import './app.wxss'
import 'utils/es6-promise.util'

import AuthPlugin               from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'

// app.js
App({
    // 生命周期函数--监听小程序初始化,
    // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
    onLaunch () {
        AuthPlugin.login().then((result) => {
            console.log(result)
            let options = {
                url: 'WechatApi/UserLogin',
                data: {
                    code: result,
                },
                loading: true,
            };
            Http(options).then((result) => {

            }).catch((error) => {

            }).finally(() => {
                console.log('执行完成')
            })
        }).catch((error) => {
            console.log(error)
        });
        // // 获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //             wx.getUserInfo({
        //                 success: res => {
        //                     // 可以将 res 发送给后台解码出 unionId
        //                     this.globalData.userInfo = res.userInfo
        //
        //                     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //                     // 所以此处加入 callback 以防止这种情况
        //                     if (this.userInfoReadyCallback) {
        //                         this.userInfoReadyCallback(res)
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // })
    },
    // 生命周期函数--监听小程序显示
    // 当小程序启动，或从后台进入前台显示，会触发 onShow
    onShow () {

    },
    // 生命周期函数--监听小程序隐藏
    // 当小程序从前台进入后台，会触发 onHide
    onHide () {

    },
    // 错误监听函数
    // 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
    onError (msg) {
        console.log(msg);
    },
    // 页面不存在监听函数
    // 当小程序出现要打开的页面不存在的情况，会带上页面信息回调该函数，详见下文
    onPageNotFound () {
        // 开发者可以在 onPageNotFound 回调中进行重定向处理，但必须在回调中同步处理，异步处理（例如 setTimeout 异步执行）无效。
    },
    globalData: {
        userInfo:null,
    }
});
