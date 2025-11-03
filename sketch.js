let sides = 6; 
let hexR = 80; let arcD = hexR; 
let w, h, stepX, stepY;
let cols, rows;
let hexagons = [];

let distFromCenter = hexR / 6;
let thickness = 8;

let types = ['A', 'B', 'C', 'D'];
let palette = ["#abcd5e", "#14976b", "#2b67af", "#62b6de", "#f589a3", "#ef562f", "#fc8405", "#f9d531"]; 

// Matter.js
const {Engine, Body, Bodies, Composite} = Matter;
let engine;
let shapes = []; 
let shapeSize = 10;

let shapeTypes = ['rectangle', 'circle', 'triangle'];
let currentShapeIndex = 0;

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);
  engine = Engine.create();
  
  h = Math.sqrt(3) * hexR;
  w = 2 * hexR;
  stepX = 1.5 * hexR;
  stepY = h;

  cols = floor((width + hexR) / stepX) + 1;
  rows = floor((height + h/2) / stepY) + 1;
  
  createGrid();
}

function createGrid() {
  hexagons = [];
  for (let i = 0; i < cols; i++) {
    hexagons[i] = [];
    for (let j = 0; j < rows; j++) {
      let x = i * stepX;
      let y = (i % 2 === 0) ? j * stepY : j * stepY + h/2;

      const canvasX = x + width/2  - (cols-1)*stepX/2;
      const canvasY = y + height/2 - (rows-1)*stepY/2;

      const type = random(types);
      const hexagon = new Hex(canvasX, canvasY, type);
      hexagons[i][j] = hexagon;
    }
  }
}

function reset() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].removeBox();
    shapes.splice(i, 1);
  }
  Composite.clear(engine.world, false);
  createGrid();
}

function draw() {
  background(0, 0, 100);
  Engine.update(engine);
  
  if (random()<0.1) {
    let x = floor(random(0, cols));
    let y = floor(random(0, rows));
    hexagons[x][y].startRotation();
  }
  
  for (let i=shapes.length-1; i>=0; i--) {
    shapes[i].checkDone();
    shapes[i].display();
    
    if (shapes[i].done == true) {
      shapes[i].removeBox();
      shapes.splice(i, 1);
    }
  }
  
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      hexagons[i][j].update();
      hexagons[i][j].display();
    }
  }
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    let newShape;
    let shapeType = shapeTypes[currentShapeIndex];
    if (shapeType === 'rectangle') {
      newShape = new Rect(mouseX, mouseY, shapeSize, shapeSize);
    } else if (shapeType === 'circle') {
      newShape = new Circle(mouseX, mouseY, shapeSize / 2);
    } else if (shapeType === 'triangle') {
      newShape = new Triangle(mouseX, mouseY, shapeSize);
    }
    shapes.push(newShape);
  }
}

function keyPressed() {
  if (key === ' ') {
    reset();
  } else if (key === 's') {
    currentShapeIndex = (currentShapeIndex + 1) % shapeTypes.length;
  }
}