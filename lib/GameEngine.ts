import KeyMap from "./KeyMap.js";
import Display2D from "./Display2D.js";

export default abstract class GameEngine {
    protected keyMap: KeyMap;
    protected scale: number;
    protected width: number;
    protected height: number;
    protected display: Display2D;

    constructor(width: number, height: number, scale: number, container = document.body) {
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.keyMap = new KeyMap();
        this.display = new Display2D(this.width * this.scale, this.height * this.scale, container);
        this.init();
        this.keyMap.listen(this.update.bind(this));
        this.display.draw(this.render.bind(this));
    }

    get pxWidth(): number {
        return this.ctx.canvas.width;
    }

    get pxHeight(): number {
        return this.ctx.canvas.height;
    }

    protected get ctx(): CanvasRenderingContext2D {
        return this.display.ctx;
    }

    protected abstract update(elapsedTime: number): void;

    protected abstract render(elapsedTime: number): void;

    protected abstract init(): void;
}
