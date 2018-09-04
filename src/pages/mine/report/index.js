//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import { getDate }              from 'wow-cool/lib/date.lib'
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
    },
    onLoad () {
        this.initData();
        this.getRecommendSugar();
    },
    getRecommendSugar () {
        let Stime = getDate(0, 'yyyy-MM-dd');
        let Etime = getDate(6, 'yyyy-MM-dd');
        let options = {
            url: 'RocheApi/GetRecommendSugar',
            loading: true,
            data: {
                Stime,
                Etime,
                Type: 1,
            }
        };
        return Http(options).then((res) => {
            let { DayCount, Desc, Steps } = res;
            this.setData({
                DayCount,
                Desc,
            });
            this.initData(Steps)
        }).catch((err) => {
            Toast.error(err);
        });
    },
    initData (arr) {
        let dayText = [];
        for (let i = 0; i < 7; i++) {
            let cur = new Date();
            dayText.push(new Date(cur.setDate(cur.getDate() + i)).getDay())
        }
        if (arr) {
            arr.forEach((item) => {
                let { Day, TimeStep } = item;
                this.data.dayTime.forEach((it, ind) => {
                    if (Day === 7) Day = 0;
                    if (it[0] === Day) {
                        let sItem = `dayTime[${ind}][${TimeStep}]`;
                        this.setData({
                            [sItem]: 1,
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
                    result[x][y] = dayText[x];
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
