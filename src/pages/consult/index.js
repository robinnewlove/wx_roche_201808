//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import WebViewMixin             from 'mixins/webview.mixin'
import {
    WEB_LINK,
}                               from 'config/base.config'

Page(Handle({
    mixins: [WebViewMixin],
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if ( url === 'web_index') {
            return this.jumpWebView(WEB_LINK.ZXWZ);
        }
        Router.push(url);
    },
}));
