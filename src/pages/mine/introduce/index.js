//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import Router                   from 'plugins/router.plugin'
import { SHOP_APP }             from 'config/base.config'

Page(Handle({
    mixins: [RouterMixin],
    onLoad (options) {
        this.getParamsByUrl(options);
    },
    // 跳转
    handleJump (e) {
        this.data.$params.IsMember
            ? Router.push('questionnaire_activation_index', { IsMember: true })
            : Router.push('questionnaire_one_index', { IsMember: true })
    },
    handleJumpApp () {
        wx.navigateToMiniProgram({
            ...SHOP_APP,
            success(res) {
                // 打开成功
            }
        })
    }
}));
