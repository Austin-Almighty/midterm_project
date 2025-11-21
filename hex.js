class Hex {
    constructor(x, y, type, lineColor, i, j) {
      this.pos = createVector(x, y);
      this.type = type;
      this.lineColor = lineColor;
      this.gridI = i;
      this.gridJ = j;
      this.connections = [];
      switch(this.type) {
        case 'A':
          this.connections.push([1, 4]);
          break;
        case 'B':
          this.connections.push([0, 5]);
          this.connections.push([1, 2]);
          this.connections.push([3, 4]);
          break;
        case 'C':
          this.connections.push([1, 4]);
          break;
        case 'D':
          this.connections.push([0, 5]);
          break;
      }
      
      this.corners = []; 
      this.midpoints = [];
      for (let i=0; i<sides; i++) {
        let angle = TWO_PI/sides * i;
        let x = hexR * cos(angle);
        let y = hexR * sin(angle);
        this.corners.push(createVector(x, y));
      }
  
      for (let i=0; i<this.corners.length; i++) {
        let c1 = this.corners[i];
        let c2 = this.corners[(i+1) % sides];
        let mid = p5.Vector.lerp(c1, c2, 0.5);
        this.midpoints.push(mid);
      }
      
      this.currentAngle = 0;
      this.startAngle = 0;
      this.endAngle = 0; 
      this.baseAngle = 0;
      this.progress = 0;
      
      this.speed = 0.05;
      this.isRotating = false;
      
      this.polygons = [];
      this.getPolygonBodies();
      
      // Find 6 centroids of the 6 polygons 
      this.bodies = [];
      this.centroids = [];
      for (let i=0; i<this.polygons.length; i++) {
        let c = centroid(this.polygons[i]);
        this.centroids.push(c);
        let body = this.makeMatterBody(this.polygons[i], c);
        this.bodies.push(body);
      }
    }
    
    makeMatterBody(polygonVerts, centroid) {
      // Convert relative to centroid
      let vertexSet = [];
      for (let i=0; i<polygonVerts.length; i++) {
        let x = polygonVerts[i].x - centroid.x;
        let y = polygonVerts[i].y - centroid.y; 
        vertexSet.push({x: x, y: y});
      }
      
      // Find centroid location on the canvas map
      let r = dist(0, 0, centroid.x, centroid.y);
      let alpha = atan2(centroid.y, centroid.x);
      let newAngle = this.currentAngle + alpha;
      
      let rx = r * cos(newAngle);
      let ry = r * sin(newAngle);
      
      let canvasX = this.pos.x + rx;
      let canvasY = this.pos.y + ry;
      
      let body = Bodies.fromVertices(canvasX, canvasY, [vertexSet], {isStatic: true, label: 'tile'}, true);
      
      if (body) {
        Body.setAngle(body, this.currentAngle);
        Composite.add(engine.world, body);
      } else {
        console.warn("Failed to create body for tile type " + this.type);
      }
      
      return body;
    }


    
    startRotation() {
      if (!this.isRotating) {
        this.isRotating = true;
        this.currentAngle = this.baseAngle;
        this.endAngle = this.baseAngle + PI/3;
      }
    }
    
    update() {
      if (this.isRotating) {
        this.currentAngle += this.speed;
        if (this.currentAngle >= this.endAngle) {
          this.isRotating = false; 
          this.currentAngle = this.endAngle;
          this.baseAngle = this.endAngle;
        }
      } else {
        this.currentAngle = this.baseAngle;
      }
      
      for (let i=0; i<this.polygons.length; i++) {
        let r = dist(0, 0, this.centroids[i].x, this.centroids[i].y);
        let alpha = atan2(this.centroids[i].y, this.centroids[i].x);
        let newAngle = this.currentAngle + alpha;
  
        let rx = r * cos(newAngle);
        let ry = r * sin(newAngle);
  
        let canvasX = this.pos.x + rx;
        let canvasY = this.pos.y + ry;
        
        Body.setPosition(this.bodies[i], {x: canvasX, y: canvasY});
        Body.setAngle(this.bodies[i], this.currentAngle);
      }
      
    }
    
    addPair(pair) {
      for (let i=0; i<pair.length; i++) {
        this.polygons.push(pair[i]);
      }
    }
    
    getPolygonBodies() {
      let smallArcLength = TWO_PI/3;
      let bigArcLength = PI/3;
      
      switch (this.type) {
        case 'A' :
          this.addPair(getRectPair(this.midpoints[1], this.midpoints[4], distFromCenter, thickness)); 
          this.addPair(getStraightArcPair(this.corners[0].x, this.corners[0].y, arcD/2, distFromCenter, thickness, TWO_PI/3, TWO_PI/3 + smallArcLength));
          this.addPair(getStraightArcPair(this.corners[3].x, this.corners[3].y, arcD/2, distFromCenter, thickness, -PI/3, -PI/3 + smallArcLength)); 
          break;
          
        case 'B':
          this.addPair(getStraightArcPair(this.corners[0].x, this.corners[0].y, arcD/2, distFromCenter, thickness, TWO_PI/3, TWO_PI/3 + smallArcLength));
          this.addPair(getStraightArcPair(this.corners[2].x, this.corners[2].y, arcD/2, distFromCenter, thickness, 4*PI/3, 4*PI/3 + smallArcLength));
          this.addPair(getStraightArcPair(this.corners[4].x, this.corners[4].y, arcD/2, distFromCenter, thickness, 0, smallArcLength));
          break;
  
        case 'C':
          this.addPair(getRectPair(this.midpoints[1], this.midpoints[4], distFromCenter, thickness));
          this.addPair(getStraightArcPair(0, h, 3*arcD/2, distFromCenter, thickness, 4*PI/3, 4*PI/3 + bigArcLength));
          this.addPair(getStraightArcPair(0, -h, 3*arcD/2, distFromCenter, thickness, PI/3, PI/3 + bigArcLength));
          break;
  
        case 'D':
          this.addPair(getStraightArcPair(this.corners[0].x, this.corners[0].y, arcD/2, distFromCenter, thickness, TWO_PI/3, TWO_PI/3 + smallArcLength));
          this.addPair(getStraightArcPair(-1.5*hexR, h/2, 3*arcD/2, distFromCenter, thickness, -PI/3, -PI/3 + bigArcLength));
          this.addPair(getStraightArcPair(-1.5*hexR, -h/2, 3*arcD/2, distFromCenter, thickness, 0, bigArcLength));
          break;
      }
      
      
    }
    
    display() {
      strokeWeight(2);
      push();
      translate(this.pos.x, this.pos.y);
      rotate(this.currentAngle);
      this.drawHexagon();
      this.drawBuildings();
      this.drawPattern();
      this.drawRoadMarkings();
      pop();
    }

    drawBuildings() {
      // Draw simple building footprints in the negative space
      // Just drawing a few rects in the center or corners based on type
      fill(30, 30, 40); // Dark building color
      noStroke();
      
      // Simple heuristic: Draw a central block if it's not crossed by a center line
      if (this.type === 'B' || this.type === 'D') {
        rect(0, 0, hexR * 0.5, hexR * 0.5);
      }
      
      // Draw smaller blocks in corners
      for(let i=0; i<6; i+=2) {
         let v = this.corners[i].copy().mult(0.6);
         rect(v.x, v.y, hexR * 0.2, hexR * 0.2);
      }
    }
    
    drawPattern() {
      let smallArcLength = TWO_PI/3;
      let bigArcLength = PI/3;
      
      fill(50); // Dark Asphalt
      noStroke();
      for (let i=0; i<this.polygons.length; i++) {
        beginShape();
        for (let j=0; j<this.polygons[i].length; j++) {
          vertex(this.polygons[i][j].x, this.polygons[i][j].y);
        }
        endShape(CLOSE);
      }
      
   
    }

    drawRoadMarkings() {
      stroke(255, 204, 0); // Yellow markings
      strokeWeight(2);
      drawingContext.setLineDash([5, 5]); // Dashed line
      noFill();
      
      let smallArcLength = TWO_PI/3;
      let bigArcLength = PI/3;

      switch (this.type) {
        case 'A':
          this.drawDashedLine(this.midpoints[1], this.midpoints[4]);
          this.drawStraightDashedArc(this.corners[0].x, this.corners[0].y, arcD/2, TWO_PI/3, TWO_PI/3 + smallArcLength);
          this.drawStraightDashedArc(this.corners[3].x, this.corners[3].y, arcD/2, -PI/3, -PI/3 + smallArcLength);
          break;
        case 'B':
          this.drawStraightDashedArc(this.corners[0].x, this.corners[0].y, arcD/2, TWO_PI/3, TWO_PI/3 + smallArcLength);
          this.drawStraightDashedArc(this.corners[2].x, this.corners[2].y, arcD/2, 4*PI/3, 4*PI/3 + smallArcLength);
          this.drawStraightDashedArc(this.corners[4].x, this.corners[4].y, arcD/2, 0, smallArcLength);
          break;
        case 'C':
          this.drawDashedLine(this.midpoints[1], this.midpoints[4]);
          this.drawStraightDashedArc(0, h, 3*arcD/2, 4*PI/3, 4*PI/3 + bigArcLength);
          this.drawStraightDashedArc(0, -h, 3*arcD/2, PI/3, PI/3 + bigArcLength);
          break;
        case 'D':
          this.drawStraightDashedArc(this.corners[0].x, this.corners[0].y, arcD/2, TWO_PI/3, TWO_PI/3 + smallArcLength);
          this.drawStraightDashedArc(-1.5*hexR, h/2, 3*arcD/2, -PI/3, -PI/3 + bigArcLength);
          this.drawStraightDashedArc(-1.5*hexR, -h/2, 3*arcD/2, 0, bigArcLength);
          break;
      }
      
      drawingContext.setLineDash([]); // Reset dash
    }

    drawDashedLine(p1, p2) {
      line(p1.x, p1.y, p2.x, p2.y);
    }

    drawStraightDashedArc(cx, cy, r, startAng, endAng) {
       // Calculate start and end points of the "arc"
       let R = r + distFromCenter;
       let x1 = cx + R * cos(startAng);
       let y1 = cy + R * sin(startAng);
       let x2 = cx + R * cos(endAng);
       let y2 = cy + R * sin(endAng);
       line(x1, y1, x2, y2);
    }
  
    drawHexagon() {
      noFill();
      stroke(255);
      beginShape();
      for (let i=0; i<this.corners.length; i++) {
        vertex(this.corners[i].x, this.corners[i].y);
      }
      endShape(CLOSE);
    }
  
  }
  
  // Utility functions
  function getRect(p1, p2, distFromCenter, thickness) {
    let dir = p5.Vector.sub(p2, p1);
    dir.normalize();
    let perp = dir.copy();
    perp.rotate(HALF_PI);
    
    let outerEdge = perp.copy().mult(distFromCenter + thickness/2);
    let innerEdge = perp.copy().mult(distFromCenter - thickness/2);
    
    let p2o = p5.Vector.add(p2, outerEdge);
    let p1o = p5.Vector.add(p1, outerEdge);
    let p1i = p5.Vector.add(p1, innerEdge);
    let p2i = p5.Vector.add(p2, innerEdge);
    
    return [p2o, p1o, p1i, p2i];
  }
  
  function getRectPair(p1, p2, distFromCenter, thickness) {
    let leftPair = getRect(p1, p2, -distFromCenter, thickness);
    let rightPair = getRect(p1, p2, distFromCenter, thickness);
    
    return [leftPair, rightPair];
  }
  
  function getArc(cx, cy, centerR, distFromCenter, thickness, startAng, endAng, step) {
    
    if (step === undefined) {
      step = PI/24;
    }
    
    if (startAng > endAng) {
      endAng += TWO_PI;
    }
    
    let R = centerR + distFromCenter;
    let Ro = R + thickness/2;
    let Ri = R - thickness/2;
    
    let outer = [];
    let inner = [];
    
    for (let a=startAng; a<endAng + 0.0001; a+=step) {
      let currentA;
      if (a >= endAng) {
        currentA = endAng;
      } else {
        currentA = a;
      }
      
      let x = cx + Ro * cos(currentA);
      let y = cy + Ro * sin(currentA);
      outer.push({x:x, y:y});
    }
    
    for (let a=endAng; a>startAng - 0.0001; a-=step) {
      let currentA;
      if (a <= startAng) {
        currentA = startAng;
      } else {
        currentA = a;
      }
      
      let x = cx + Ri * cos(currentA);
      let y = cy + Ri * sin(currentA);
      inner.push({x:x, y:y});
    }
    
    let combinedPts = [];
    for (let i=0; i<outer.length; i++) {
      combinedPts.push(outer[i]);
    }
    for (let i=0; i<inner.length; i++) {
      combinedPts.push(inner[i]);
    }
    
    return combinedPts;
    
  }
  
  function getStraightArcPair(cx, cy, centerR, distFromCenter, thickness, startAng, endAng) {
     // Calculate start and end points of the "arc"
     let R = centerR + distFromCenter;
     let x1 = cx + R * cos(startAng);
     let y1 = cy + R * sin(startAng);
     let x2 = cx + R * cos(endAng);
     let y2 = cy + R * sin(endAng);
     
     let p1 = createVector(x1, y1);
     let p2 = createVector(x2, y2);
     
     return getRectPair(p1, p2, 0, thickness); // 0 distFromCenter because we already calculated the offset points
  }
  
  function centroid(polygon) {
    let A = 0, cx = 0, cy = 0;
    for (let i = 0, n = polygon.length; i < n; i++) {
      const x1 = polygon[i].x;      
      const y1 = polygon[i].y;      
      const x2 = polygon[(i+1)%n].x; 
      const y2 = polygon[(i+1)%n].y; 
      const crss = x1*y2 - x2*y1;
      A += crss;
      cx += (x1 + x2) * crss;
      cy += (y1 + y2) * crss;
    }
    if (Math.abs(A) < 1e-6) { 
      let sx = 0, sy = 0;
      for (let i = 0; i < polygon.length; i++) {
        sx += polygon[i].x;  
        sy += polygon[i].y;  
      }
      return {x: sx/polygon.length, y: sy/polygon.length};
    }
    A *= 0.5;
    return { x: cx/(6*A), y: cy/(6*A) };
  }
  
  
  
  
  
  
  