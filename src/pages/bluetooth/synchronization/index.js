//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import SDK, { EVENT_NAME }      from 'services/sdk.services'
import Toast                    from 'plugins/toast.plugin'
import Loading                  from 'plugins/loading.plugin'

const {
    ERROR,
    END,
    CHANGE,
    INFO,
    CONTEXT,
} = EVENT_NAME;

const EVENT_FUN = {};
const app = getApp();

Page(Handle({
    data: {
        blueTooth: {},
        infoList: [],
        contextList: [],
    },
    //
    onLoad() {
        this.setData({
            blueTooth: app.globalData.blueTooth
        });
        this.monitorEvent();
    },
    // 数据同步
    handleSync (e) {
        this.syncData();
    },
    // 同步数据
    syncData () {
        Loading.showLoading();
        SDK.syncData(this.data.blueTooth.deviceId).then((res) => {
            console.log('准备同步数据', res);
        }).catch((err) => {
            Loading.hideLoading();
            console.log('准备同步数据异常', err);
        })
    },
    onUnload () {
        this.destroyEvent();
    },
    // 监听事件
    monitorEvent () {
        for (let key in EVENT_NAME) {
            let event = EVENT_NAME[key];
            let name = key.substring(0, 1) + key.substring(1).toLocaleLowerCase();
            EVENT_FUN[key] = this[`on${name}Handle`].bind(this);
            SDK.on(event, EVENT_FUN[key]);
        }
    },
    // 错误事件
    onErrorHandle (e) {
        Toast.error(e);
        Loading.hideLoading();
        console.log('错误事件', e);
    },
    // 成功结束
    onEndHandle (e) {
        Loading.hideLoading();
        Router.push('bluetooth_transfer_index', this.data);
    },
    // 连接状态的改变事件
    onChangeHandle (e) {
        Loading.hideLoading();
        Toast.error(e);
        console.log('连接状态的改变事件', e);
    },
    // 详情事件
    onInfoHandle (e) {
        let infoList = this.data.infoList;
        infoList.push(e);
        this.setData({infoList});
        console.log('详情事件', e);
    },
    // 附加信息事件
    onContextHandle (e) {
        let contextList = this.data.contextList;
        contextList.push(e);
        this.setData({contextList});
        console.log('附加信息事件', e);
    },
    // 销毁事件
    destroyEvent () {
        for (let key in EVENT_FUN) {
            let eventFun = EVENT_NAME[key];
            SDK.off(key, eventFun);
        }
    }
}));
