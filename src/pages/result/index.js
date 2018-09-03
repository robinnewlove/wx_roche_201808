//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import RouterMixin              from 'mixins/router.mixin'

Page(Handle({
    mixins: [RouterMixin],
    data: {
        objInput: {
            TestDate: {
                label: '测量日期',
                placeholder: '请输入测量日期',
                value: '',
            },
            TestTime: {
                label: '测量时间',
                placeholder: '请输入测量时间',
                value: '',
            },
            Bloodsugar: {
                label: '最近的血红蛋白值',
                placeholder: '请输入血红蛋白值',
                value: '',
            }
        }
    },
    onLoad () {

    },

    // 保存提交
    handleSubmit() {

    },
    // 提交设置
    setTestSugar() {
        let options = {
            url: 'RocheApi/SetTestSugar',
            loading: true,
        };
        return Http(options).then((res) => {
            this.setData({
                objUser: res || {},
            })
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
