//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import Router                   from 'plugins/router.plugin'

Page(Handle({
    mixins: [RouterMixin],
    onLoad (options) {
        this.getParamsByUrl(options);
    },
    // 购买会员
    handleClick () {
        this.setMemberInfo();
    },
    // 购买会员
    setMemberInfo () {
        let options = {
            url: 'RocheApi/SetMemberInfo',
            data: {
                code: 'abdd',
            },
            loading: true,
        };
        return Http(options).then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.push(url);
    },
    handleJumpApp () {
        console.log(1)
        wx.navigateToMiniProgram({
            appId: 'wxa3eefe9efc0fcfeb', // 要跳转的小程序的appid
            path: 'pages/shop/index?storeId=7360299', // 跳转的目标页面
            envVersion: 'develop',
            success(res) {
                // 打开成功
            }
        })
    }
}));
