
import Toast                    from 'plugins/toast.plugin'

export default {

    assignment (source_params, result_params) {
        this.forEach(result_params, (item, key) => {
            if (source_params[key] || source_params[key] === false){
                item.value = source_params[key]
            }
        })
    },

    check (source_params, options = {mode: true}) {
        let type = null;
        try {
            this.forEach(source_params, (param, key) => {
                let { use_check, value, visible } = param;
                if (!use_check || visible === false) return null;
                use_check.forEach((item) => {
                    let {nonempty, rule, gt, lt, type, prompt} = item;
                    if (nonempty && !value) throw prompt;
                    if (typeof rule === 'function' && !rule(value)) throw prompt;
                    if (typeof rule === 'object' && !rule.text(value)) throw prompt;
                })
            });
        } catch (error) {
            options.mode && Toast.error(error);
            type = true;
        }
        return type;
    },

    filter (source_params, expect_params) {
        let result = {};
        !expect_params && (expect_params = source_params);
        this.forEach(expect_params, (item, key) => {
            if (item.visible !== false) {
                result[key] = source_params[key].value;
            }
        });
        return result;
    },

    forEach (obj, callback) {
        for(let key in obj){
            callback && callback(obj[key], key);
        }
    }
}
