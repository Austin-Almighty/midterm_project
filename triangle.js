class Triangle {
    constructor(x, y, size) {
      this.size = size;
      this.done = false;
      this.c = random(palette);
      
      this.body = Bodies.polygon(x, y, 3, this.size, {label: 'shape'});
      Body.setAngularVelocity(this.body, 0.2);
      Composite.add(engine.world, this.body);
    }
    
    display() {
      noStroke(); fill(this.c);
      let x = this.body.position.x;
      let y = this.body.position.y; 
      let angle = this.body.angle;
      push();
      translate(x, y);
      rotate(angle);
      triangle(0, -this.size, -this.size, this.size / 2, this.size, this.size / 2);
      pop();
    }
    
    checkDone() {
      if (this.body.position.y - this.size > height) {
        this.done = true;
      } else {
        this.done = false;
      }
    }
    
    removeBox() {
      Composite.remove(engine.world, this.body);
    }
  }