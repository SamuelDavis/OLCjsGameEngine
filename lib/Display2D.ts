export default class Display2D {
    readonly ctx: CanvasRenderingContext2D;
    private nextAnimationFrameId: number;
    private lastTime: number;

    constructor(width: number, height: number, container: HTMLElement = document.body) {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', `${width}px`);
        canvas.setAttribute('height', `${height}px`);
        container.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
    }

    get width() {
        return this.ctx.canvas.width;
    }

    get height() {
        return this.ctx.canvas.height;
    }

    get pendingDraw(): boolean {
        return Boolean(this.nextAnimationFrameId);
    }

    draw(cb: (elapsedTime: DOMHighResTimeStamp) => void, currentTime: DOMHighResTimeStamp = performance.now()): void {
        const elapsed = this.lastTime === undefined ? 0 : currentTime - this.lastTime;
        this.lastTime = currentTime;
        cb(elapsed);
        if (this.pendingDraw || elapsed === 0)
            this.nextAnimationFrameId = window.requestAnimationFrame(this.draw.bind(this, cb));
    }

    stop(): void {
        window.cancelAnimationFrame(this.nextAnimationFrameId);
        this.nextAnimationFrameId = undefined;
        this.lastTime = undefined;
    }
}
