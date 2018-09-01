//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Handle                   from 'mixins/mixin.handle'

//获取应用实例
const app = getApp();

Page(Handle({
    data: {

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

        }).catch((err) => {
            Toast.error(err);
        });
    }

}));
