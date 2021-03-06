//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import Store                    from 'plugins/store.plugin'
import WebViewMixin             from 'mixins/webview.mixin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                               from 'config/store.config'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [WebViewMixin],
    data: {
        arrTimeStep: ARR_TIME_STEP,
        glsText: GLS_TEXT,
        $params: ''
    },
    onLoad() {
        Store.get($BLUE_TOOTH_DATA).then(($params) => {
            console.log($params)
            this.setData({$params})
        }).catch((err) => {

            console.log(err)
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let { IsMember } = app.globalData.userInfo;
        if (!url) return Router.root('home_index');
        IsMember ? this.jumpWebView(WEB_LINK.JKZD) : Router.push(url);
    }
}));
