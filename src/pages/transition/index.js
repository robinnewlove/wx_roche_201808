//index.js
import './index.json'
import './index.scss'
import './index.wxml'

const app = getApp();

import Router                   from 'plugins/router.plugin'

Page({
    onLoad (options) {
        let sceneid = options.sceneid
            ? decodeURIComponent(options.sceneid)
            : '2';
        app.globalData.sceneid = sceneid;
        console.log('进入过渡页')
        Router.root('home_index');
    }
});
