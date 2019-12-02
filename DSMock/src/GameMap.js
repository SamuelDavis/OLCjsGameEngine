export default class GameMap extends String {
    constructor(template) {
        super(template.join(''));
        this.width = template.reduce((len, str) => Math.max(len, str.length), 0);
        this.height = template.length;
    }
    getAt(x, y) {
        return this[Math.floor(x) + Math.floor(y) * this.width];
    }
}
