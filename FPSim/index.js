import GameEngine from "../GameEngine.js";
import Player from "./src/Player.js";
import GameMap from "./src/GameMap.js";
new class extends GameEngine {
    constructor() {
        super(...arguments);
        this.HALF_PI = Math.PI / 2;
        this.FONT = 'monospace';
        this.FOV = Math.PI / 4;
        this.halfFOV = this.FOV / 2;
        this.RAY_STEP_SIZE = 0.5;
        this.BOUND_SENSITIVITY = 0.006;
        this.avgFPS = [];
        this.showDebug = false;
    }
    render(elapsedTime) {
        this.clear();
        this.renderWorld();
        this.renderMap();
        if (this.showDebug)
            this.renderDebug(elapsedTime);
    }
    update(elapsedTime) {
        if (this.keyMap.has('a'))
            this.player.a -= this.player.speed.t * elapsedTime;
        if (this.keyMap.has('d'))
            this.player.a += this.player.speed.t * elapsedTime;
        if (this.keyMap.has('w')) {
            this.player.advance(this.player.speed.f * elapsedTime);
            if (this.map.impassible(this.player.x, this.player.y))
                this.player.advance(-this.player.speed.f * elapsedTime);
        }
        if (this.keyMap.has('s')) {
            this.player.advance(-this.player.speed.b * elapsedTime);
            if (this.map.impassible(this.player.x, this.player.y))
                this.player.advance(this.player.speed.b * elapsedTime);
        }
        if (this.keyMap.has('q')) {
            this.player.advance(this.player.speed.b * elapsedTime, -this.HALF_PI);
            if (this.map.impassible(this.player.x, this.player.y))
                this.player.advance(-this.player.speed.b * elapsedTime, -this.HALF_PI);
        }
        if (this.keyMap.has('e')) {
            this.player.advance(this.player.speed.b * elapsedTime, this.HALF_PI);
            if (this.map.impassible(this.player.x, this.player.y))
                this.player.advance(-this.player.speed.b * elapsedTime, this.HALF_PI);
        }
    }
    init() {
        this.map = new GameMap([
            '################',
            '#...#..........#',
            '#..............#',
            '#...#..........#',
            '###.#..........#',
            '#..............#',
            '#...############',
            '#..............#',
            '#....######....#',
            '#....#####.....#',
            '#....####......#',
            '#....###.......#',
            '#..#.##.......##',
            '#....#.......###',
            '#...........####',
            '################',
        ]);
        this.player = new Player(2.0, 2.0, 0.0);
        this.debug = document.createElement('pre');
        this.debug.style.display = 'none';
        document.body.appendChild(this.debug);
        this.halfScale = this.scale / 2;
        this.halfHeight = this.height / 2;
        window.addEventListener('keydown', (e) => {
            if (e.key === 'i')
                this.showDebug = !this.showDebug;
            this.debug.style.display = this.showDebug ? 'block' : 'none';
        });
    }
    clear() {
        this.ctx.clearRect(0, 0, this.pxWidth, this.pxHeight);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);
    }
    renderMap() {
        const mapPxWidth = this.map.width * this.scale;
        const mapPxHeight = this.map.height * this.scale;
        this.ctx.save();
        this.ctx.translate(this.pxWidth - mapPxWidth - this.scale, this.scale);
        this.ctx.fillStyle = 'black';
        this.ctx.strokeStyle = 'white';
        this.ctx.fillRect(0, 0, mapPxWidth, mapPxHeight);
        this.ctx.strokeRect(0, 0, mapPxWidth, mapPxHeight);
        this.ctx.fillStyle = 'white';
        this.ctx.font = `${this.scale}px ${this.FONT}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.save();
        this.ctx.translate(this.halfScale, this.halfScale);
        for (let x = 0; x < this.map.width; x++) {
            for (let y = 0; y < this.map.height; y++) {
                const screenX = x * this.scale;
                const screenY = y * this.scale;
                this.ctx.fillText(this.map.getAt(x, y), screenX, screenY);
            }
        }
        this.ctx.restore();
        this.ctx.translate(this.player.x * this.scale, this.player.y * this.scale);
        this.ctx.rotate(this.player.a);
        this.ctx.fillText('@', 0, 0);
        this.ctx.restore();
    }
    renderDebug(elapsedTime) {
        const formatFloat = (f) => parseFloat(f.toFixed(7));
        const FPS = 1000 / elapsedTime;
        this.avgFPS.push(FPS);
        while (this.avgFPS.length > 60)
            this.avgFPS.shift();
        const avg = this.avgFPS.reduce((acc, fps) => acc + fps, 0) / this.avgFPS.length;
        this.debug.innerText = JSON.stringify({
            FPS: formatFloat(FPS),
            avg: formatFloat(avg),
            player: {
                x: formatFloat(this.player.x),
                y: formatFloat(this.player.y),
                a: formatFloat(this.player.a),
            },
        }, null, 2);
    }
    renderWorld() {
        const maxRayLength = Math.max(this.map.width, this.map.height);
        for (let x = 0; x < this.width; x++) {
            const fRayAngle = (this.player.a - this.halfFOV) + (x / this.width) * this.FOV;
            const fEyeX = Math.cos(fRayAngle);
            const fEyeY = Math.sin(fRayAngle);
            let fDistanceToWall = 0.0;
            let bHitWall = false;
            let bHitBoundary = false;
            while (!bHitWall && fDistanceToWall < maxRayLength) {
                fDistanceToWall += this.RAY_STEP_SIZE;
                const nTestX = Math.floor(this.player.x + fEyeX * fDistanceToWall);
                const nTestY = Math.floor(this.player.y + fEyeY * fDistanceToWall);
                if (nTestX < 0 || nTestX > this.map.width || nTestY < 0 || nTestY > this.map.height) {
                    bHitWall = true;
                    fDistanceToWall = maxRayLength;
                }
                else if (this.map.impassible(nTestX, nTestY)) {
                    bHitWall = true;
                    let p = [];
                    for (let x = 0; x < 2; x++) {
                        for (let y = 0; y < 2; y++) {
                            const vx = nTestX + x - this.player.x;
                            const vy = nTestY + y - this.player.y;
                            const d = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
                            const dot = (fEyeX * vx / d) + (fEyeY * vy / d);
                            p.push([d, dot]);
                        }
                    }
                    bHitBoundary = p
                        .sort(([left], [right]) => left - right)
                        .slice(0, 3)
                        .some(([_, dot]) => Math.acos(dot) < this.BOUND_SENSITIVITY);
                }
            }
            const nCeiling = this.halfHeight - (this.height / fDistanceToWall);
            const nFloor = this.height - nCeiling;
            const fAlpha = 1 - fDistanceToWall / maxRayLength;
            for (let y = 0; y < this.height; y++) {
                const nX = x * this.scale;
                const nY = y * this.scale;
                if (y <= nCeiling) {
                    const b = (this.halfHeight - y) / this.halfHeight;
                    this.ctx.fillStyle = `rgba(255,0,0,${b})`;
                    this.ctx.fillRect(nX, nY, this.scale, this.scale);
                }
                else if (y >= nFloor) {
                    const b = (y - this.halfHeight) / this.halfHeight;
                    this.ctx.fillStyle = `rgba(0,0,255,${b})`;
                    this.ctx.fillRect(nX, nY, this.scale, this.scale);
                }
                else {
                    this.ctx.fillStyle = `rgba(0,255,0,${fAlpha})`;
                    this.ctx.fillRect(nX, nY, this.scale, this.scale);
                    if (bHitBoundary) {
                        this.ctx.fillStyle = `rgba(0,0,0,${1 - fAlpha * 1.1})`;
                        this.ctx.fillRect(nX, nY, this.scale, this.scale);
                    }
                }
            }
        }
    }
}(120, 40, 16);
