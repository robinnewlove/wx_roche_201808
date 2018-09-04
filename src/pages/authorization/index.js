//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'

Page({
    bindGetUserInfo (e){
        let { userInfo } = e.detail;
        if (!userInfo) return;
        this.userLogin();
    },
    // 用户登录
    userLogin () {
        Auth.login().then((result) => {
            let options = {
                url: 'WechatApi/UserLogin',
                data: {
                    code: result,
                },
                loading: true,
            };
            return Http(options);
        }).then((result) => {
            return Auth.updateToken(result);
        }).then(() => {
            Router.pop();
        }).catch((err) => {
            Toast.error(err);
        })
    },
});
