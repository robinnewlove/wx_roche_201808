//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'

Page(Handle({
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.push(url);
    }
}));
