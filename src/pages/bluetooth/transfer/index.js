//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [RouterMixin],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
    },
    onLoad(options) {
        this.getParamsByUrl(options);
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let { IsMember } = app.globalData.userInfo;
        if (!url) return Router.root('home_index');
        IsMember ? Router.push('web_index', WEB_LINK.JKZD) : Router.push(url);
    }
}));
