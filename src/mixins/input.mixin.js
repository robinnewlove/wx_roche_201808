
const handle = function (e) {
    let {
        detail,
        currentTarget
    } = e;
    let key = currentTarget.dataset.key;
    let value = detail.value || currentTarget.dataset.value || '';
    this.setData({
        [key]: value
    });
};

export default {
    bindInput: handle,
    bindTap: handle,
    bindChange: handle,
}
