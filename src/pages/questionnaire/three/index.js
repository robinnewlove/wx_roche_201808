//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Http                     from 'plugins/http.plugin'
import Router                   from 'plugins/router.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'
import QueMixin                 from 'mixins/questionnaire.mixin'
import RouterMixin              from 'mixins/router.mixin'

Page(Handle({
    mixins: [QueMixin, RouterMixin],
    data: {
        arrData: [],
    },
    onLoad (options) {
        this.getParamsByUrl(options);
        this.initData();
    },
    // 初始化数据
    initData() {
        let {arrData} = this.data.$params;
        this.setData({
            arrData,
        })
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        let data = [
            ...this.data.$params.arrResult,
            ...result,
        ];
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            return this.setArchives(data);
        }).then(() => {
            return Auth.updateToken({IsArchives: true});
        }).then(() => {
            if (this.data.$params.form) Router.pop();
            else if(this.data.$params.IsMember) Router.push('questionnaire_programme_index', {}, true);
            else Router.push('questionnaire_programme_index', {}, true);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 保存用户建档信息
    setArchives (data) {
        let options = {
            url: 'RocheApi/SetArchives',
            loading: true,
            data,
            useOpenId: false,
            auth: false,
        };
        return Http(options);
    }
}));
