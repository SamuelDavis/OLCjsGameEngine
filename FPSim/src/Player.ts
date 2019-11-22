type nTuple = { t: number, f: number, b: number }

export default class Player {
    x: number;
    y: number;
    a: number;
    speed: nTuple;

    constructor(x: number, y: number, a: number, speed: nTuple = {t: 0.002, f: 0.005, b: 0.002}) {
        this.x = x;
        this.y = y;
        this.a = a;
        this.speed = speed;
    }

    advance(m: number, a: number = 0): void {
        a += this.a;
        this.x += Math.cos(a) * m;
        this.y += Math.sin(a) * m;
    }
}