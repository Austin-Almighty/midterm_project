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
let boxes = []; 
let x = 100, y = 100, boxSize = 10;


function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
  engine = Engine.create();
  
  h = Math.sqrt(3) * hexR;
  w = 2 * hexR;
  stepX = 1.5 * hexR;
  stepY = h;

  cols = floor((width + hexR) / stepX) + 1;
  rows = floor((height + h/2) / stepY) + 1;
  
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

function draw() {
  background(0, 0, 100);
  Engine.update(engine);
  
  if (random()<0.1) {
    let x = floor(random(0, cols));
    let y = floor(random(0, rows));
    hexagons[x][y].startRotation();
  }
  
  for (let i=boxes.length-1; i>=0; i--) {
    boxes[i].checkDone();
    boxes[i].display();
    
    if (boxes[i].done == true) {
      boxes[i].removeBox();
      boxes.splice(i, 1);
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
  let newBox = new Rect(mouseX, mouseY, boxSize, boxSize);
  boxes.push(newBox);
}





