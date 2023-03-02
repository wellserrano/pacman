import { ctx } from './canvas.js'

export class Pellet {
  constructor({position}) {
    this.position = position
    this.radius = 3
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'white'
    ctx.fill()
    ctx.closePath()
  }
}

