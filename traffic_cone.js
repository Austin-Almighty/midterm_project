class TrafficCone {
  constructor(x, y, size) {
    this.size = size;
    this.done = false;
    
    // Use a triangle for the physics body
    this.body = Bodies.polygon(x, y, 3, this.size, {label: 'shape'});
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
    
    // Cone body (Orange)
    noStroke();
    fill(20, 100, 100); // Orange in HSB
    // Draw the main triangle
    triangle(0, -this.size, -this.size * 0.8, this.size * 0.8, this.size * 0.8, this.size * 0.8);
    
    // White stripe
    fill(0, 0, 100);
    beginShape();
    vertex(-this.size * 0.4, 0);
    vertex(this.size * 0.4, 0);
    vertex(this.size * 0.55, this.size * 0.3);
    vertex(-this.size * 0.55, this.size * 0.3);
    endShape(CLOSE);
    
    // Base (Orange rectangle at bottom)
    fill(20, 100, 100);
    rect(0, this.size * 0.8, this.size * 2.2, this.size * 0.2);
    
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
