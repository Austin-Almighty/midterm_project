class Rect {
    constructor(x, y, w, h) {
      this.w = w; 
      this.h = h;
      this.done = false;
      this.c = random(palette);
      
      this.body = Bodies.rectangle(x, y, this.w, this.h, {label: 'shape'});
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
      rect(0, 0, this.w, this.h);
      pop();
    }
    
    checkDone() {
      if (this.body.position.y - this.h > height) {
        this.done = true;
      } else {
        this.done = false;
      }
    }
    
    removeBox() {
      Composite.remove(engine.world, this.body);
    }
  }