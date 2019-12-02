export default class Player {
    x: number;
    y: number;
    s: number;

    constructor(x, y, s = 0.001) {
        this.x = x;
        this.y = y;
        this.s = s;
    }
}
