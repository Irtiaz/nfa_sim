class Vertex {
  
  constructor(name, x, y) {
    this.name = name;
    this.transitions = [];
    
    this.edgesList = [];
    
    this.position = createVector(x, y);
    
    this.isAccepting = false;
    this.isActive = false;
    
    this.radius = 20;
  }
  
  display() {
    stroke(255);
    textAlign(CENTER, CENTER);
    
    
    if (!this.isActive) fill(this.mouseOn()? 255 : 150);
    else {
      if (!this.isAccepting) fill(200, 73, 52, this.mouseOn()? 255 : 150);
      else fill(184, 187, 38, this.mouseOn()? 255 : 150);
    }
    
    circle(this.position.x, this.position.y, this.radius * 2);
    
    if (this.isAccepting) {
      noFill();
      stroke(100);
      strokeWeight(2);
      circle(this.position.x, this.position.y, this.radius * 2 - 5);
      strokeWeight(1);
    }
    
    fill(0);
    stroke(0);
    textSize(20);
    text(this.name, this.position.x, this.position.y);
    
    
    for (let {symbols, endVertex} of this.edgesList) {
      
      symbols = symbols.map(e => e == '$'? 'ε' : e);
      
      const p1 = this.position;
      const p2 = endVertex.position;
      
      if (p1.x == p2.x && p1.y == p2.y) {
        fill(255);
        stroke(0);
        textSize(15);
        text(symbols.join(','), this.position.x, this.position.y - this.radius * 1.5);
        
        continue;
      }
      
      const distance = p5.Vector.dist(p1, p2);
      
      const endCoordinate = distance - this.radius;
      
      const direction = p5.Vector.sub(p2, p1);
      const angle = direction.heading();
      
      const arrowBack = 10;
      const arrowSpan = 10;
      
      push();
      translate(this.position.x, this.position.y);
      rotate(angle);
      
      stroke(255, 100);
      line(this.radius, 0, endCoordinate, 0);
      line(endCoordinate, 0, endCoordinate - arrowBack, arrowSpan);
      line(endCoordinate, 0, endCoordinate - arrowBack, -arrowSpan);
      
      fill(255);
      stroke(0);
      textSize(15);
      text(symbols.join(','), distance / 2, 15);
      
      pop();
    }
  }
  
  
  mouseOn() {
    return sq(mouseX - this.position.x) + sq(mouseY - this.position.y) < sq(this.radius);
  }
  
  
  
  equivalentStates() {
    let arr = [this];
    let i = 0;
    while (i < arr.length) {
      let v = arr[i];
      if (v.transitions['$']) arr = arr.concat(v.transitions['$']);
      ++i;
    }
    return [...new Set(arr)];
  }

  
  
  
  
  
  
  
  
}