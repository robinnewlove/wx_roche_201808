//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
}                               from 'config/base.config'

Page(Handle({
    // 页面的初始数据
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        userInfo: {},
        objUser: {},
        show: false,
        loading: true,
    },
    // 生命周期回调—监听页面显示
    onShow () {
        Auth.getToken().then((info) => {
            this.firFun(info);
        }).catch(() => {
            Router.push('authorization_index');
        });
    },
    // 用户登录执行的函数
    firFun (info) {
        // 获取用户数据
        this.getUserInfo().then(() => {
            let { IsArchives } = info;
            if (!IsArchives) return Router.push('questionnaire_one_index');
            return this.getIndexSugar();
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
            loading: false,
        };
        return Http(options).then((res) => {
            this.setData({
                objUser: res || {},
                loading: false,
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
    // 当前是 tab 页时，点击 tab 时触发
    onTabItemTap (e) {
        console.log(e);
    },
}));
