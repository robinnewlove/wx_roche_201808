//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'

Page(Handle({
    mixins: [InputMixin],
    data: {
        arrData: []
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
            this.setData({
                arrData: res || []
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    handleSubmit () {
        Router.push('questionnaire_three_index');
    },
}));
