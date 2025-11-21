class OldBoot {
  constructor(x, y, size) {
    this.size = size;
    this.done = false;
    
    // Define vertices for an L-shaped boot
    // Relative to (0,0)
    let s = size * 0.8;
    let vertices = [
      {x: -s/2, y: -s},     // Top-left of leg
      {x: s/2, y: -s},      // Top-right of leg
      {x: s/2, y: s/2},     // Inner corner
      {x: s*1.5, y: s/2},   // Toe tip top
      {x: s*1.5, y: s},     // Toe tip bottom
      {x: -s/2, y: s}       // Heel bottom
    ];
    
    this.body = Bodies.fromVertices(x, y, [vertices], {label: 'shape'}, true);
    if (this.body) {
      Body.setAngularVelocity(this.body, 0.1);
      Composite.add(engine.world, this.body);
    } else {
      this.done = true;
    }
  }
  
  display() {
    if (!this.body) return;
    
    // Draw the body parts (Matter.js compound body)
    push();
    noStroke();
    fill(25, 60, 40); 
    
    // Iterate over parts to draw the compound body
    // Note: parts[0] is the main body, subsequent parts are the sub-hulls
    // If it's a compound body, we should draw parts starting from index 1
    // If it's not compound (parts.length === 1), we draw parts[0]
    let partsToDraw = this.body.parts.length > 1 ? this.body.parts.slice(1) : this.body.parts;

    for (let part of partsToDraw) {
      beginShape();
      for (let v of part.vertices) {
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
    pop();

    // Draw details (Laces)
    let x = this.body.position.x;
    let y = this.body.position.y; 
    let angle = this.body.angle;
    
    push();
    translate(x, y);
    rotate(angle);
    
    stroke(30, 50, 70);
    strokeWeight(2);
    // Approximate lace positions relative to center
    line(-this.size*0.2, -this.size*0.5, 0, -this.size*0.5);
    line(-this.size*0.2, -this.size*0.2, 0, -this.size*0.2);
    
    pop();
  }
  
  checkDone() {
    if (!this.body) {
      this.done = true;
      return;
    }
    if (this.body.position.y - this.size > height) {
      this.done = true;
    } else {
      this.done = false;
    }
  }
  
  removeBox() {
    if (this.body) {
      Composite.remove(engine.world, this.body);
    }
  }
}
