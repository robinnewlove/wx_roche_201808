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
import {
    ARR_TIME_STEP,
}                               from 'config/base.config'

let deltaX = 0;
Page(Handle({
    mixins: [RouterMixin, InputMixin],
    data: {
        objInput: {
            TestDate: {
                label: '测量日期',
                placeholder: '请输入',
                value: formatData('yyyy-MM-dd', new Date()),
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
                value: formatData('hh:mm', new Date()),
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
        },
        ruleWidth: 0,
        scrollLeft: 0,
    },
    onReady () {
        deltaX = 0;
        var query = wx.createSelectorQuery();
        query.select('.rule-item').boundingClientRect((rect) => {
            let {width} = rect;
            this.setData({
                ruleWidth: width
            })
        }).exec();
    },

    countNum (scrollLeft) {
        let value = 0;
        if (+scrollLeft !== 0) {
            let width = this.data.ruleWidth;
            let num = (2 / (width * 10));
            value = ((num * 100 * scrollLeft) / 100).toFixed(1);
        }
        this.setData({
            'objHidden.Bloodsugar.value': value
        });
    },

    countScrollLeft () {
        let value = this.data.objHidden.Bloodsugar.value;
        let width = this.data.ruleWidth;
        let num = (2 / (width * 10));
        let scrollLeft = Math.floor(value / num);
        this.setData({
            scrollLeft,
        })
    },

    handleScroll (e) {
        let { detail } = e;
        deltaX += detail.deltaX;
        this.countNum(Math.abs(deltaX));
    },
    // 加减
    handleAddOrSub (e) {
        let { currentTarget } = e;
        let type = currentTarget.dataset.type || '1';
        let value = this.data.objHidden.Bloodsugar.value || 0;
        value = +value;
        if (type === '0' && value >= 0.1) {
            value = (value * 10 - 1) / 10;
        }
        if ( type === '1' && value < 20) {
            value = (value * 10 + 1) / 10;
        }
        if (value !== 0) value = value.toFixed(1);
        this.setData({
            ['objHidden.Bloodsugar.value']: value,
        });
        this.countScrollLeft();
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
        return Http(options).then((res) => {
            return Router.push('result_index', res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
