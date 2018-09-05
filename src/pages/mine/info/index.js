//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import UserMixin                from 'mixins/user.mixin'
import RouterMixin              from 'mixins/router.mixin'
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin, UserMixin, RouterMixin],
    data: {
        objInput: {
            Name: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的姓名'
                    }
                ]
            },
            Sex: {
                value: 1,
            },
            Brithday: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
            Height: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的身高'
                    }
                ]
            },
            Weight: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的体重'
                    }
                ]
            },
            Mobile: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的手机号'
                    }
                ]
            },
            LowSugar: {
                value: 1,
            },
            RedProtein: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入糖化血红蛋白值'
                    }
                ]
            },
        },
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    },
    onLoad (options) {
        this.getParamsByUrl(options);
        this.fetchUserInfo();
    },
    // 提交下一步
    handleSubmit () {
        if (Data.check(this.data.objInput)) return;
        this.setUserInfo();
    },
    // 设置用户信息
    setUserInfo () {
        let data = Data.filter(this.data.objInput);
        let from = this.data.$params.from || '';
        this.getOrSetUserInfo(data).then((res) => {
            Toast.error('设置成功');
            setTimeout(() => {
               from ? Router.push('mine_report_index') : Router.pop();
            }, 1000);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 获取用户信息
    fetchUserInfo () {
        this.getOrSetUserInfo().then((res) => {
            res = res || {};
            if (res.Brithday) {
                res.Brithday = res.Brithday.replace(/[^0-9]/ig, '');
                res.Brithday = formatData('yyyy-MM-dd', new Date(+res.Brithday));
            }
            res.LowSugar = res.LowSugar ? 1 : 0;
            Data.assignment(this, res, this.data.objInput, 'objInput')
        }).catch((err) => {
            Toast.error(err);
        });
    },
}));
