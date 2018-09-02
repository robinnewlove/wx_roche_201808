//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import QueMixin                 from 'mixins/questionnaire.mixin'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin, QueMixin],
    data: {
        arrData: [],
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
        type: true,
        arrParams: [],
    },
    // 生命周期回调—监听页面加载
    onLoad () {
        this.getArchives();
    },
    // 获取文档
    getArchives () {
        let options = {
            url: 'RocheApi/GetArchives',
            loading: true,
        };
        return Http(options).then((res) => {
            let arrData = [...res];
            arrData.pop();
            this.setData({
                arrParams: res.slice(3),
                arrData: arrData || []
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        Router.push('questionnaire_three_index', {
            arrResult: result,
            arrData: this.data.arrParams,
        }, true);
    },

}));
