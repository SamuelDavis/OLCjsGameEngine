export default class GameMap extends String {
    readonly width: number;
    readonly height: number;

    constructor(template: string[]) {
        super(template.join(''));
        this.width = template.reduce((len: number, str: string) => Math.max(len, str.length), 0);
        this.height = template.length;
    }

    getAt(x: number, y: number): string | undefined {
        return this[Math.floor(x) + Math.floor(y) * this.width];
    }
}
