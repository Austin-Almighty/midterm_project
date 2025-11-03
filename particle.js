class Particle {
    constructor(x, y) {
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D().mult(random(1, 3));
      this.lifespan = 255;
    }
    
    update() {
      this.vel.y += 0.1; // Add gravity
      this.pos.add(this.vel);
      this.lifespan -= 5;
    }
    
    display() {
      noStroke();
      fill(255, this.lifespan);
      ellipse(this.pos.x, this.pos.y, 4);
    }
    
    isDone() {
      return this.lifespan < 0;
    }
  }