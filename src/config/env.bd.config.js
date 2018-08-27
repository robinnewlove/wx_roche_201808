import BD_IP from './../../config/ip.config'
export default {
    PICTURE_URL: 'http://'+ BD_IP +':22580/static/images/',             // 图片服务器
    // PICTURE_URL: 'http://market.guyubao.com/static/images/',             // 图片服务器
    HTML_URL:'http://'+ BD_IP +':22580/static/html/',                   // 静态页面
    JSON_URL: 'http://'+ BD_IP +':22580/static/json/',                  // JSON文件地址
    API_URL: 'http://s0000.iok.la:19804/exchange/openapi/v1/app',        // 接口
    // API_URL: 'http://s666.ngrok.xiaomiqiu.cn/exchange/openapi/v1/app',        // 接口
    OLD_API_URL: 'http://s0000.iok.la:19804',                             // 老接口
    // OLD_API_URL: 'http://s0000.iok.la:12949',                             // 老接口
    // OLD_API_URL: 'http://s666.ngrok.xiaomiqiu.cn',                             // 老接口
}
