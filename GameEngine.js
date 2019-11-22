export default class GameEngine {
    constructor(width, height, scale, container = document.body) {
        this.inputCalled = performance.now();
        this.renderCalled = performance.now();
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.pxWidth = this.width * this.scale;
        this.pxHeight = this.height * this.scale;
        this.keyMap = new Map();
        this.init();
        window.addEventListener('keydown', (e) => this.keyMap.set(e.key, true));
        window.addEventListener('keyup', (e) => this.keyMap.delete(e.key));
        window.setInterval(this.inputLoop.bind(this));
        requestAnimationFrame(this.renderLoop.bind(this));
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.pxWidth + 'px');
        canvas.setAttribute('height', this.pxHeight + 'px');
        container.appendChild(canvas);
        this.ctx = canvas.getContext('2d');
    }
    inputLoop() {
        const elapsedTime = performance.now() - this.inputCalled;
        this.inputCalled = performance.now();
        this.update(elapsedTime);
    }
    renderLoop() {
        const elapsedTime = performance.now() - this.renderCalled;
        this.renderCalled = performance.now();
        this.render(elapsedTime);
        requestAnimationFrame(this.renderLoop.bind(this));
    }
}
