class Tire {
  constructor(x, y, r) {
    this.r = r;
    this.done = false;
    
    this.body = Bodies.circle(x, y, this.r, {label: 'shape', restitution: 0.8}); // Bouncy tire
    Body.setAngularVelocity(this.body, 0.2);
    Composite.add(engine.world, this.body);
  }
  
  display() {
    let x = this.body.position.x;
    let y = this.body.position.y; 
    let angle = this.body.angle;
    push();
    translate(x, y);
    rotate(angle);
    
    // Rubber tire (Black)
    noStroke();
    fill(0, 0, 20); 
    ellipse(0, 0, this.r * 2);
    
    // Hubcap (Grey)
    fill(0, 0, 70);
    ellipse(0, 0, this.r * 1.2);
    
    // Lug nuts / Detail
    fill(0, 0, 30);
    for(let i=0; i<5; i++) {
      let a = TWO_PI/5 * i;
      let lx = cos(a) * this.r * 0.3;
      let ly = sin(a) * this.r * 0.3;
      ellipse(lx, ly, this.r * 0.15);
    }
    
    // Center hole
    fill(0, 0, 20);
    ellipse(0, 0, this.r * 0.2);
    
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
