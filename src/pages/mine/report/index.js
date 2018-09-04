//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import { getDate, formatData }  from 'wow-cool/lib/date.lib'
import {
    ARR_TIME_STEP,
    DAY_TEXT
}                               from 'config/base.config'

Page({
    data: {
        arrTimeStep: ARR_TIME_STEP,
        result: '',
        DayCount: '',
        Desc: '',
        dayTime: [],
        dayText: DAY_TEXT,
        sTime: '',
        eTime: '',

        vSTime1: '',
        vETime1: '',
        vSTime2: '',
        vETime2: '',

        curTime: new Date().getTime(),
    },
    onLoad () {
        this.getDay();
        this.initData();
        this.getRecommendSugar();
    },

    handlePreOrNext (e) {
        let { currentTarget } = e;
        let count = +currentTarget.dataset.count;
        let date = new Date(this.data.curTime);
        date.setDate(date.getDate() + count);
        this.setData({
            curTime: date.getTime(),
        });
        this.getDay();
        this.initData();
        this.getRecommendSugar();
    },

    // 获取日期
    getDay () {
        let date = new Date(this.data.curTime);
        let day = date.getDay();
        let result = '';
        switch (day){
            case 0:
                result = {
                    sTime: getDate(-6, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(0, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 1:
                result = {
                    sTime: getDate(0, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(6, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 2:
                result = {
                    sTime: getDate(-1, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(5, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 3:
                result = {
                    sTime: getDate(-2, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(4, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 4:
                result = {
                    sTime: getDate(-3, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(3, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 5:
                result = {
                    sTime: getDate(-4, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(2, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
            case 6:
                result = {
                    sTime: getDate(5, 'yyyy-MM-dd', new Date(this.data.curTime)),
                    eTime: getDate(1, 'yyyy-MM-dd', new Date(this.data.curTime)),
                };
                break;
        }
        let {sTime, eTime} = result;
        this.setData( {
            sTime,
            eTime,
            vSTime1: formatData('yyyy/MM/dd', new Date(sTime)),
            vETime1: formatData('yyyy/MM/dd', new Date(eTime)),
            vSTime2: formatData('MM/dd', new Date(sTime)),
            vETime2: formatData('MM/dd', new Date(eTime)),
        });
        return result;
    },
    // 获取报告
    getRecommendSugar () {
        let Stime = this.data.sTime;
        let Etime = this.data.eTime;
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
            let { DayCount, Desc, Steps } = res;
            this.setData({
                DayCount,
                Desc,
            });
            if (!Steps) return;
            this.initData(Steps)
        }).catch((err) => {
            Toast.error(err);
        });
    },
    initData (arr) {
        if (arr) {
            arr.forEach((item) => {
                let { Day, TimeStep, Bloodsugar} = item;
                this.data.dayTime.forEach((it, ind) => {
                    if (Day === 7) Day = 0;
                    if (it[0] === Day) {
                        let sItem = `dayTime[${ind}][${TimeStep}]`;
                        this.setData({
                            [sItem]: item,
                        });
                    }
                });
            });
            return;
        }
        let result = [];
        for(let x = 0; x < 7; x++){
            result[x] = [];
            for(let y = 0; y < 8; y++){
                if (y === 0) {
                    result[x][y] = (x+1) % 7;
                } else {
                    result[x][y] = -1;
                }
            }
        }
        this.setData({
            dayTime: result
        });
    },
});
