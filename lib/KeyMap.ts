export default class KeyMap extends Map<string, boolean> {
    private intervalId: number;
    private readonly onKeyDownHandle: (e: KeyboardEvent) => void;
    private readonly onKeyUpHandle: (e: KeyboardEvent) => void;

    constructor() {
        super();
        this.onKeyDownHandle = this.onKeyDown.bind(this);
        this.onKeyUpHandle = this.onKeyUp.bind(this);
    }

    listen(cb: (elapsedTime: DOMHighResTimeStamp) => void): void {
        window.addEventListener('keydown', this.onKeyDownHandle);
        window.addEventListener('keyup', this.onKeyUpHandle);
        let lastTime = performance.now();
        this.intervalId = window.setInterval(() => {
            const elapsedTime = performance.now() - lastTime;
            lastTime = performance.now();
            cb(elapsedTime);
        })
    }

    stop(): void {
        window.removeEventListener('keydown', this.onKeyDownHandle);
        window.removeEventListener('keyup', this.onKeyUpHandle);
        window.clearInterval(this.intervalId)
    }

    private onKeyDown(e: KeyboardEvent) {
        this.set(e.key, true);
    }

    private onKeyUp(e: KeyboardEvent) {
        this.delete(e.key);
    }
}
