export default class KeyMap extends Map {
    constructor() {
        super();
        this.onKeyDownHandle = this.onKeyDown.bind(this);
        this.onKeyUpHandle = this.onKeyUp.bind(this);
    }
    listen(cb) {
        window.addEventListener('keydown', this.onKeyDownHandle);
        window.addEventListener('keyup', this.onKeyUpHandle);
        let lastTime = performance.now();
        this.intervalId = window.setInterval(() => {
            const elapsedTime = performance.now() - lastTime;
            lastTime = performance.now();
            cb(elapsedTime);
        });
    }
    stop() {
        window.removeEventListener('keydown', this.onKeyDownHandle);
        window.removeEventListener('keyup', this.onKeyUpHandle);
        window.clearInterval(this.intervalId);
    }
    onKeyDown(e) {
        this.set(e.key, true);
    }
    onKeyUp(e) {
        this.delete(e.key);
    }
}
