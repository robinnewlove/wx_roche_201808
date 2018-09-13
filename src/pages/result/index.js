//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'
import Calendar, {getMonthDay}  from 'utils/calendar.util'
import { formatData }           from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT,
    GLS_TEXT,
    WEB_LINK,
}                               from 'config/base.config'

const app = getApp();

Page(Handle({
    mixins: [RouterMixin],
    data: {
        glsText: GLS_TEXT,
        userInfo: '',
        resultData: [],
        preDay: 0,
        nextDay: 0,
        months: 0,
        // progress: 0,
        records: []
    },
    onLoad (options) {
        this.setData({
            userInfo: app.globalData.userInfo,
        });
        this.getParamsByUrl(options);
        this.getCalendar();
        this.initData(this.data.$params);
        this.getRecommendSugar();
    },
    initData(data){
        let {
            TestSugarCount,
            PlanCount,
            Records,
        } = data;
        // let progress = Math.floor(TestSugarCount / PlanCount * 100);
        let records = [];
        Records.forEach((item) => {
            let time = +item.replace(/[^0-9]/ig, '');
            let day = new Date(time).getDate();
            records.indexOf(day) === -1 && records.push(day);
        });
        let resultData = this.data.resultData;
        resultData.forEach((item) => {
            item.forEach((ite) => {
                records.forEach((it) => {
                    ite.num === it && (ite.value = 1)
                })
            })
        });
        this.setData({
            // progress,
            records,
            resultData,
        });
    },
    // 获取页面数据
    getCalendar() {
        let {
            preDay,
            resultData,
            nextDay,
            months,
        } = Calendar();
        this.setData({
            preDay,
            resultData,
            nextDay,
            months,
        })
    },
    // 获取血糖记录
    getRecommendSugar() {
        let {
            sTime,
            eTime,
        } = getMonthDay(new Date().getMonth());
        let Stime = formatData('yyyy-MM-dd', new Date(sTime));
        let Etime = formatData('yyyy-MM-dd', new Date(eTime));
        let options = {
            url: 'RocheApi/GetRecommendSugar',
            loading: true,
            data: {
                Stime,
                Etime,
                Type: 2,
            }
        };
        return Http(options).then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        if (!url) return Router.root('home_index');
        let {IsMember} = this.data.userInfo;
        IsMember ? Router.push('web_index', WEB_LINK.JKZD) : Router.push(url);
    }
}));
