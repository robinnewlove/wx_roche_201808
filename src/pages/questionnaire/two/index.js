//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import RouterMixin              from 'mixins/router.mixin'
import QueMixin                 from 'mixins/questionnaire.mixin'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin, QueMixin, RouterMixin],
    data: {
        arrData: [],
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
        type: true,
        arrParams: [],
    },
    // 生命周期回调—监听页面加载
    onLoad (options) {
        this.getParamsByUrl(options);
        this.getArchives();
    },
    // 获取文档
    getArchives () {
        let options = {
            url: 'RocheApi/GetArchives',
            loading: true,
        };
        return Http(options).then((res) => {
            let arr = res || [];
            this.setData({
                arrParams: arr.slice(2) || [],
                arrData:  arr.slice(0,2) || []
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        Router.push('questionnaire_copy_index', {
            ...this.data.$params,
            arrResult: result,
            arrData: this.data.arrParams,
        }, true);
    },

}));
