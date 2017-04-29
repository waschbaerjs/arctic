/*
*  ARCTIC SCIENTISTS
*  Version: Alpha 0.1.2
*/

function Arctic(w, h) {
  let WIDTH = w, HEIGHT = h;
  var CANVAS, CTX,
      CAMERA, HOUSE,
      RADIO, FRAMES,
      PLAYER, NPC,
      HEALTH,
      keyState, gameObjects,

  preload = function () {
    init();
  },

  init = function () {
    //creating CANVAS and context
    CANVAS = document.createElement('CANVAS');
    CANVAS.width = WIDTH;
    CANVAS.height = HEIGHT;
    CTX = CANVAS.getContext('2d');
    document.body.appendChild(CANVAS);

    keyState = [];
    gameObjects = [];
    FRAMES = 0;

    // eventlisteners for the controls
    document.addEventListener('keydown', function (e) {
      keyState[e.keyCode] = true;
    });
    document.addEventListener('keyup', function (e) {
      delete keyState[e.keyCode];
    });

    //NPC
    NPC = new GObject(50, 50, 20, 40);
    NPC.vel = 1;
    NPC.render = function () {
      if (objectIntersect(NPC, CAMERA)) {
        CTX.save();
        CTX.fillStyle = "#FF0000";
        CTX.fillRect(this.x, this.y, this.width, this.height);
        CTX.fillText('NPC (oder so)', this.x - this.width, this.y - 10);
        CTX.restore();
      }
    };
    NPC.update = function () {
      if (!(FRAMES % 60)) {
        this.vel = 1 * Math.floor(Math.random() * 5 - 2);
      }
      this.x = Math.floor(Math.random() * 2) ? this.x + this.vel : this.x - this.vel;
      this.y = Math.floor(Math.random() * 2) ? this.y + this.vel : this.y - this.vel;
    };

    //PLAYER
    PLAYER = new GObject(50, 50, 20, 48);
    PLAYER.vel =  {x: 0, y: 0};
    PLAYER.health = 100;
    PLAYER.stamina = 75;
    PLAYER.sprite = new Image();
    PLAYER.sprite.src = 'assets/char.png';
    PLAYER.animation = 2;
    PLAYER.render = function () {
      CTX.drawImage(this.sprite, 0, this.height * this.animation, 32, this.height, this.x, this.y, 32, this.height);

      CTX.save();
      CTX.fillStyle = '#77FF00';
      CTX.fillRect(CAMERA.x + 20, CAMERA.y + 20, PLAYER.health, 10);
      CTX.strokeRect(CAMERA.x + 20, CAMERA.y + 20, 100, 10);
      CTX.fillStyle = '#3300FF';
      CTX.fillRect(CAMERA.x + 20, CAMERA.y + 30, PLAYER.stamina, 5);
      CTX.strokeRect(CAMERA.x + 20, CAMERA.y + 30, 75, 5);
      CTX.restore();
    };
    PLAYER.update = function () {
      if (!(FRAMES % 6) && this.stamina > 0 && !objectIntersect(HOUSE, PLAYER)) {
        this.stamina--;
      } else if (this.stamina < 75 && !(FRAMES % 6) && objectIntersect(HOUSE, PLAYER)) {
        this.stamina++;
      }

      console.log(this.stamina);

      if (!(FRAMES % 24) && this.stamina == 0 && !objectIntersect(HOUSE, PLAYER) && this.health > 0) {
        console.log('STIRB');
        this.health--;
      } else if (this.stamina == 75 && this.health < 100 && !(FRAMES % 60)) {
        this.health++;
      }

      if (keyState[37] && this.x >= -WIDTH * 4) {
        this.vel.x = -3;
        this.animation = 0;
      } else if (keyState[39] && this.x <= WIDTH * 4 - this.width) {
        this.vel.x = 3;
        this.animation = 1;
      } else {
        this.vel.x = 0;
      }
      if (keyState[38] && this.y >= -HEIGHT * 4) {
        this.vel.y = -3;
        this.animation = 3;
      } else if (keyState[40] && this.y <= HEIGHT * 4 - this.height) {
        this.vel.y = 3;
        this.animation = 2;
      } else {
        this.vel.y = 0;
      }

      this.x += this.vel.x;
      this.y += this.vel.y;
    };

    //CAMERA
    CAMERA = new GObject(null, null, WIDTH, HEIGHT);
    CAMERA.update = function () {
      this.x = PLAYER.x - WIDTH / 2;
      this.y = PLAYER.y - HEIGHT / 2;

      CTX.setTransform(1, 0, 0, 1, 0, 0);
      CTX.clearRect(-WIDTH*4, -HEIGHT*4, WIDTH * 8, HEIGHT * 8);
      CTX.translate(WIDTH/2 - PLAYER.x, HEIGHT/2 - PLAYER.y);
    };

    //HOUSE
    HOUSE = new GObject(-100, -100, 320, 320);
    HOUSE.walls = [
      new Wall(HOUSE.x, HOUSE.y, HOUSE.width, 5), //OBEN
      new Wall(HOUSE.x, HOUSE.y + 5, 5, HOUSE.height - 5), //LINKS
      new Wall(HOUSE.x, HOUSE.y + HOUSE.height - 5, HOUSE.width, 5),
      new Wall(HOUSE.x + HOUSE.width - 5, HOUSE.y, 5, HOUSE.height / 2 - 18),
      new Wall(HOUSE.x + HOUSE.width - 5, HOUSE.y + HOUSE.height / 2 + 18, 5, HOUSE.height / 2 - 18)
    ];
    HOUSE.render = function () {
      for (var i = 0; i < this.walls.length; i++) {
        this.walls[i].render();
      }
    };

    //RADIO
    RADIO = new GObject(-80, -80, 32, 32);
    RADIO.sprite = new Image();
    RADIO.sprite.src = 'assets/radio.png';
    RADIO.song = new Audio();
    RADIO.song.src = "assets/radio.mp3";
    RADIO.song.volume = 0.15;
    RADIO.render = function () {
        if (!this.song.paused) {
          CTX.drawImage(this.sprite, 32, 0, 32, 32, this.x, this.y, 32, 32);
        } else {
          CTX.drawImage(this.sprite, 0, 0, 32, 32, this.x, this.y, 32, 32);
        }
    };
    RADIO.update = function () {
      if (PLAYER.animation == 3) {
        if (objectIntersect(RADIO, PLAYER) && keyState[32]) {
          if (!this.song.paused) {
            this.song.pause();
          } else {
            this.song.play();
          }
        } else if (objectIntersect(RADIO, PLAYER) && keyState[82]) {
          this.song.currentTime = 0;
          this.song.play();
        }
      }
    };

    // relativ game objects, just for orientation
    for (var i = 0; i < 50000; i++) {
      gameObjects.push(new Dot(Math.floor(Math.random() * 8 * WIDTH) - 4 * WIDTH, Math.floor(Math.random() * 8 * HEIGHT) - 4 * HEIGHT, 2, 2));
    }

    run();
  },

  run = function () {
      update();
      render();
      window.requestAnimationFrame(run, CANVAS);
  },

  render = function () {
    //draw dots
    CTX.save();
    CTX.fillStyle = 'rgba(34, 34, 34, .25)';
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].render();
    }
    CTX.restore();


    HOUSE.render();
    RADIO.render();
    PLAYER.render();
    NPC.render();
    CTX.strokeRect(-WIDTH*4, -HEIGHT*4, WIDTH*8, HEIGHT*8);
  },

  update = function () {
    FRAMES++;
    CAMERA.update();
    RADIO.update();
    NPC.update();
    PLAYER.update();
  };


  //CONSTRUCTORS
  function GObject(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }

  function Dot (x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  };
  Dot.prototype.render = function () {
    if (objectIntersect(this, CAMERA)) CTX.fillRect(this.x, this.y, this.width, this.height);
  }

  function Wall(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  Wall.prototype.render = function () {
    CTX.fillRect(this.x, this.y, this.width, this.height);
  };

  //OTHER FUNCTIONS
  function objectIntersect(a, b) {
    return a.x < b.x + b.width && a.y < b.y + b.height && b.x < a.x + a.width && b.y < a.y + a.height;
  }

  preload();
}

window.onload = function () {
  window.game = new Arctic(480, 480);
}
