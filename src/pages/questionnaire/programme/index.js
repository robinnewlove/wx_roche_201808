//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import { getDate }              from 'wow-cool/lib/date.lib'

const arrTimeStep = ['空腹', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '睡前'];


Page(Handle({
    data: {
        arrTimeStep,
        result: '',
        DayCount: '',
        Desc: '',
        dataTime: [],
        dayTime: [],
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
        let day = new Date().getDay();
        if (arr) {
            arr.forEach((item) => {

            });
            return;
        }
        let result = [];
        for(let x = 0; x < 7; x++){
            result[x] = [];
            for(let y = 0; y < 7; y++){
                result[x][y] = 0;
            }
        }
        this.setData({
            dayTime: result
        });
    }
}));
