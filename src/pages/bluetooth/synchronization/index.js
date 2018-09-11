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

Page(Handle({
    data: {

    },
    //
    onLoad() {
        this.monitorEvent();
    },
    // 数据同步
    handleSync (e) {
        this.syncData();
    },
    // 同步数据
    syncData () {
        SDK.syncData().then((res) => {
            console.log('准备同步数据', res);
        }).catch((err) => {
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
            console.log(event, EVENT_FUN[key]);
            SDK.on(event, EVENT_FUN[key]);
        }
    },
    // 错误事件
    onErrorHandle (e) {
        console.log('错误事件', e);
    },
    // 成功结束
    onEndHandle (e) {
        console.log('成功结束', e);
    },
    // 连接状态的改变事件
    onChangeHandle (e) {
        console.log('连接状态的改变事件', e);
    },
    // 详情事件
    onInfoHandle (e) {
        console.log('详情事件', e);
    },
    // 附加信息事件
    onContextHandle (e) {
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
