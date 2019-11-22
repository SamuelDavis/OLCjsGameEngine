export default class Player {
    x: number;
    y: number;
    a: number;
    speed: { t: number, f: number, b: number } = {t: 0.005, f: 0.005, b: 0.005};

    constructor(x, y, a) {
        this.x = x;
        this.y = y;
        this.a = a;
    }

    advance(m: number, a: number = 0): void {
        a += this.a;
        this.x += Math.cos(a) * m;
        this.y += Math.sin(a) * m;
    }
}