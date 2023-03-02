import { ctx } from './canvas.js'

export class PowerUp {
  constructor({position}) {
    this.position = position
    this.radius = 5
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'yellow'
    ctx.fill()
    ctx.closePath()
  }
}

