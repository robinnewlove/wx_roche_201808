
const handle = function (e) {
    let {
        detail,
        currentTarget
    } = e;
    let key = currentTarget.dataset.key;
    let obj = currentTarget.dataset.obj;
    let value = detail.value || currentTarget.dataset.value || '';
    if (obj) {
        this.setData({
            [obj]: {
                ...this.data[obj],
                [key]: {
                    ...this.data[obj][key],
                    value,
                },
            }
        });
    } else {
        this.setData({
            [key]: value
        });
    }

};

export default {
    bindInput: handle,
    bindTap: handle,
    bindChange: handle,
}
