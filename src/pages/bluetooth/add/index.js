//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import InputMixin               from 'mixins/input.mixin'
import SDK                      from 'services/sdk.services'
import Toast                    from 'plugins/toast.plugin'
import Loading                  from 'plugins/loading.plugin'
import Store                    from 'plugins/store.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST
}                               from 'config/store.config'
const app = getApp();

Page(Handle({
    mixins: [InputMixin],
    data: {
        blueTooth: '',
        isPop: false,
    },
    onLoad() {
        // 搜索蓝牙
        this.searchRoche()
    },
    searchRoche () {
        let blueTooth = '';
        SDK.searchRoche().then((res) => {
            app.globalData.blueTooth = res;
            blueTooth = res || {};
        }).catch((err) => {
            setTimeout(() => {
                Toast.confirm({
                    content: '链接设备需要打开蓝牙，请确认手机蓝牙是否已打开？',
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
    // 配对
    handlePairRoche() {
        let { deviceId } = this.data.blueTooth;
        if (!deviceId) {
            Toast.error('没有发现设备，请先搜索设备');
            return this.searchRoche();
        }
        Loading.showLoading();
        let result = {};
        SDK.pairRoche(deviceId).then((res) => {
            result = {errCode: 0};
        }).catch((err) => {
            result = err;
        }).finally(() => {
            Loading.hideLoading();
            let { errCode } = result;
            if (errCode !== 0 && errCode !== -1) return Toast.error(result);
            Toast.confirm({
                content: '是否配对成功？',
            }).then((res) => {
                let { confirm } = res;
                console.log(this.data.blueTooth)
                confirm && Store.set($BLUE_TOOTH_DEVICE_ID_LIST, [this.data.blueTooth]);
                confirm && Router.push('bluetooth_synchronization_index');
            });
        })
    },
    onUnload () {
        let {deviceId} = app.globalData.blueTooth;
        deviceId && SDK.disconnectDevice(deviceId).then((res) => {
            console.log('断开蓝牙链接成功',res);
        }).catch((err) => {
            console.log('断开蓝牙链接失败',err);
        });
    },
}));
