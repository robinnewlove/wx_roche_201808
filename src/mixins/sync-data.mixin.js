import SDK, { EVENT_NAME }      from 'services/sdk.services'
import Loading                  from 'plugins/loading.plugin'
import Toast                    from 'plugins/toast.plugin'
import Http                     from 'plugins/http.plugin'
import { formatData }           from 'wow-cool/lib/date.lib'
import WowCool                  from 'wow-cool/lib/array.lib'
import Router                   from 'plugins/router.plugin'
import Auth                     from 'plugins/auth.plugin'
import Store                    from 'plugins/store.plugin'
import Authorize, { SCOPE }     from 'plugins/authorize.plugin'
import {
    $BLUE_TOOTH_DEVICE_ID_LIST,
    $BLUE_TOOTH_DATA,
}                               from 'config/store.config'
import {
    ARR_TIME_STEP,
    ARR_TIME_STEP_KEY,
}                               from 'config/base.config'

const EVENT_FUN = {};

export default {
    data: {
        infoList: [],
        contextList: [],
        result: [],
    },
    // 同步血糖
    handleSync () {
        Authorize(SCOPE.userLocation, '同步数据需要地理位置授权').then(() => {
            return Store.get($BLUE_TOOTH_DEVICE_ID_LIST);
        }).then(() => {
            this.syncData();
        }).catch((err) => {
            let { errCode } = err;
            if (errCode === -999) return Router.push('bluetooth_explain_index');
            Toast.error('同步数据需要地理位置授权哦')
        });
    },

    // 同步数据
    syncData () {
        Loading.showLoading();
        Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then((res) => {
            let blueTooth = res[0];
            if(!blueTooth) return Toast.error('您还未配对过设备，请先去配对设备');
            return SDK.syncData(blueTooth.deviceId)
        }).then((res) => {
            Loading.showLoading();
            this.monitorEvent();
        }).catch((e) => {
            console.log(e);
            this.destroyEvent();
            Loading.hideLoading();
            return Toast.confirm({
                content: '同步数据需要打开蓝牙，请确认手机蓝牙是否已打开？',
            }).then((res) => {
                let { confirm } = res;
                confirm && this.syncData();
            });
        })

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
        this.destroyEvent();
    },
    // 成功结束
    onEndHandle (e) {
        console.log('成功结束', e);
        Loading.hideLoading();
        this.destroyEvent();
        this.processingData();
        this.setTestSugarList();
    },
    // 处理数据
    processingData() {
        let { infoList, contextList } = this.data;
        let result = [];
        infoList.forEach((info) => {
            let date = info.date;
            date = date.replace(/-/g, '\/');
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
                    item.TestDate = formatData('yyyy-MM-dd', new Date(+item.TestDate));
                }
            });
            return Store.set($BLUE_TOOTH_DATA, data);
        }).then(() => {
            // let pages = getCurrentPages();    //获取加载的页面
            // let cur_url = pages[pages.length-1].route;    //当前页面url
            if (!this.data.$params || !this.data.$params.from) return Router.pop(2);
            // if (cur_url === 'pages/bluetooth/index') this.initData();
            this.initData && this.initData();
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 连接状态的改变事件
    onChangeHandle (e) {
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
    onUnload () {
        this.closeDevice();
        this.destroyEvent();
    },
    closeDevice () {
        Store.get($BLUE_TOOTH_DEVICE_ID_LIST).then((res) => {
            let blueTooth = res[0];
            SDK.disconnectDevice(blueTooth.deviceId);
        }).then((res) => {
            console.log('断开蓝牙链接成功',res);
        }).catch((err) => {
            console.log('断开蓝牙链接失败',err);
        });
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
}
