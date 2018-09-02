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
            }
        },
        start: '1901-01-01',
        end: formatData('yyyy-MM-dd'),
    },
    // 提交下一步
    handleSubmit () {
        if (Data.check(this.data.objInput)) return;
        this.setUserInfo();
    },
    // 设置用户信息
    setUserInfo () {
        let data = Data.filter(this.data.objInput);
        let options = {
            url: 'RocheApi/SetUserInfo',
            loading: true,
            data
        };
        return Http(options).then(() => {
            Router.push('questionnaire_two_index')
        }).catch((err) => {
            Toast.error(err);
        });
    },
}));
