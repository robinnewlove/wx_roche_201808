//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin],
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
            Birthday: {
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
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
            Weight: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
            Mobile: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
            LowSugar: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
            RedProtein: {
                value: '',
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请输入您的出生年月'
                    }
                ]
            },
        },
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    },
    onLoad () {
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
        this.getOrSetUserInfo(data).then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    fetchUserInfo () {
        this.getOrSetUserInfo().then((res) => {
            console.log(res);
        }).catch((err) => {
            Toast.error(err);
        });
    },
    getOrSetUserInfo (data = {}) {
        let options = {
            url: 'RocheApi/SetUserInfo',
            loading: true,
            data
        };
        return Http(options);
    }
}));
