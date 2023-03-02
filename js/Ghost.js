import { ctx } from './canvas.js'

export class Ghost {
  static speed = 2
  constructor({position, velocity, color = 'red'}) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
    this.speed = 2
    this.prevCollisions = []
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
    ctx.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

