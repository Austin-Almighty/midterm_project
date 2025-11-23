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

let shapeTypes = ['garbage_can', 'cone', 'tire', 'pizza', 'boot'];

let currentShapeIndex = 0;



let backgroundColor, tileLineColor;



let gravityStates = ['normal', 'reversed', 'strong'];

let currentGravityIndex = 0;



function setup() {

  createCanvas(1200, 900);

  rectMode(CENTER);

  colorMode(HSB, 360, 100, 100);

  engine = Engine.create();

  

  h = Math.sqrt(3) * hexR;

  stepX = 1.5 * hexR;

  stepY = h;



  cols = floor((width + hexR) / stepX) + 1;

  rows = floor((height + h/2) / stepY) + 1;

  

  updateColors();

  createGrid();



  Events.on(engine, 'collisionStart', function(event) {

    if (particles.length > 500) return;

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
  // City Night Theme
  backgroundColor = color(230, 40, 15); // Dark Blue (HSB)
  tileLineColor = color(0, 0, 100); // White (unused for road surface but kept for reference)
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

  try {
    background(backgroundColor);

    Engine.update(engine);

    handleWind();

    spawnShape();

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

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();
      if (particles[i].isDone()) {
        particles.splice(i, 1);
      }
    }

    // Display gravity status - REMOVED FOR EXHIBITION
    /*
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
    */

  } catch (e) {
    console.error(e);
    background(255, 0, 0);
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text("Error: " + e.message, 20, 20);
    text("Stack: " + e.stack, 20, 50);
    noLoop();
  }

}



function handleWind() {

  let windForce = createVector(0, 0);

  if (keyIsDown(LEFT_ARROW)) {

    windForce.x = -0.001;

  } else if (keyIsDown(RIGHT_ARROW)) {

    windForce.x = 0.001;

  }



  if (keyIsDown(UP_ARROW)) {

    windForce.y = -0.001;

  } else if (keyIsDown(DOWN_ARROW)) {

    windForce.y = 0.001;

  }



  for (let shape of shapes) {

    Body.applyForce(shape.body, shape.body.position, windForce);

  }

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



function spawnShape() {

  if (frameCount % 40 == 0) {

    let newShape;

    let shapeType = random(shapeTypes);

    let x = random(width);

    if (shapeType === 'garbage_can') {

      newShape = new GarbageCan(x, -50, shapeSize, shapeSize);

    } else if (shapeType === 'building') {

      newShape = new Building(x, -50, shapeSize, shapeSize);

    } else if (shapeType === 'cone') {

      newShape = new TrafficCone(x, -50, shapeSize);

    } else if (shapeType === 'tire') {

      newShape = new Tire(x, -50, shapeSize / 2);

    } else if (shapeType === 'pizza') {

      newShape = new PizzaSlice(x, -50, shapeSize);

    } else if (shapeType === 'boot') {

      newShape = new OldBoot(x, -50, shapeSize);

    }

    shapes.push(newShape);

  }

}



function keyPressed() {

  if (key === ' ') {

    reset();

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


