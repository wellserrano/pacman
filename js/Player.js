import { ctx } from './canvas.js'

export class Player {
  constructor({position, velocity}) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = .75
    this.openRate = .08
    this.rotation = 0
  }

  draw() {
    ctx.save()
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation)
    ctx.translate(-this.position.x, -this.position.y)
    ctx.beginPath()
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    )
    ctx.lineTo(this.position.x, this.position.y)
    ctx.fillStyle = 'yellow'
    ctx.fill()
    ctx.closePath()
    ctx.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

    this.radians += this.openRate

  }
}

