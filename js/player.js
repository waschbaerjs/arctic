function Player(x, y, w, h) {
  this.pos = {
    x: x,
    y: y
  };
  this.width =  w;
  this.height =  h;
  this.vel =  3;
  this.render =  function () {
    ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
    ctx.fillText('Spieler', this.pos.x - this.width/3, this.pos.y - 10);
  };
  this.update = function () {
    if (keyState[37] && this.pos.x >= -WIDTH * 4) this.pos.x -= this.vel;
    if (keyState[39] && this.pos.x <= WIDTH * 4 - this.width) this.pos.x += this.vel;
    if (keyState[38] && this.pos.y >= -HEIGHT * 4) this.pos.y -= this.vel;
    if (keyState[40] && this.pos.y <= HEIGHT * 4 - this.height) this.pos.y += this.vel;
  };
}
