class Building {
  constructor(x, y, w, h) {
    this.w = w;
    this.h = h * 2; // Taller aspect ratio for skyscrapers
    this.done = false;
    this.c = color(random(20, 60)); // Dark grey/blue building color
    
    this.body = Bodies.rectangle(x, y, this.w, this.h, {label: 'shape'});
    Body.setAngularVelocity(this.body, 0.1);
    Composite.add(engine.world, this.body);

    // Generate window pattern
    this.windows = [];
    let rows = 5;
    let cols = 3;
    for(let i=0; i<cols; i++) {
      for(let j=0; j<rows; j++) {
        if(random() > 0.3) { // 70% chance of a lit window
          this.windows.push({
            x: map(i, 0, cols-1, -this.w/2 + 5, this.w/2 - 5),
            y: map(j, 0, rows-1, -this.h/2 + 5, this.h/2 - 5),
            w: this.w/cols - 4,
            h: this.h/rows - 4
          });
        }
      }
    }
  }
  
  display() {
    let x = this.body.position.x;
    let y = this.body.position.y; 
    let angle = this.body.angle;
    push();
    translate(x, y);
    rotate(angle);
    
    // Building body
    noStroke();
    fill(this.c);
    rect(0, 0, this.w, this.h);
    
    // Windows
    fill(60, 100, 100); // Bright yellow/white windows (HSB)
    for(let win of this.windows) {
      rect(win.x + win.w/2, win.y + win.h/2, win.w, win.h); // Adjust for CENTER mode if needed, but relative coords are easier
    }
    
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
