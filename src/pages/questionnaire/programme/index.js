//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'

Page(Handle({
    data: {

    },
    onLoad () {
        this.getRecommendSugar();
    },
    getRecommendSugar () {
        let options = {
            url: 'RocheApi/GetRecommendSugar',
            loading: true,
            data: {
                Type: 1
            }
        };
        return Http(options).then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
