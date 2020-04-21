var Timer = class {

    constructor(duration) {
        this.duration = duration;
        this.count = 0;
    }

    increment() {
        this.count++;
        if (typeof this.oncount === 'function') {
            this.oncount();
        }
        if (this.count === this.duration && typeof this.oncomplete === 'function') {
            this.oncomplete();
        }
        if (this.count === this.duration) {
            this.count = 0;
            this.stop();
        }
    }

    start() {
        this.interval = setInterval(() => this.increment(), 1000);
    }

    stop() {
        clearInterval(this.interval);
    }

    toArray() {
        var remaining = this.duration - this.count,
            h = parseInt(remaining / 3600).toString().padStart(2, '0'),
            m = parseInt(remaining % 3600 / 60).toString().padStart(2, '0'),
            s = parseInt(remaining % 3600 % 60).toString().padStart(2, '0');
        return [h, m, s];
    }

    toString() {
        return this.toArray().join(':').replace(/00:/g, '');
    }

}

module.exports = Timer;