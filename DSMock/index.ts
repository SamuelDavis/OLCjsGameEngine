import GameEngine from '../lib/GameEngine.js'
import Player from './src/Player.js'
import GameMap from './src/GameMap.js'

new class extends GameEngine {
    player: Player;
    map: GameMap;

    constructor() {
        super(7, 7, 32);
        this.player = new Player(2, 0);
        this.map = new GameMap([
            '.......',
            '.wTr...',
            '.wwmrw.',
            '..mmrw.',
            '.mmrr..',
            '..Tr...',
            '.......',
        ]);
        this.start()
    }

    render(elapsedTime) {
        this.clear();
        this.ctx.font = `${this.scale}px monospace`;
        this.ctx.fillStyle = 'white';
        this.ctx.textBaseline = 'top';
        this.ctx.textAlign = 'left';
        this.drawWorld();
        this.drawPlayer()
    }

    update(elapsedTime) {
        const speed = this.player.s * {
            'r': 2,
            'w': 0.5,
            'm': 0.3,
            'T': 1.5,
            '.': 1
        }[this.map.getAt(Math.round(this.player.x), Math.round(this.player.y))];
        if (this.keyMap.has('w')) {
            this.player.y -= speed * elapsedTime;
        }
        if (this.keyMap.has('a')) {
            this.player.x -= speed * elapsedTime;
        }
        if (this.keyMap.has('s')) {
            this.player.y += speed * elapsedTime;
        }
        if (this.keyMap.has('d')) {
            this.player.x += speed * elapsedTime;
        }
    }

    clear() {
        this.ctx.clearRect(0, 0, this.pxWidth, this.pxHeight);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.pxWidth, this.pxHeight)
    }

    drawWorld() {
        for (let x: number = 0; x < this.map.width; x++) {
            for (let y: number = 0; y < this.map.height; y++) {
                this.ctx.fillText(this.map.getAt(x, y), x * this.scale, y * this.scale);
            }
        }
    }

    drawPlayer() {
        this.ctx.fillText('@', this.player.x * this.scale, this.player.y * this.scale);
    }
};
