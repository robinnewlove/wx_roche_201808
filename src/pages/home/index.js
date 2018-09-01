//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'

//获取应用实例
const app = getApp();

// Page(Object) 函数用来注册一个页面。接受一个 Object 类型参数，其指定页面的初始数据、生命周期函数、事件处理函数等。
Page({
    // 页面的初始数据
    data: {
        userInfo: {}
    },
    // 生命周期回调—监听页面加载
    onLoad () {
        Router.push('questionnaire_one_index');
    },
    // 获取用户信息
    getUserInfo () {
        Auth.getUserInfo().then((info) => {
            // 用户已经授权
            let {userInfo} = info;
            // console.log('用户信息', userInfo);
            this.setData({
                userInfo: userInfo,
            })
        }).catch((err) => {
            // 未授权
            Toast.error(err);
            Router.push('authorization_index')
        })
    },
    // 生命周期回调—监听页面显示
    onShow () {
        this.getUserInfo();
    },
    // 生命周期回调—监听页面初次渲染完成
    onReady () {

    },
    // 生命周期回调—监听页面隐藏
    onHide () {

    },
    // 生命周期回调—监听页面卸载
    onUnload () {

    },
    // 监听用户下拉动作
    onPullDownRefresh () {

    },
    // 页面上拉触底事件的处理函数
    onReachBottom () {

    },
    // 用户点击右上角转发
    onShareAppMessage () {

    },
    // 页面滚动触发事件的处理函数
    onPageScroll () {

    },
    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap () {

    },
});
