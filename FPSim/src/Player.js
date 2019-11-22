export default class Player {
    constructor(x, y, a) {
        this.speed = { t: 0.005, f: 0.005, b: 0.005 };
        this.x = x;
        this.y = y;
        this.a = a;
    }
    advance(m, a = 0) {
        a += this.a;
        this.x += Math.cos(a) * m;
        this.y += Math.sin(a) * m;
    }
}
