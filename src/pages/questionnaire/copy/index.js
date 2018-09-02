//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'

Page({
    data: {
        arrData: [],
        arrResult: [],
    },
    onLoad (options) {
        let params = Router.getParams(options);
        console.log(params)
        let {arrData, arrResult} = params;
        this.setData({
            arrData,
            arrResult,
        })
    },

});
