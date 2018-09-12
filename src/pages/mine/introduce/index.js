//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
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
        Router.push('questionnaire_one_index', { IsMember: true });
    },
    handleJumpApp () {
        console.log(1)
        wx.navigateToMiniProgram({
            ...SHOP_APP,
            success(res) {
                // 打开成功
            }
        })
    }
}));
