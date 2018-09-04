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
import {
    ARR_TIME_STEP,
}                               from 'config/base.config'

Page(Handle({
    mixins: [RouterMixin, InputMixin],
    data: {
        objInput: {
            TestDate: {
                label: '测量日期',
                placeholder: '请输入',
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
                placeholder: '请输入',
                value: '',
                mode: 'time',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量时间'
                    }
                ]
            },
            RedProtein: {
                label: '糖化血红蛋白值',
                placeholder: '请输入',
                value: '',
                type: 'digit',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
            Remark: {
                label: '备注',
                placeholder: '请输入',
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入备注'
                    }
                ]
            },
        },
        arrRuler: 101,
        arrTimeStep: ARR_TIME_STEP,
        timeStep: '空腹',
        objHidden: {
            Bloodsugar: {
                label: '糖化血红蛋白值',
                placeholder: '请输入',
                value: 0,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
        }
    },
    handleScroll (e) {
        let { detail } = e;
        let {scrollLeft} = detail;
        // console.log(scrollLeft)
    },
    // 加减
    handleAddOrSub (e) {
        let { currentTarget } = e;
        let type = currentTarget.dataset.type || '1';
        let value = this.data.objHidden.Bloodsugar.value || 0;
        value = +value;
        if (type === '0' && value > 0.1) {
            value = (value * 10 - 1) / 10;
        }
        if ( type === '1' && value < 10) {
            value = (value * 10 + 1) / 10;
        }
        this.setData({
            ['objHidden.Bloodsugar.value']: value,
        });
    },
    // 选择时间段
    handleTimeStep (e) {
        let { currentTarget } = e;
        let value = currentTarget.dataset.value;
        this.setData({
            timeStep: value,
        });
    },
    // 保存提交
    handleSubmit() {
        if (Data.check(this.data.objInput)) return;
        if (Data.check(this.data.objHidden)) return;
        this.setTestSugar();
    },
    // 提交设置
    setTestSugar() {
        let data1 = Data.filter(this.data.objInput);
        let data2 = Data.filter(this.data.objHidden);
        let data = {
            ...data1,
            ...data2,
        };
        data.TimeStep = this.data.arrTimeStep.indexOf(this.data.timeStep) + 1;
        data.RedProtein = +data.RedProtein;
        let options = {
            url: 'RocheApi/SetTestSugar',
            loading: true,
            data,
        };
        return Http(options).then(() => {
            return Router.push('result_index', data);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
