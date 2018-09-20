//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import Auth                     from 'plugins/auth.plugin'

Page(Handle({
    mixins: [RouterMixin],
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.getParamsByUrl(options);
        wx.setNavigationBarTitle({title: this.data.$params.title})
    },
}));
