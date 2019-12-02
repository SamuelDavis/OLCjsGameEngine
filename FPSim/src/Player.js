export default class Player {
    constructor (x, y, a, speed = { t: 0.002, f: 0.005, b: 0.002 }) {
        this.x = x
        this.y = y
        this.a = a
        this.speed = speed
    }

    advance (m, a = 0) {
        a += this.a
        this.x += Math.cos(a) * m
        this.y += Math.sin(a) * m
    }
}
