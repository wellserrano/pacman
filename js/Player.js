import { ctx } from './canvas.js'

export class Player {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = 'yellow'
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

