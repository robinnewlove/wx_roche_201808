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
    },
    onLoad (options) {
        let params = Router.getParams(options);
        console.log(params)
        let {arrData, arrResult} = params;
        this.setData({
            arrData,
            arrResult,
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
            this.setArchives(data);
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
        };
        return Http(options).then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
