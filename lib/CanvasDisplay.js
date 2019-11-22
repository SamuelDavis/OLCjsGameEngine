export default class CanvasDisplay {
    constructor(width, height, xScale, yScale, container = document.body) {
        super();
        this.width = width;
        this.height = height;
        this.xScale = xScale;
        this.yScale = yScale;
        this.canvas.setAttribute('width', this.pxWidth + 'px');
        this.canvas.setAttribute('height', this.pxHeight + 'px');
        container.appendChild(this.canvas);
    }
    get pxWidth() {
        return this.width * this.xScale;
    }
    get pxHeight() {
        return this.height * this.yScale;
    }
}
