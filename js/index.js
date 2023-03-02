import { Player } from './Player.js'
import { Ghost } from './Ghost.js'
import * as c from './canvas.js'

const scoreElement = document.querySelector('#scoreElement');

let score = 0
let animationId

const player = new Player({
  position: {
    x: c.Boundary.width + c.Boundary.width /2,
    y: c.Boundary.height + c.Boundary.height /2,
  }, 
  velocity: {
    x:0, 
    y:0
  }
});

const ghosts = [
  new Ghost({
    position: {    
      x: c.Boundary.width *6 + c.Boundary.width /2,
      y: c.Boundary.height + c.Boundary.height /2,
    },
    velocity: {x: 5, y: 0}
  }),
  new Ghost({
    position: {    
      x: c.Boundary.width *6 + c.Boundary.width /2,
      y: c.Boundary.height *9 + c.Boundary.height /2,
    },
    velocity: {x: 5, y: 0},
    color: 'pink'
  }),
]

function handleCollision({movingObject, blockadeObject}) {
  const padding = c.Boundary.width /2 - movingObject.radius -1
  return (
    movingObject.position.y - movingObject.radius + movingObject.velocity.y 
    <= blockadeObject.position.y + blockadeObject.height + padding 
    
    &&
    movingObject.position.x + movingObject.radius + movingObject.velocity.x 
    >= blockadeObject.position.x - padding 
    
    &&
    movingObject.position.y + movingObject.radius + movingObject.velocity.y 
    >= blockadeObject.position.y - padding 
    
    &&
    movingObject.position.x - movingObject.radius + movingObject.velocity.x 
    <= blockadeObject.position.x + blockadeObject.width + padding
  )
}

function animate() {

  const animationId = requestAnimationFrame(animate)
  c.ctx.clearRect(0, 0, c.canvas.width, c.canvas.height)
  
  if (direction.up.pressed && direction.last === 'up') {
    
    for (let i = 0; i < c.boundaries.length; i++) {
      const boundary = c.boundaries[i];
      if (handleCollision({
        movingObject: {...player, velocity: {x: 0, y: -5}},
        blockadeObject: boundary
      })) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -5
      }
    }
    
  } else if (direction.down.pressed && direction.last === 'down') {
    
    for (let i = 0; i < c.boundaries.length; i++) {
      const boundary = c.boundaries[i];
      if (handleCollision({
        movingObject: {...player, velocity: {x: 0, y: 5}},
        blockadeObject: boundary
      })) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = 5
      }
    }

  } else if (direction.left.pressed && direction.last === 'left') {

    for (let i = 0; i < c.boundaries.length; i++) {
      const boundary = c.boundaries[i];
      if (handleCollision({
        movingObject: {...player, velocity: {x: -5, y: 0}},
        blockadeObject: boundary
      })) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -5
      }
    }

  } else if (direction.right.pressed && direction.last === 'right') {

    for (let i = 0; i < c.boundaries.length; i++) {
      const boundary = c.boundaries[i];
      if (handleCollision({
        movingObject: {...player, velocity: {x: 5, y: 0}},
        blockadeObject: boundary
      })) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = 5
      }
    }

  }

  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI 
  else if (player.velocity.y < 0) player.rotation = Math.PI *1.5
  else if (player.velocity.y > 0) player.rotation = Math.PI /2

  //Walls rendering
  c.boundaries.forEach( boundary => {
    
    boundary.draw()

    //Player collision handling
    if ( handleCollision({ movingObject: player, blockadeObject: boundary })) {
      player.velocity.y = 0
      player.velocity.x = 0
    }
    
  })

  //Ghosts contact
  for (let i = ghosts.length -1; 0 <= i; i--) {
    const ghost = ghosts[i]
    if (
      Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) 
      < ghost.radius + player.radius
    ) {
      if (ghost.scared) {
        ghosts.splice(i, 1)
        score += 250
        scoreElement.innerHTML = score
      } else {
        cancelAnimationFrame(animationId)
        alert('You lose!')
      }
    } 
  }

  //PowerUps rendering
  for (let i = c.powerUps.length -1; 0 <= i; i--) {
    const powerUp = c.powerUps[i];
    powerUp.draw()    

    if (
        Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) 
        < powerUp.radius + player.radius
      ) {

      c.powerUps.splice(i, 1)
      score += 100
      scoreElement.innerHTML = score

      ghosts.forEach( ghost =>{
        ghost.scared = true
        setTimeout(() => { ghost.scared = false}, 6000)
      })
    }
  }

  //Pellets rendering
  for (let i = c.pellets.length -1; 0 < i; i--) {
    const pellet = c.pellets[i];
    pellet.draw()    

    if (
        Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) 
        < pellet.radius + player.radius
      ) {
      c.pellets.splice(i, 1)
      score += 10
      scoreElement.innerHTML = score

    }
  }
  
  //Winning condition
  if (c.pellets.length -1 === 0) {
    alert('You Win!')
    cancelAnimationFrame(animationId)
  }

  //Ghosts handling collision
  ghosts.forEach(ghost => {
    ghost.update()
    
    const collisions = []

    c.boundaries.forEach(boundary => {
      if (!collisions.includes('right') && handleCollision({
        movingObject: {...ghost, velocity: {x: ghost.speed, y: 0}},
        blockadeObject: boundary
      })) {
        collisions.push('right')
      }
      if (!collisions.includes('left') && handleCollision({
        movingObject: {...ghost, velocity: {x: -ghost.speed, y: 0}},
        blockadeObject: boundary
      })) {
        collisions.push('left')
      }
      if (!collisions.includes('up') && handleCollision({
        movingObject: {...ghost, velocity: {x: 0, y: -ghost.speed}},
        blockadeObject: boundary
      })) {
        collisions.push('up')
      }
      if (!collisions.includes('down') && handleCollision({
        movingObject: {...ghost, velocity: {x: 0, y: ghost.speed}},
        blockadeObject: boundary
      })) {
        collisions.push('down')
      }
    })

    if (collisions.length > ghost.prevCollisions.length) ghost.prevCollisions = collisions

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {
      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
      
      const pathways = ghost.prevCollisions.filter( collision => { return !collisions.includes(collision) })

      const chosenDirection = pathways[Math.floor(Math.random() * pathways.length)]

      switch (chosenDirection) {
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break

        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break

        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break

        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
      }

      ghost.prevCollisions = []
    }

  })
  
  player.update()

}


const direction = {
  last: '',
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
  
}

addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w' :
    case'ArrowUp':
      direction.up.pressed = true
      direction.last = 'up'
      break;
    case 's' :
    case'ArrowDown':
      direction.down.pressed = true
      direction.last = 'down'
      break;
    case 'a' :
    case'ArrowLeft':
      direction.left.pressed = true
      direction.last = 'left'
      break;
    case 'd' :
    case'ArrowRight':
      direction.right.pressed = true
      direction.last = 'right'
      break;
  
  }
})

addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w' :
    case'ArrowUp':
      direction.up.pressed = false
      break;
    case 's' :
    case'ArrowDown':
      direction.down.pressed = false
      break;
    case 'a' :
    case'ArrowLeft':
      direction.left.pressed = false
      break;
    case 'd' :
    case'ArrowRight':
      direction.right.pressed = false
      break;
  }
})

animate()