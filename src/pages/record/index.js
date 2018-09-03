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

const arrTimeStep = ['早餐前', '早餐后', '午餐前', '午餐后', '晚餐前', '晚餐后', '空腹', '睡前'];
const arrRuler = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
            Bloodsugar: {
                label: '糖化血红蛋白值',
                placeholder: '请输入',
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
        arrRuler,
        arrTimeStep,
        timeStep: '早餐前'
    },
    onLoad () {

    },
    handleScroll (e) {
        let { detail } = e;
        let {scrollLeft} = detail;
        console.log(scrollLeft)
    },
    // 加减
    handleAddOrSub (e) {
        let { currentTarget } = e;
        let type = currentTarget.dataset.type || '1';
        let value = this.data.objInput.Bloodsugar.value || 0;
        value = +value;
        if (value > 0.1 && type === '0') {
            value = (value * 10 - 1) / 10;
        } else if (value < 10){
            value = (value * 10 + 1) / 10;
        }
        this.setData({
            ['objInput.Bloodsugar.value']: value,
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
        data.TimeStep = this.data.arrTimeStep.indexOf(this.data.timeStep) + 1;
        return Http(options).then((res) => {
           console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    }
}));
