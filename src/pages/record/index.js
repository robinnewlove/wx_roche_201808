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
import WowCool                  from 'wow-cool/lib/array.lib'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
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
                end: formatData('yyyy-MM-dd', new Date()),
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
                start: '',
                end: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入测量时间'
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
        timeStep: '',
        objHidden: {
            Bloodsugar: {
                value: '6.0',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入当前血糖值'
                    }
                ]
            },
        },
        ruleWidth: 0,
        scrollLeft: 0,
        timeScrollLeft: 0,
    },
    onReady () {
        deltaX = 0;
        let query = wx.createSelectorQuery();
        query.select('.rule-item').boundingClientRect((rect) => {
            let {width} = rect;
            this.setData({
                ruleWidth: width
            });
            this.countScrollLeft();
        }).exec();
    },
    onShow() {
        this.setData({
            'objInput.TestDate.value': formatData('yyyy-MM-dd'),
            'objInput.TestDate.end': formatData('yyyy-MM-dd'),
            'objInput.TestTime.value': formatData('hh:mm'),
            'objInput.TestTime.end': formatData('hh:mm'),
        });
        this.initData();
    },
    handleChange(e){
        this.bindChange(e);
        let time = this.data.objInput.TestTime.value;
        // this.judgeTimeStep(time);
    },
    initData () {
        let time = this.data.objInput.TestTime.value;
        let index = this.judgeTimeStep(time);
        this.setStartAndEnd(index, time);
    },
    judgeTimeStep (time = '') {
        time = time || formatData('hh:dd');
        let cur = +time.replace(':', '');
        let index = WowCool.findFirstIndexForArr(ARR_TIME_STEP_KEY, (item) => {
            let { start, end } = item;
            start = +start.replace(':', '');
            end = +end.replace(':', '');
            return (cur >= start && cur <= end);
        });
        if (index > 4) this.setData({timeScrollLeft: 500});
        if (index < 3) this.setData({timeScrollLeft: 0});
        this.setData({
            timeStep: ARR_TIME_STEP[index]
        });
        return index;
    },
    setStartAndEnd (index, value) {
        let { start, end } = ARR_TIME_STEP_KEY[index];
        this.setData({
            'objInput.TestTime.value': value || start,
        });
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
        let value = +this.data.objHidden.Bloodsugar.value;
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
        let value = +this.data.objHidden.Bloodsugar.value || 0;
        value = +value;
        if (type === '0' && value > 0) {
            value = (value * 10 - 1) / 10;
        }
        if ( type === '1' && value < 20) {
            value = (value * 10 + 1) / 10;
        }
        if (value !== 0) value = value.toFixed(1);
        this.setData({
            'objHidden.Bloodsugar.value': value,
        });
        this.countScrollLeft();
    },
    // 选择时间段
    handleTimeStep (e) {
        let { currentTarget } = e;
        let timeStep = currentTarget.dataset.value;
        this.setData({
            timeStep,
        });
        let index = ARR_TIME_STEP.indexOf(timeStep);
        // this.setStartAndEnd(index);
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
        data.Bloodsugar = +data.Bloodsugar;
        let options = {
            url: 'RocheApi/SetTestSugar',
            loading: true,
            data,
        };
        return Http(options).then((res) => {
            return Router.push('result_index', {Bloodsugar: res.Bloodsugar});
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
