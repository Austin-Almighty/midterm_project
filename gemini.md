# Entropy City: Interactive Physics Art

This document provides a technical overview of "Entropy City," an interactive art project created with p5.js and Matter.js. The project simulates a chaotic urban environment where various city-themed objects interact with a rigid, rectilinear street grid.

## Core Concepts

The project transforms the classic Truchet tiling system into a dense urban map. Users introduce chaotic elements (trash, tires, traffic cones) into this orderly grid, creating a dynamic interplay between structure and entropy. The aesthetic is a "City Night" theme with a dark blue background, yellow road markings, and a skyline silhouette.

## Features

### Urban Environment
*   **Rectilinear Grid:** The hexagonal tiles now feature straight roads and sharp corners, simulating city blocks.
*   **Building Footprints:** Negative space in the tiles is filled with simple rectangular building shapes to create density.
*   **Skyline Background:** A procedurally generated city skyline adds depth to the scene.
*   **City Night Palette:** A curated color scheme featuring dark asphalt, yellow lane markings, and a deep blue night sky.

### Interactive Objects
Users can spawn a variety of urban debris and items:
*   **Garbage Can:** A rectangular container.
*   **Traffic Cone:** A triangular hazard marker.
*   **Tire:** A circular rolling object.
*   **Pizza Slice:** A triangular food item.
*   **Old Boot:** A complex polygon shape representing a discarded boot.

### Physics & Interaction
*   **Matter.js Simulation:** A robust 2D physics engine handles collisions, gravity, and forces.
*   **Gravity Control:** Users can cycle through normal, reversed, and strong gravity states.
*   **Wind Force:** Arrow keys apply horizontal and vertical wind forces to objects.
*   **Themed Particles:** Collisions generate spark particles that match the color of the colliding object.

### Exhibition Polish
*   **Framed Canvas:** A thick, dark frame with a drop shadow separates the art from the background.
*   **Clean Interface:** On-screen text instructions and status indicators have been removed for a more immersive experience.
*   **Large Format:** The canvas is sized at **1200x900** for high visual impact.

## Technical Implementation

### Grid Generation (`hex.js`)
The `Hex` class generates the city blocks. It uses `getStraightArcPair` to create linear paths instead of curves. It also implements `drawBuildings` to render building footprints in the non-road areas of the tile.

### Object Classes
Each interactive object has its own class file (e.g., `garbage_can.js`, `boot.js`) that defines its visual appearance and physical properties using `Matter.Bodies`.
*   **Complex Shapes:** The `OldBoot` class uses `Matter.Bodies.fromVertices` to create a custom physics body matching its visual shape.

### Main Logic (`sketch.js`)
*   **Setup:** Initializes the Matter.js engine, creates the grid, and sets up the "City Night" theme.
*   **Draw Loop:** Handles the physics update, rendering of all objects, and user input.
*   **Error Handling:** A global `try-catch` block prevents the simulation from freezing silently by displaying error messages on the canvas.

## Technologies Used
*   **p5.js:** Rendering and interaction.
*   **Matter.js:** Physics engine.
*   **poly-decomp.js:** Polygon decomposition for complex physics bodies.
