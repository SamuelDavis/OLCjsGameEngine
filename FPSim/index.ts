import GameEngine from "../GameEngine.js";
import Player from "./src/Player.js";
import GameMap from "./src/GameMap.js";

new class extends GameEngine {
    private readonly HALF_PI: number = Math.PI / 2;
    private readonly FONT: string = 'monospace';
    private readonly FOV: number = Math.PI / 4;
    private readonly halfFOV: number = this.FOV / 2;
    private readonly RAY_STEP_SIZE: number = 0.5;
    private readonly BOUND_SENSITIVITY: number = 0.006;

    private halfHeight: number;
    private halfScale: number;
    private debug: HTMLPreElement;
    private avgFPS: number[] = [];
    private map: GameMap;
    private player: Player;

    render(elapsedTime: number): void {
        this.clear();
        this.renderWorld();
        this.renderMap();
        this.renderDebug(elapsedTime);
    }

    update(elapsedTime: number): void {
        if (this.keyMap.has('a')) this.player.a -= this.player.speed.t * elapsedTime;
        if (this.keyMap.has('d')) this.player.a += this.player.speed.t * elapsedTime;
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

    protected init() {
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
        this.player = new Player(2, 2, 2);
        this.debug = document.createElement('pre');
        document.body.appendChild(this.debug);
        this.halfScale = this.scale / 2;
        this.halfHeight = this.height / 2;
    }

    private clear() {
        this.ctx.clearRect(0, 0, this.pxWidth, this.pxHeight);
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.pxWidth, this.pxHeight);
    }

    private renderMap() {
        const mapPxWidth: number = this.map.width * this.scale;
        const mapPxHeight: number = this.map.height * this.scale;

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
        this.ctx.clearRect(-this.halfScale, -this.halfScale, this.scale, this.scale);
        this.ctx.rotate(this.player.a);
        this.ctx.fillText('@', 0, 0);
        this.ctx.restore();
    }

    private renderDebug(elapsedTime: number) {
        const FPS = 1000 / elapsedTime;
        this.avgFPS.push(FPS);
        while (this.avgFPS.length > 60) this.avgFPS.shift();
        this.debug.innerText = JSON.stringify({
            FPS: FPS.toFixed(7),
            avg: (this.avgFPS.reduce((acc: number, fps: number) => acc + fps, 0) / this.avgFPS.length).toFixed(7),
            player: this.player,
        }, null, 2);
    }

    private renderWorld() {
        const maxRayLength = Math.max(this.map.width, this.map.height);
        for (let x: number = 0; x < this.width; x++) {
            const fRayAngle: number = (this.player.a - this.halfFOV) + (x / this.width) * this.FOV;
            const fEyeX: number = Math.cos(fRayAngle);
            const fEyeY: number = Math.sin(fRayAngle);
            let fDistanceToWall: number = 0.0;
            let bHitWall: boolean = false;
            let bHitBoundary: boolean = false;

            while (!bHitWall && fDistanceToWall < maxRayLength) {
                fDistanceToWall += this.RAY_STEP_SIZE;
                const nTestX: number = Math.floor(this.player.x + fEyeX * fDistanceToWall);
                const nTestY: number = Math.floor(this.player.y + fEyeY * fDistanceToWall);

                if (nTestX < 0 || nTestX > this.map.width || nTestY < 0 || nTestY > this.map.height) {
                    bHitWall = true;
                    fDistanceToWall = maxRayLength;
                } else if (this.map.impassible(nTestX, nTestY)) {
                    bHitWall = true;
                    let p: [number, number][] = [];
                    for (let x: number = 0; x < 2; x++) {
                        for (let y: number = 0; y < 2; y++) {
                            const vx: number = nTestX + x - this.player.x;
                            const vy: number = nTestY + y - this.player.y;
                            const d: number = Math.sqrt(Math.pow(vx, 2) + Math.pow(vy, 2));
                            const dot: number = (fEyeX * vx / d) + (fEyeY * vy / d);
                            p.push([d, dot]);
                        }
                    }
                    bHitBoundary = p
                        .sort(([left]: [number, number], [right]: [number, number]) => left - right)
                        .slice(0, 3)
                        .some(([_, dot]: [number, number]) => Math.acos(dot) < this.BOUND_SENSITIVITY)
                }
            }

            const nCeiling = this.halfHeight - (this.height / fDistanceToWall);
            const nFloor = this.height - nCeiling;

            const fAlpha = 1 - fDistanceToWall / maxRayLength;

            for (let y: number = 0; y < this.height; y++) {
                const nX: number = x * this.scale;
                const nY: number = y * this.scale;
                if (y <= nCeiling) {
                    const b = (this.halfHeight - y) / this.halfHeight;
                    this.ctx.fillStyle = `rgba(255,0,0,${b})`;
                    this.ctx.fillRect(nX, nY, this.scale, this.scale);
                } else if (y >= nFloor) {
                    const b = (y - this.halfHeight) / this.halfHeight;
                    this.ctx.fillStyle = `rgba(0,0,255,${b})`;
                    this.ctx.fillRect(nX, nY, this.scale, this.scale);
                } else {
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
