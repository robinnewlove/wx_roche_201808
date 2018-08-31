
import EnvConfig                from 'config/env.config'
import Toast                    from 'plugins/toast.plugin'

const DEFAULT = {
    method: 'POST',
    data: {},
};

class Http {
    constructor (opt) {
        let options = Object.assign({}, DEFAULT, opt);
        this.method = options.method.toLocaleUpperCase();
        this.data = options.data;
        this.url = EnvConfig.API_URL + options.url;
        return this._fetch();
    }

    _fetch () {
        return new Promise((resolve, reject) => {
            this._log('请求方式', this.method);
            this._log('请求参数', this.data);
            wx.request({
                url: this.url,
                // url: 'xx',
                data: this.data,
                method: this.method,
                success: (response) => {
                    this._log('请求返回', response);
                    resolve(response);
                },
                fail: (error) => {
                    this._log('请求失败', error);
                    reject(error);
                    Toast.error(error);
                }
            });
        })
    }

    _log (str, data) {
        console.log(`${this.url} ${str} => `, data)
    }
}


export default (options = {}) => {
    let { loading } = options;
    loading && wx.showLoading();
    return new Http(options).finally(() => {
        loading && wx.hideLoading();
    })
}
