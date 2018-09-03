//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'

// Page(Object) 函数用来注册一个页面。接受一个 Object 类型参数，其指定页面的初始数据、生命周期函数、事件处理函数等。
Page(Handle({
    // 页面的初始数据
    data: {
        userInfo: {},
        objUser: {},
    },
    // 生命周期回调—监听页面加载
    onLoad () {
        // this.userLogin();
    },
    // 生命周期回调—监听页面显示
    onShow () {
        Auth.getToken().then((info) => {
            this.firFun(info);
        }).catch(() => {
            this.userLogin();
        });
    },
    // 用户登录
    userLogin () {
        Auth.login().then((result) => {
            let options = {
                url: 'WechatApi/UserLogin',
                data: {
                    code: result,
                },
                loading: true,
            };
            return Http(options);
        }).then((result) => {
            return Auth.updateToken(result);
        }).then((info) => {
            this.firFun(info);
        }).catch((err) => {
            Toast.error(err);
        })
    },
    // 用户登录执行的函数
    firFun (info) {
        let { IsArchives } = info;
        // if (AccessToken || OpenId) throw 'not login';
        // 获取用户数据
        this.getUserInfo().then(() => {
            if (!IsArchives) return Router.push('questionnaire_one_index');
            this.getIndexSugar();
        }).catch((err) => {
            let { code } = err;
            if (code === -1) return Router.push('authorization_index');
            Toast.error(err);
        });
    },
    // 首页个人血糖基本信息
    getIndexSugar () {
        let options = {
            url: 'RocheApi/GetIndexSugar',
            loading: true,
        };
        return Http(options).then((res) => {
            this.setData({
                objUser: res || {},
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 获取用户信息
    getUserInfo () {
        return Auth.getUserInfo().then((info) => {
            // 用户已经授权
            let {userInfo} = info;
            // console.log('用户信息', userInfo);
            this.setData({
                userInfo: userInfo,
            })
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let params = currentTarget.dataset.params;
        if (url) Router.push(url, params);
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
}));
