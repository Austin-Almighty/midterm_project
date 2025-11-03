class Circle {
    constructor(x, y, r) {
      this.r = r;
      this.done = false;
      this.c = random(palette);
      
      this.body = Bodies.circle(x, y, this.r);
      Body.setAngularVelocity(this.body, 0.2);
      Composite.add(engine.world, this.body);
    }
    
    display() {
      noStroke(); fill(this.c);
      let x = this.body.position.x;
      let y = this.body.position.y; 
      push();
      translate(x, y);
      ellipse(0, 0, this.r * 2);
      pop();
    }
    
    checkDone() {
      if (this.body.position.y - this.r > height) {
        this.done = true;
      } else {
        this.done = false;
      }
    }
    
    removeBox() {
      Composite.remove(engine.world, this.body);
    }
  }