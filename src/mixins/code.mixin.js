import Toast                    from 'plugins/toast.plugin'
import Regular                  from 'wow-cool/lib/regular.lib'
export default {
    handleCode (e) {
        let { currentTarget } = e;
        let key = currentTarget.dataset.tel;
        let tel = this.data.objInput[key].value;
        if (!tel) return Toast.error('请输入您的手机号');
        if (!Regular.isPhone(tel)) return Toast.error('手机号输入错误');

    }
}
