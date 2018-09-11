//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    data: {
        userInfo: '',
        objUser: {},
        objView: [
            {
                label: '我的测糖方案',
                url: 'mine_programme_index',
                value: '',
            },
            {
                label: '我的血糖报告',
                url: 'mine_report_index',
                value: '',
            },
            {
                label: '个人信息',
                url: 'mine_info_index',
                value: '',
            },
            {
                label: '绑定 performa connect',
                url: 'bluetooth_index',
                value: '',
            }
        ]
    },
    onShow () {
        this.setData({
            userInfo: app.globalData.userInfo,
        });
        this.getUserSugar();
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        let options = {
            url: 'RocheApi/GetUserSugar',
            loading: true,
        };
        return Http(options).then((res) => {
            let { IsPerfect } = res;
            this.setData({
                objUser: res || {},
                'objView[2].value': IsPerfect ? '已完善' : '待完善',
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let { IsPerfect, IsMember } = this.data.objUser;
        if ( url === 'mine_report_index' && !IsPerfect ) {
            return Router.push('mine_info_index', { from: 'mine_index'});
        }
        if (url === 'mine_programme_index' && IsMember) {
            return Router.push('web_index', WEB_LINK.JKZD);
        }
        Router.push(url);
    }
}));
