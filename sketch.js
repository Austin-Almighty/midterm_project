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
const {Engine, Body, Bodies, Composite, Events} = Matter;
let engine;
let shapes = []; 
let shapeSize = 10;
let particles = [];

let shapeTypes = ['rectangle', 'circle', 'triangle'];
let currentShapeIndex = 0;

let backgroundColor, tileLineColor;

let electricityPath = [];
let electricityLifespan = 0;

let gravityStates = ['normal', 'reversed', 'strong'];
let currentGravityIndex = 0;

function setup() {
  createCanvas(800, 600);
  rectMode(CENTER);
  colorMode(HSB, 360, 100, 100);
  engine = Engine.create();
  
  h = Math.sqrt(3) * hexR;
  w = 2 * hexR;
  stepX = 1.5 * hexR;
  stepY = h;

  cols = floor((width + hexR) / stepX) + 1;
  rows = floor((height + h/2) / stepY) + 1;
  
  updateColors();
  createGrid();

  Events.on(engine, 'collisionStart', function(event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      let bodyA = pair.bodyA;
      let bodyB = pair.bodyB;

      if ((bodyA.label === 'shape' && bodyB.label === 'tile') || (bodyA.label === 'tile' && bodyB.label === 'shape')) {
        for (let j = 0; j < 5; j++) {
          let p = new Particle(pair.collision.supports[0].x, pair.collision.supports[0].y);
          particles.push(p);
        }
      }
    }
  });
}

function updateColors() {
  let hue = random(360);
  backgroundColor = color(hue, 50, 30);
  tileLineColor = color((hue + 180) % 360, 50, 90);
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
      const hexagon = new Hex(canvasX, canvasY, type, tileLineColor, i, j);
      hexagons[i][j] = hexagon;
    }
  }
}

function reset() {
  for (let i = shapes.length - 1; i >= 0; i--) {
    shapes[i].removeBox();
    shapes.splice(i, 1);
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles.splice(i, 1);
  }
  Composite.clear(engine.world, false);
  updateColors();
  createGrid();
}

function draw() {
  background(backgroundColor);
  Engine.update(engine);
  
  if (random()<0.1) {
    let x = floor(random(0, cols));
    let y = floor(random(0, rows));
    hexagons[x][y].startRotation();
  }

  if (frameCount % 90 === 0) {
    findElectricityPath();
  }

  if (electricityLifespan > 0) {
    drawElectricity();
    electricityLifespan--;
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

  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDone()) {
      particles.splice(i, 1);
    }
  }

  // Display gravity status
  push(); // Isolate drawing state
  textSize(16);
  let gravityText = 'Gravity: ' + gravityStates[currentGravityIndex];
  let textW = textWidth(gravityText);
  let textH = 20;
  let padding = 5;

  rectMode(CORNER);
  noStroke();
  fill(0, 0, 0, 50); // Dark background with some transparency
  rect(10, 10, textW + padding * 2, textH + padding * 2);

  fill(0, 0, 100); // White text
  textAlign(LEFT, TOP);
  text(gravityText, 10 + padding, 10 + padding);
  pop(); // Restore original drawing state
}

function findElectricityPath() {
  electricityPath = [];
  let startI = floor(random(cols));
  let startJ = floor(random(rows));
  let startHex = hexagons[startI][startJ];
  
  let visited = new Set();
  visited.add(`${startI},${startJ}`);

  let currentHex = startHex;
  let pathLength = 0;

  while (pathLength < 10) {
    let neighbors = getNeighbors(currentHex.gridI, currentHex.gridJ);
    let connectedNeighbors = [];

    let currentAngle = round(currentHex.baseAngle / (PI/3)) % sides;

    for (let connection of currentHex.connections) {
      for (let side of connection) {
        let rotatedSide = (side + currentAngle + sides) % sides;
        let neighborInfo = neighbors[rotatedSide];
        if (neighborInfo) {
          let ni = neighborInfo.i;
          let nj = neighborInfo.j;
          if (ni >= 0 && ni < cols && nj >= 0 && nj < rows && !visited.has(`${ni},${nj}`)) {
            let neighbor = hexagons[ni][nj];
            let neighborAngle = round(neighbor.baseAngle / (PI/3)) % sides;
            let oppositeSide = (rotatedSide + 3) % sides;

            for (let neighborConnection of neighbor.connections) {
              for (let neighborSide of neighborConnection) {
                let rotatedNeighborSide = (neighborSide + neighborAngle + sides) % sides;
                if (rotatedNeighborSide === oppositeSide) {
                  connectedNeighbors.push({hex: neighbor, from: rotatedSide, to: oppositeSide});
                }
              }
            }
          }
        }
      }
    }

    if (connectedNeighbors.length > 0) {
      let next = random(connectedNeighbors);
      electricityPath.push({from: currentHex, to: next.hex});
      currentHex = next.hex;
      visited.add(`${currentHex.gridI},${currentHex.gridJ}`);
      pathLength++;
    } else {
      break;
    }
  }

  electricityLifespan = 30;
}

function drawElectricity() {
  for (let segment of electricityPath) {
    let p1 = segment.from.pos;
    let p2 = segment.to.pos;
    drawLightning(p1, p2);
  }
}

function drawLightning(p1, p2) {
  let d = dist(p1.x, p1.y, p2.x, p2.y);
  let from = createVector(p1.x, p1.y);
  let to = createVector(p2.x, p2.y);
  let direction = p5.Vector.sub(to, from);
  direction.normalize();
  let perpendicular = createVector(-direction.y, direction.x);

  let lightning = [];
  lightning.push(from);

  let segments = 10;
  for (let i = 1; i < segments; i++) {
    let pos = p5.Vector.lerp(from, to, i / segments);
    let offset = perpendicular.copy().mult(random(-10, 10));
    pos.add(offset);
    lightning.push(pos);
  }

  lightning.push(to);

  noFill();
  stroke(0, 0, 100, electricityLifespan / 30 * 100);
  strokeWeight(random(1, 4));
  beginShape();
  for (let pos of lightning) {
    vertex(pos.x, pos.y);
  }
  endShape();
}

function getNeighbors(i, j) {
  if (i % 2 === 0) {
    return [
      {i: i, j: j - 1}, {i: i + 1, j: j - 1}, {i: i + 1, j: j},
      {i: i, j: j + 1}, {i: i - 1, j: j}, {i: i - 1, j: j - 1}
    ];
  } else {
    return [
      {i: i, j: j - 1}, {i: i + 1, j: j}, {i: i + 1, j: j + 1},
      {i: i, j: j + 1}, {i: i - 1, j: j + 1}, {i: i - 1, j: j}
    ];
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
  } else if (key === 'g') {
    currentGravityIndex = (currentGravityIndex + 1) % gravityStates.length;
    let gravityState = gravityStates[currentGravityIndex];
    if (gravityState === 'normal') {
      engine.world.gravity.y = 1;
    } else if (gravityState === 'reversed') {
      engine.world.gravity.y = -1;
    } else if (gravityState === 'strong') {
      engine.world.gravity.y = 2;
    }
  }
}