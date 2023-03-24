window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  // built-in object that holds all canvas properties and drawing methods
  const ctx = canvas.getContext('2d');
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'purple';

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
      this.speedX = 0;
      this.speedY = 0;
      this.dx = 0;
      this.dy = 0;
      this.speedModifier = 3;
      this.spriteWidth = 255;
      this.spriteHeight = 256;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX;
      this.spriteY;
      this.frameX = 0;
      this.frameY = 5;
      this.image = document.getElementById('bull');
    }
    draw(context) {
      context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight,
        this.spriteWidth, this.spriteHeight,
        this.spriteX, this.spriteY,
        this.width, this.height);
      if (this.game.debug) {
        // to draw circle canvas
        context.beginPath();
        /**
         * built-in "arc" method which expects 5 args
         * (X and Y coordinates, RADIUS of circle, START and END angle in radians)
         */
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
      }
    }
    update() {
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      // sprite animation
      const angle = Math.atan2(this.dy, this.dx);
      if (angle < - 2.74 || angle > 2.74) this.frameY = 6;
      else if (angle < -1.96) this.frameY = 7;
      else if (angle < -1.17) this.frameY = 0;
      else if (angle < -0.39) this.frameY = 1;
      else if (angle < 0.39) this.frameY = 2;
      else if (angle < 1.17) this.frameY = 3;
      else if (angle < 1.96) this.frameY = 4;
      else if (angle < 2.74) this.frameY = 5;

      const distance = Math.hypot(this.dy, this.dx);
      if (distance > this.speedModifier) {
        this.speedX = this.dx / distance || 0;
        this.speedY = this.dy / distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 100;
      // horizontal boundaries
      if (this.collisionX < this.collisionRadius)
        this.collisionX = this.collisionRadius;
      else if (this.collisionX > this.game.width - this.collisionRadius)
        this.collisionX = this.game.width - this.collisionRadius;
      // vertical boundaries
      if (this.collisionY < this.game.topMargin + this.collisionRadius)
        this.collisionY = this.game.topMargin + this.collisionRadius;
      else if (this.collisionY > this.game.height - this.collisionRadius)
        this.collisionY = this.game.height - this.collisionRadius;
      // collisions with obstacles
      this.game.obstacles.forEach(obstacle => {
        // [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
        let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
        // let collision1 = game.checkCollision(this, obstacle)[0];
        // let distance = game.checkCollision(this, obstacle)[1];
        if (collision) {
          const unit_x = dx / distance;
          const unit_y = dy / distance;
          this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
          this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
        }
      })
    }
  }

  class Obstacle {
    constructor(game) {
      this.game = game;
      this.collisionX = Math.random() * this.game.width;
      this.collisionY = Math.random() * this.game.height;
      this.collisionRadius = 40;
      this.image = document.getElementById('obstacles');
      this.spriteWidth = 250;
      this.spriteHeight = 250;
      this.width = this.spriteWidth;
      this.height = this.spriteHeight;
      this.spriteX = this.collisionX - this.width * 0.5;
      this.spriteY = this.collisionY - this.height * 0.5 - 80;
      this.frameX = Math.floor(Math.random() * 4);
      this.frameY = Math.floor(Math.random() * 3);
    }
    draw(context) {
      context.drawImage(this.image, this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight, this.spriteWidth,
        this.spriteHeight, this.spriteX, this.spriteY,
        this.width, this.height);
      if (this.game.debug) {
        // to draw circle canvas
        context.beginPath();
        /**
         * built-in "arc" method which expects 5 args
         * (X and Y coordinates, RADIUS of circle, START and END angle in radians)
         */
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);

        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
      }
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.topMargin = 260;
      this.debug = true;
      this.player = new Player(this);
      this.fps = 60;
      this.timer = 0;
      this.interval = 1000 / this.fps;
      this.numberOfObstacles = 10;
      this.obstacles = [];
      this.mouse = {
        x: this.height * 0.5,
        y: this.height * 0.5,
        pressed: false
      }

      // event listeners for mouse controls
      canvas.addEventListener('mousedown', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true
      });
      canvas.addEventListener('mouseup', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false
      });
      canvas.addEventListener('mousemove', e => {
        if (this.mouse.pressed) {
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
      window.addEventListener('keydown', e => {
        if (e.key == 'd') this.debug = !this.debug;
      })
    }
    render(context, deltaTime) {
      if (this.timer > this.interval) {
        context.clearRect(0, 0, this.width, this.height);
        this.obstacles.forEach(obstacle => obstacle.draw(context));
        this.player.draw(context);
        this.player.update();
        this.timer = 0;
      }
      this.timer += deltaTime;
    }
    checkCollision(a, b) {
      const dx = a.collisionX - b.collisionX;
      const dy = a.collisionY - b.collisionY;
      const distance = Math.hypot(dy, dx);
      const sumOfRadii = a.collisionRadius + b.collisionRadius;
      return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
    }
    init() {
      let attempts = 0;
      while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
        let testObstacle = new Obstacle(this);
        let overlap = false;
        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const distanceBuffer = 150;
          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius + distanceBuffer;
          if (distance < sumOfRadii) {
            overlap = true;
          }
        });
        const margin = testObstacle.collisionRadius * 3;
        if (!overlap && testObstacle.spriteX > 0
          && testObstacle.spriteX < this.width - testObstacle.width
          && testObstacle.collisionY > this.topMargin + margin
          && testObstacle.collisionY < this.height - margin) {
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }
    }
  }

  const game = new Game(canvas);
  game.init();
  console.log(game);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    /**
     * here we used built-in clear rectangle method to clear old paint,
     * clear all canvas area with coord. 0, 0 to canvas width and height
     */
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }
  animate(0);
});