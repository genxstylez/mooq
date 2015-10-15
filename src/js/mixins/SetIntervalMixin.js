export default {
    componentWillMount() {
        this.intervals = [];
    },
    setInterval(fn, ms, immediate) {
        if (immediate)
            fn()
        this.intervals.push(setInterval(fn, ms));
    },
    componentWillUnmount() {
        this.intervals.forEach(clearInterval);
    }
};