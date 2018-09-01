//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'

Page({
    bindGetUserInfo (e){
        let { userInfo } = e.detail;
        console.log(e);
        if (!userInfo) return;
        console.log(userInfo);
        Router.pop();
    },
});
