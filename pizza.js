class PizzaSlice {
  constructor(x, y, size) {
    this.size = size;
    this.done = false;
    
    // Triangle body
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
    
    // Cheese (Yellow/Orange)
    noStroke();
    fill(45, 100, 100); 
    triangle(0, -this.size, -this.size * 0.8, this.size * 0.8, this.size * 0.8, this.size * 0.8);
    
    // Crust (Brown)
    fill(30, 60, 60);
    beginShape();
    vertex(-this.size * 0.8, this.size * 0.8);
    vertex(this.size * 0.8, this.size * 0.8);
    vertex(this.size * 0.8, this.size * 0.6);
    vertex(-this.size * 0.8, this.size * 0.6);
    endShape(CLOSE);
    
    // Pepperoni (Red)
    fill(0, 80, 80);
    ellipse(0, 0, this.size * 0.4);
    ellipse(-this.size * 0.3, this.size * 0.4, this.size * 0.3);
    ellipse(this.size * 0.3, this.size * 0.2, this.size * 0.3);
    
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
