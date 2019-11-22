import KeyMap from './KeyMap.js'
import Display2D from './Display2D.js'

export default class GameEngine {
    constructor (width, height, scale, container = document.body) {
        this.width = width
        this.height = height
        this.scale = scale
        this.display = new Display2D(this.width * this.scale, this.height * this.scale, container)
        this.keyMap = new KeyMap()
    }

    get pxWidth () {
        return this.display.width
    }

    get pxHeight () {
        return this.display.height
    }

    get ctx () {
        return this.display.ctx
    }

    start () {
        this.display.draw(this.render.bind(this))
        this.keyMap.listen(this.update.bind(this))
    }
}
