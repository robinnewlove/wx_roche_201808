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
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'

const arrTimeStep = ['早餐前', '早餐后', '午餐前', '午餐后', '午餐前', '午餐后', '空腹', '睡前'];

Page(Handle({
    mixins: [RouterMixin, InputMixin],
    data: {
        objInput: {
            TestDate: {
                label: '测量日期',
                placeholder: '请输入测量日期',
                value: '',
                mode: 'date',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量日期'
                    }
                ]
            },
            TestTime: {
                label: '测量时间',
                placeholder: '请输入测量时间',
                value: '',
                mode: 'time',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量时间'
                    }
                ]
            },
            Bloodsugar: {
                label: '糖化血红蛋白值',
                placeholder: '请输入糖化血红蛋白值',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
            Remark: {
                label: '备注',
                placeholder: '请输入备注',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入备注'
                    }
                ]
            },
        },
        arrTimeStep,
        objHidden: {
            TimeStep: {
                label: '时间段',
                value: '早餐前'
            }
        }
    },
    onLoad () {

    },
    // 保存提交
    handleSubmit() {
        if (Data.check(this.data.objInput)) return;
        this.setTestSugar();
    },
    // 提交设置
    setTestSugar() {
        let data = Data.filter(this.data.objInput);
        let options = {
            url: 'RocheApi/SetTestSugar',
            loading: true,
            data,
        };
        return console.log(data);
        return Http(options).then((res) => {
           console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
