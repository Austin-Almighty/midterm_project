# Hexagonal Truchet Tiling with Physics

This project is an interactive physics-based artwork built with p5.js and the Matter.js physics engine. It features a dynamic environment where falling objects interact with a rotating grid of hexagonal tiles.

## How it Works

The core of the project is a hexagonal grid of Truchet tiles, but with a twist: the patterns on the tiles are physical objects.

### The Physics-Enabled Grid

The `sketch.js` file initializes a Matter.js physics world. The hexagonal grid is created, and each tile's pattern is converted into a set of static Matter.js bodies. This means the patterns themselves become solid obstacles in the physics simulation. The tiles randomly rotate, which also updates the position and orientation of the physical patterns, creating a constantly changing environment.

### User Interaction

The user can interact with the simulation by clicking on the canvas. Each click creates a new, small, spinning rectangle. This rectangle is a dynamic Matter.js body, so it is affected by gravity and will tumble down the screen, bouncing and colliding with the intricate shapes of the hexagonal tile patterns.

### The Components

*   **`hex.js`:** Defines the `Hex` class. This class is responsible for creating the hexagonal tiles, generating the geometry for the patterns, and converting those patterns into static Matter.js bodies.
*   **`rect.js`:** Defines the `Rect` class for the falling rectangles. It creates a dynamic Matter.js body for each rectangle and handles its drawing and removal.
*   **`sketch.js`:** The main file that sets up the p5.js canvas and the Matter.js engine. It manages the grid of hexagons and the array of falling rectangles, and it updates the physics simulation in each frame.

## Technologies Used

*   **p5.js:** A JavaScript library for creative coding, used for drawing and animation.
*   **Matter.js:** A 2D rigid body physics engine for the web.
*   **poly-decomp.js:** A library required by Matter.js to handle complex, concave polygons.

## How to Run

Open the `index.html` file in a web browser. Click on the canvas to drop new rectangles and watch them interact with the rotating tile patterns.