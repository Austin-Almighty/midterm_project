class GarbageCan {
  constructor(x, y, w, h) {
    this.w = w;
    this.h = h * 1.5; // Slightly taller than wide
    this.done = false;
    this.c = color(100); // Metallic grey
    
    this.body = Bodies.rectangle(x, y, this.w, this.h, {label: 'shape'});
    Body.setAngularVelocity(this.body, 0.1);
    Composite.add(engine.world, this.body);
  }
  
  display() {
    let x = this.body.position.x;
    let y = this.body.position.y; 
    let angle = this.body.angle;
    push();
    translate(x, y);
    rotate(angle);
    
    // Main body (Metallic Grey)
    noStroke();
    fill(120); 
    rect(0, 0, this.w, this.h);
    
    // Vertical ribs/striations
    fill(100);
    let ribCount = 4;
    let ribW = this.w / (ribCount * 2 + 1);
    for(let i=0; i<ribCount; i++) {
      let rx = map(i, 0, ribCount-1, -this.w/2 + ribW*1.5, this.w/2 - ribW*1.5);
      rect(rx, 0, ribW, this.h * 0.9);
    }
    
    // Lid (Darker Grey)
    fill(80);
    rect(0, -this.h/2 - 2, this.w + 4, 6);
    // Handle on lid
    rect(0, -this.h/2 - 6, this.w/3, 4);
    
    // Side handles
    fill(80);
    rect(-this.w/2 - 2, -this.h/4, 4, 10);
    rect(this.w/2 + 2, -this.h/4, 4, 10);
    
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
