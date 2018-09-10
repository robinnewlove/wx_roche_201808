//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import SDKServiceMixin          from 'services/sdk.services.mixin'
import Toast                    from 'plugins/toast.plugin'

Page(Handle({
    mixins: [SDKServiceMixin],
    data: {
        blueTooth: '',
    },
    onLoad() {
        // 搜索蓝牙
        let blueTooth;
        this.searchRoche().then((res) => {
            console.log('成功',res);
            blueTooth = res || {};
        }).catch((err) => {
            Toast.error(err);
            blueTooth = null;
        }).finally(() => {
            this.setData({
                blueTooth
            })
        })
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        Router.push(url);
    }
}));
