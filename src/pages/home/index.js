//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import WebViewMixin             from 'mixins/webview.mixin'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [WebViewMixin],
    // 页面的初始数据
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        userInfo: {},
        objUser: {},
        show: false,
        loading: true,
        arrClass: ['low', 'lit', 'lit', 'nor', 'up'],
        objWeb: WEB_LINK.ZXWZ
    },
    onLoad (options) {
        let scene = '';
        if (options.scene) scene = decodeURIComponent(options.scene);
        console.log(options);
        console.log(app.globalData.sceneid)
        scene && (app.globalData.sceneid = scene);
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
            let { IsArchives, IsMember} = info;
            if (!IsArchives) return Router.push('questionnaire_one_index', { IsMember });
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
        return Http(options).then((res = '') => {
            this.setData({
                objUser: res || {},
                'objUser.Bloodsugar': res.Bloodsugar ? res.Bloodsugar.toFixed(1) : res.Bloodsugar,
                loading: false,
            });
            let { IsMember } = res;
            app.globalData.userInfo.IsMember = res.IsMember;
            Auth.updateToken({IsMember});
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
            });
            app.globalData.userInfo = userInfo;
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let params = currentTarget.dataset.params;
        let { IsPerfect } = this.data.objUser;
        if ( url === 'mine_report_index' && !IsPerfect ) {
            return Router.push('mine_info_index', { from: 'home_index', IsMember: app.globalData.userInfo.IsMember});
        }
        if ( url === 'web_index') {
            return this.jumpWebView(params);
        }
        Router.push(url, params);
    },
}));
