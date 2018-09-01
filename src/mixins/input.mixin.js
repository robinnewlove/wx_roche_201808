export default {
    bindInput(e) {
        let {
            detail,
            currentTarget
        } = e;
        let key = currentTarget.dataset.key;
        let value = detail.value;
        this.setData({
            [key]: value
        });
    }
}
