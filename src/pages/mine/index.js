//index.js
import './index.json'
import './index.scss'
import './index.wxml'

import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
import Router                   from 'plugins/router.plugin'
import Handle                   from 'mixins/mixin.handle'

Page(Handle({
    data: {
        userInfo: {},
        objUser: {},
        objView: [
            {
                label: '我的测糖方案',
                url: 'mine_programme_index',
                value: '',
            },
            {
                label: '我的血糖报告',
                url: 'mine_report_index',
                value: '',
            },
            {
                label: '个人信息',
                url: 'mine_info_index',
                value: '',
            },
            {
                label: '绑定 performa connect',
                url: '',
                value: '',
            }
        ]
    },
    onShow () {
        this.getUserSugar();
    },
    // 个人中心血糖基本信息
    getUserSugar () {
        let options = {
            url: 'RocheApi/GetUserSugar',
            loading: true,
        };
        return Http(options).then((res) => {
            let { IsPerfect } = res;
            this.setData({
                objUser: res || {},
                'objView[2].value': IsPerfect ? '' : '待完善',
            })
        }).catch((err) => {
            Toast.error(err);
        });
    },
    // 跳转
    handleJump (e) {
        let { currentTarget } = e;
        let url = currentTarget.dataset.url;
        let IsMember = this.data.objUser.IsMember;
        if (url) Router.push(url, { IsMember });
    }
}));
