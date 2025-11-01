const gridCols = 8;
const gridRows = 6;
let grid = [];

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  const bauhausColors = [
    color(255, 240, 150), // Pastel Yellow
    color(255, 150, 150), // Pastel Red
    color(150, 200, 255), // Pastel Blue
    color(180, 180, 180), // Light Gray
  ];

  const marginX = width * 0.15;
  const marginY = height * 0.15;
  const drawingWidth = width - 2 * marginX;
  const drawingHeight = height - 2 * marginY;

  let cellSize = Math.min(drawingWidth / gridCols, drawingHeight / gridRows);

  const gridWidth = gridCols * cellSize;
  const gridHeight = gridRows * cellSize;

  const offsetX = (width - gridWidth) / 2;
  const offsetY = (height - gridHeight) / 2;

  for (let i = 0; i < gridCols; i++) {
    grid[i] = [];
    for (let j = 0; j < gridRows; j++) {
      const x = offsetX + i * cellSize + cellSize / 2 - width / 2;
      const y = offsetY + j * cellSize + cellSize / 2 - height / 2;
      const colorIndex = (i + j) % bauhausColors.length;
      const cellColor = bauhausColors[colorIndex];
      grid[i][j] = new Block(x, y, cellSize, cellColor);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-initialize grid on resize to recalculate positions and sizes
  setup();
}

function draw() {
  background(240);
  
  // Lighting
  ambientLight(150);
  directionalLight(255, 255, 255, 0.5, 0.5, -1);

  for (let i = 0; i < gridCols; i++) {
    for (let j = 0; j < gridRows; j++) {
      // The mouse coordinates need to be adjusted for the WEBGL mode and the centered canvas
      grid[i][j].update(mouseX - width / 2, mouseY - height / 2);
      grid[i][j].draw();
    }
  }
}
