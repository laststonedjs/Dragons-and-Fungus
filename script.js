window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d'); // built-in object that holds all canvas properties and drawing methods
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'white';

  class Player {
    constructor(game) {
      this.game = game;
      this.collisionX = this.game.width * 0.5;
      this.collisionY = this.game.height * 0.5;
      this.collisionRadius = 30;
    }
    draw(context) {
      context.beginPath(); // to draw circle canvas
      // built-in "arc" method which expects 5 args(X and Y coordinates, RADIUS of circle, START and END angle in radians)
      context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
      context.save();
      context.globalAlpha = 0.5;
      context.fill();
      context.restore();
      context.stroke();
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
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
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        console.log(this.mouse.x);
      })
    }
    render(context) {
      this.player.draw(context);
    }
  }

  const game = new Game(canvas);
  game.render(ctx);
  console.log(game);

  function animate() {

  }
});