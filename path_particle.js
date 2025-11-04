class PathParticle {
    constructor(path, lifespan) {
      this.path = path;
      this.currentSegmentIndex = 0;
      this.progress = 0;
      this.speed = 0.05;
      this.pos = createVector(0, 0);
      this.lifespan = lifespan;
    }

    update() {
      if (this.currentSegmentIndex >= this.path.length) {
        this.lifespan -= 5; // Start decreasing lifespan after path is completed
        return;
      }

      this.progress += this.speed;
      if (this.progress >= 1) {
        this.progress = 0;
        this.currentSegmentIndex++;
      }

      if (this.currentSegmentIndex < this.path.length) {
        let segment = this.path[this.currentSegmentIndex];
        if (segment.type === 'line') {
          this.pos = p5.Vector.lerp(segment.startPoint, segment.endPoint, this.progress);
        } else if (segment.type === 'arc') {
          let angle = lerp(segment.startAngle, segment.endAngle, this.progress);
          this.pos.x = segment.center.x + segment.radius * cos(angle);
          this.pos.y = segment.center.y + segment.radius * sin(angle);
        }
      }
    }

    display() {
      fill(0, 0, 100, this.lifespan / 255 * 100);
      noStroke();
      ellipse(this.pos.x, this.pos.y, 8);
    }

    isDone() {
      return this.lifespan < 0;
    }
  }