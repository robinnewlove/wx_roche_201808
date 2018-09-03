//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import { getDate }              from 'wow-cool/lib/date.lib'

Page(Handle({
    data: {

    },
    onLoad () {
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
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
