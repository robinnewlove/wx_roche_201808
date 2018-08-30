
import EnvConfig                from 'config/env.config'

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
        return       this[`_${this.method}`]();
    }

    _POST () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.url,
                data: this.data,
                method: this.method,
                success: (response) => {
                    resolve(response);
                },
                fail: (error) => {
                    reject(error)
                }
            });
        })
    }
}


export default (options = {}) => {
    return new Http(options).finally(() => {

    })
}
