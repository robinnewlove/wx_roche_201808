//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import SDK                      from 'services/sdk.services'
import Toast                    from 'plugins/toast.plugin'

Page(Handle({
    mixins: [InputMixin],
    data: {
        blueTooth: '',
        isPop: false,
        deviceId: '',
    },
    onLoad() {
        // 搜索蓝牙
        this.searchRoche()
    },
    searchRoche () {
        let blueTooth = '';
        SDK.searchRoche().then((res) => {
            console.log('成功',res);
            blueTooth = res || {};
        }).catch((err) => {
            setTimeout(() => {
                Toast.confirm({
                    content: '链接设备需要打开蓝牙，请确认手机蓝牙是否已打开',
                }).then((res) => {
                    let { cancel, confirm } = res;
                    confirm && this.searchRoche();
                    cancel && Router.pop();
                });
                this.setData({
                    blueTooth: null,
                })
            }, 1000);
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
    },
    // 绑定
    handlePop (e) {
        let { currentTarget } = e;
        let isPop = currentTarget.dataset.value;
        this.setData({ isPop })
    },
    // 配对
    handlePairRoche() {
        let deviceId = this.data.deviceId;
        if (!deviceId) return Toast.error('请输入血糖仪上显示的代码');
        SDK.pairRoche(deviceId).then((res) => {
            console.log('成功',res);
            this.setData({ isPop: false });
            Router.push('bluetooth_synchronization_index');
        }).catch((err) => {
            Toast.error(err);
            console.log(err)
        })
    },
}));
