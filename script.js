window.addEventListener('load', function () {
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d'); // built-in object that holds all canvas properties and drawing methods
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';

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
      context.fill();
    }
  }

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
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