import KeyMap from "./KeyMap.js";
import Display2D from "./Display2D.js";

export default abstract class GameEngine {
    protected readonly width: number;
    protected readonly height: number;
    protected readonly scale: number;

    protected readonly keyMap: KeyMap;
    protected readonly display: Display2D;

    constructor(width: number, height: number, scale: number, container = document.body) {
        this.width = width;
        this.height = height;
        this.scale = scale;

        this.display = new Display2D(this.width * this.scale, this.height * this.scale, container);
        this.keyMap = new KeyMap();

        this.init();
        this.display.draw(this.render.bind(this));
        this.keyMap.listen(this.update.bind(this));
    }

    protected get pxWidth(): number {
        return this.display.width;
    }

    protected get pxHeight(): number {
        return this.display.height;
    }

    protected get ctx(): CanvasRenderingContext2D {
        return this.display.ctx;
    }

    protected abstract init(): void;

    protected abstract update(elapsedTime: number): void;

    protected abstract render(elapsedTime: number): void;
}
