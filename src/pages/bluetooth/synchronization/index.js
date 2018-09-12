//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Auth                     from 'plugins/auth.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'
import SDK, { EVENT_NAME }      from 'services/sdk.services'
import Toast                    from 'plugins/toast.plugin'
import Http                     from 'plugins/http.plugin'
import Loading                  from 'plugins/loading.plugin'
import { formatData }           from 'wow-cool/lib/date.lib'
import WowCool                  from 'wow-cool/lib/array.lib'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
}                               from 'config/base.config'

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
        result: [],
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
        console.log('成功结束', e);
        Loading.hideLoading();
        this.processingData();
        this.setTestSugarList();
    },
    // 处理数据
    processingData() {
        let { infoList, contextList } = this.data;
        let result = [];
        infoList.forEach((info) => {
            let date = info.date;
            let cur = formatData('hh:dd', new Date(date));
            cur = +cur.replace(':', '');
            let index = WowCool.findFirstIndexForArr(ARR_TIME_STEP_KEY, (item) => {
                let { start, end } = item;
                start = +start.replace(':', '');
                end = +end.replace(':', '');
                return (cur >= start && cur <= end);
            });
            result.push({
                Bloodsugar: +info.data.toFixed(1),
                TimeStep: index + 1,
                TestDate: formatData('yyyy-MM-dd', new Date(date)),
                TestTime: formatData('hh:mm', new Date(date)),
                Remark: '',
            })
        });
        this.setData({result});
    },
    // 处理数据
    setTestSugarList() {
        let data = this.data.result;
        Auth.getToken().then((res) => {
            let { OpenId } = res;
            data.forEach((item) => {
                item.OpenId = OpenId
            });
            let options = {
                url: 'RocheApi/SetTestSugarList',
                loading: false,
                data,
                useOpenId: false,
                auth: false,
            };
            return Http(options)
        }).then((res) => {
            let data = res || [];
            data.forEach((item) => {
                if (item.TestDate) {
                    item.TestDate = item.TestDate.replace(/[^0-9]/ig, '');
                    item.TestDateShow = formatData('yyyy-MM-dd', new Date(+item.TestDate)) + ' ' + item.TestTime;
                }
            });
            this.destroyEvent();
            Router.push('bluetooth_transfer_index', {
                data,
            });
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 连接状态的改变事件
    onChangeHandle (e) {
        Loading.hideLoading();
        console.log('连接状态的改变事件', e);
    },
    // 详情事件
    onInfoHandle (e) {
        Loading.showLoading();
        let infoList = this.data.infoList;
        infoList.push(e);
        this.setData({infoList});
        console.log('详情事件', e);
    },
    // 附加信息事件
    onContextHandle (e) {
        Loading.showLoading();
        let contextList = this.data.contextList;
        contextList.push(e);
        this.setData({contextList});
        console.log('附加信息事件', e);
    },
    // 销毁事件
    destroyEvent () {
        for (let key in EVENT_FUN) {
            let eventName = EVENT_NAME[key];
            let eventFun = EVENT_FUN[key];
            console.log('调用了销毁事件',eventName,eventFun);
            SDK.off(eventName, eventFun);
        }
    }
}));
