
import EnvConfig                from 'config/env.config'
import Toast                    from 'plugins/toast.plugin'
import Auth                     from 'plugins/auth.plugin'

const DEFAULT = {
    method: 'POST',
    useOpenId: true,
    data: {},
};

class Http {
    constructor (opt) {
        let options = Object.assign({}, DEFAULT, opt);
        this.method = options.method.toLocaleUpperCase();
        this.data = options.data;
        this.useOpenId = options.useOpenId;
        this.url = EnvConfig.API_URL + options.url;
        return this._fetch();
    }

    _fetch () {
        return new Promise((resolve, reject) => {
            Auth.getToken().then((res) => {
                this._log('userToken', res);
                let {
                    AccessToken,
                    OpenId,
                } = res;
                this.useOpenId && (this.data.OpenId = OpenId);
                this.url = `${this.url}?access_token=${AccessToken}`
            }).finally(() => {
                this._log('请求参数', this.data);
                wx.request({
                    url: this.url,
                    data: this.data,
                    method: this.method,
                    success: (response) => {
                        let {
                            data,
                            errMsg,
                            statusCode
                        } = response;
                        if (statusCode !== 200 || !data) {
                            return reject(errMsg);
                        }
                        let {
                            Status,
                            Message,
                            Data,
                            Id,
                            Extend,
                        } = data;
                        if (Status !== 0) {
                            return reject(Message);
                        }
                        this._log('请求返回', Data);
                        resolve(Data);
                    },
                    fail: (error) => {
                        this._log('请求失败', error);
                        reject(error);
                        Toast.error(error);
                    }
                });
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
