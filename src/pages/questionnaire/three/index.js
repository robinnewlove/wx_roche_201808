//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import QueMixin                 from 'mixins/questionnaire.mixin'

Page(Handle({
    mixins: [QueMixin],
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

}));
