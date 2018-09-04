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

Page(Handle({
    mixins: [QueMixin],
    data: {
        arrData: [],
        arrResult: [],
        form: '',
    },
    onLoad (options) {
        let params = Router.getParams(options);
        let {arrData, arrResult, form} = params;
        this.setData({
            arrData,
            arrResult,
            form,
        })
    },
    // 提交下一步
    handleSubmit () {
        let result = this.checkData(this.data.arrData);
        if (!result.length) return;
        let data = [
            ...this.data.arrResult,
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
            if (this.data.form) Router.pop();
            else Router.push('questionnaire_programme_index', {}, true)
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
