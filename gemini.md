# Interactive Physics-Based Art Project

This document provides a technical overview of the interactive art project created with p5.js and Matter.js.

## Core Concepts

The project is a dynamic, interactive physics simulation featuring a hexagonal grid of Truchet tiles. Users can introduce various shapes into the environment, which then interact with the physical patterns on the tiles. The project also includes several visual and interactive effects to create an engaging experience.

## Features

*   **Physics-Based World:** Utilizes the Matter.js engine to create a 2D physics simulation.
*   **Hexagonal Truchet Tiles:** The environment is a grid of hexagonal tiles, each with a physical pattern based on the Truchet tiling system.
*   **Droppable Shapes:** Users can drop rectangles, circles, and triangles into the simulation.
*   **Dynamic Colors:** The background and tile colors change to a new random complementary pair on every reset.
*   **Collision Sparks:** A burst of particles is generated at the point of collision between a shape and a tile.
*   **Electricity Effect:** A random, flashing electricity effect traces a path along the connected tile patterns.
*   **Gravity Manipulation:** Users can cycle through normal, reversed, and strong gravity.
*   **Wind Control:** Users can apply a continuous horizontal and vertical wind force to the falling shapes.

## How it Works

### Grid and Tile Generation

The hexagonal grid is generated in `sketch.js`. The `Hex` class in `hex.js` is responsible for creating the geometry of the tile patterns and converting them into static Matter.js bodies. Each body is labeled as a 'tile' for collision detection purposes.

### Shape Creation

The `rect.js`, `circle.js`, and `triangle.js` files define classes for the droppable shapes. Each class creates a dynamic Matter.js body with a label of 'shape'.

### Interaction and Effects

*   **Collision Handling:** `sketch.js` listens for `collisionStart` events from the Matter.js engine. When a 'shape' and a 'tile' collide, it triggers the creation of `Particle` objects (from `particle.js`) to create the spark effect.
*   **Electricity:** A pathfinding algorithm in `sketch.js` periodically finds a random connected path through the tile grid. A `drawLightning` function then renders a jagged, flickering line along this path.
*   **User Input:** The `keyPressed()` function in `sketch.js` handles shape switching, gravity changes, and resetting the simulation. The `handleWind()` function in the `draw()` loop continuously checks for arrow key presses to apply the wind force.

## Technologies Used

*   **p5.js:** For drawing, animation, and user interaction.
*   **Matter.js:** For the 2D physics simulation.
*   **poly-decomp.js:** A dependency for Matter.js to handle complex polygons.
