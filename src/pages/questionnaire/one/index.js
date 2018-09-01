//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'

//获取应用实例
const app = getApp();

Page(Handle({
    mixins: [InputMixin],
    data: {
        name: '',
        sex: '1',
        birthday: '',
        start: '1901-01-01',
        end: '2018-09-01',
    },
    // 生命周期回调—监听页面加载
    onLoad () {
        this.getArchives();
    },
    // 获取文档
    getArchives () {
        let options = {
            url: 'RocheApi/GetArchives',
            loading: true,
        };
        return Http(options).then((res) => {
            console.log(res)
        }).catch((err) => {
            Toast.error(err);
        });
    },
    handleSubmit () {
        this.setUserInfo();
    },
    // 设置用户信息
    setUserInfo () {
        let options = {
            url: 'RocheApi/SetUserInfo',
            loading: true,
            data: {
                Name: this.data.name,
                Sex: this.data.birthday,
                Birthday: this.data.birthday,
            }
        };
        return Http(options).then((res) => {
            console.log(res)
        }).catch((err) => {
            Toast.error(err);
        });
    },
}));
