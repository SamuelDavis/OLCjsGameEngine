import KeyMap from './KeyMap.js'
import Display2D from './Display2D.js'

export default class GameEngine {
  constructor (width, height, scale, container = document.body) {
    this.width = width
    this.height = height
    this.scale = scale
    this.keyMap = new KeyMap()
    this.display = new Display2D(this.width * this.scale, this.height * this.scale, container)
    this.init()
    this.keyMap.listen(this.update.bind(this))
    this.display.draw(this.render.bind(this))
  }

  get pxWidth () {
    return this.ctx.canvas.width
  }

  get pxHeight () {
    return this.ctx.canvas.height
  }

  get ctx () {
    return this.display.ctx
  }
}
