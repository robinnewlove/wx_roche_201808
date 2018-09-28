import Http                     from 'plugins/http.plugin'
import Toast                    from 'plugins/toast.plugin'
export default {
    setWechatFormId (form_id) {
        let options = {
            url: 'WechatApi/SetWechatFormId',
            loading: true,
            data: {
                form_id,
            }
        };
        return Http(options).then((res) => {

        }).catch((err) => {
            Toast.error(err);
        });
    }
}
