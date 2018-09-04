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

Page(Handle({
    mixins: [RouterMixin],
    data: {
        resultData: [],
        preDay: 0,
        nextDay: 0,
        months: 0,
    },
    onLoad () {
        this.getCalendar();
        this.getRecommendSugar();
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
        url ? Router.push(url) : Router.root('home_index');
    }
}));
