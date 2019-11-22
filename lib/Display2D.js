export default class Display2D {
    constructor(width, height, container = document.body) {
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
    get pendingDraw() {
        return Boolean(this.nextAnimationFrameId);
    }
    draw(cb, currentTime = performance.now()) {
        const elapsed = this.lastTime === undefined ? 0 : currentTime - this.lastTime;
        this.lastTime = currentTime;
        cb(elapsed);
        if (this.pendingDraw || elapsed === 0)
            this.nextAnimationFrameId = window.requestAnimationFrame(this.draw.bind(this, cb));
    }
    stop() {
        window.cancelAnimationFrame(this.nextAnimationFrameId);
        this.nextAnimationFrameId = undefined;
        this.lastTime = undefined;
    }
}
