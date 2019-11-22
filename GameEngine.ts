export default abstract class GameEngine {
    protected keyMap: Map<string, boolean>;
    protected scale: number;
    protected width: number;
    protected height: number;
    protected pxWidth: number;
    protected pxHeight: number;
    protected ctx: CanvasRenderingContext2D;
    private inputCalled: number = performance.now();
    private renderCalled: number = performance.now();

    constructor(width: number, height: number, scale: number, container = document.body) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.pxWidth = this.width * this.scale;
        this.pxHeight = this.height * this.scale;
        this.keyMap = new Map();
        this.init();
        window.addEventListener('keydown', (e: KeyboardEvent) => this.keyMap.set(e.key, true));
        window.addEventListener('keyup', (e: KeyboardEvent) => this.keyMap.delete(e.key));
        window.setInterval(this.inputLoop.bind(this));
        requestAnimationFrame(this.renderLoop.bind(this));
        const canvas: HTMLCanvasElement = document.createElement('canvas');
        canvas.setAttribute('width', this.pxWidth + 'px');
        canvas.setAttribute('height', this.pxHeight + 'px');
        container.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
    }

    protected abstract update(elapsedTime: number): void;

    protected abstract render(elapsedTime: number): void;

    protected abstract init(): void;

    private inputLoop() {
        const elapsedTime = performance.now() - this.inputCalled;
        this.inputCalled = performance.now();
        this.update(elapsedTime);
    }

    private renderLoop() {
        const elapsedTime = performance.now() - this.renderCalled;
        this.renderCalled = performance.now();
        this.render(elapsedTime);
        requestAnimationFrame(this.renderLoop.bind(this))
    }
}
