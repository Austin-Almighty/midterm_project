class Block {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.z = 0;
    this.targetZ = 0;
  }

  update(mouseX, mouseY) {
    if (
      mouseX > this.x - this.size / 2 &&
      mouseX < this.x + this.size / 2 &&
      mouseY > this.y - this.size / 2 &&
      mouseY < this.y + this.size / 2
    ) {
      this.targetZ = 200;
    } else {
      this.targetZ = 0;
    }
    this.z = lerp(this.z, this.targetZ, 0.1);
  }

  draw() {
    push();
    translate(this.x, this.y, this.z);
    fill(this.color);
    noStroke();
    box(this.size, this.size, 50);
    pop();
  }
}
