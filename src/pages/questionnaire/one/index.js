//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import UserMixin                from 'mixins/user.mixin'
import Data                     from 'utils/data.util'
import { formatData }           from 'wow-cool/lib/date.lib'

Page(Handle({
    mixins: [InputMixin, UserMixin],
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
            }
        },
        is_pop: false,
        objHidden: {
            is_agree: {
                value: true,
                use_check: [
                    {
                        nonempty: true,
                        prompt: '请先同意协议'
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
        if (Data.check(this.data.objHidden)) return;
        this.setUserInfo();
    },
    // 设置用户信息
    setUserInfo () {
        let data = Data.filter(this.data.objInput);
        this.getOrSetUserInfo(data).then(() => {
            Router.push('questionnaire_two_index', {}, true,);
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
            Data.assignment(this, res, this.data.objInput, 'objInput')
        }).catch((err) => {
            Toast.error(err);
        });
    },
    handleAgree() {
        let type = this.data.objHidden.is_agree.value;
        this.setData({
            'objHidden.is_agree.value': !type,
        })
    },
    handlePop(e) {
        let { currentTarget } = e;
        let is_pop = currentTarget.dataset.value;
        this.setData({
            is_pop
        })
    }
}));
