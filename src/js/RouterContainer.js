export default {
    _router: null,

    set(router) {
        this._router = router
        console.log(this._router)
    },

    get() {
        return this._router
    }
}
