class Event {
  
  
  constructor(startState, endState, isFirstLevel) {
    const startPosition = startState.position;
    const endPosition = endState.position;
    
    this.travelDistance = p5.Vector.dist(startPosition, endPosition);
    
    this.distIncrement = this.travelDistance * animationIncrement;
    
    this.travelVector = p5.Vector.sub(endPosition, startPosition);
    this.travelVector.setMag(this.distIncrement);
    
    this.currentPosition = startPosition.copy();
    this.currentDistance = 0;
    
    this.isDone = false;
    this.isFirstLevel = isFirstLevel;
    
    this.startState = startState;
    this.endState = endState;
  }
  
  
  update() {
    this.currentPosition.add(this.travelVector);
    this.currentDistance += this.distIncrement;
    
    if (this.isFirstLevel) this.startState.isActive = false;
    
    if (this.currentDistance >= this.travelDistance) {
      this.currentPosition = this.endState.position.copy();
      this.currentDistane = this.travelDistance;
      this.isDone = true;
      
      this.endState.isActive = true;
    }
    
  }
  
  
  render() {
    fill(255, 200);
    noStroke();
    circle(this.currentPosition.x, this.currentPosition.y, 16);
  }
  
  
  getNextLevelEvents() {
    let events = [];
    
    const nextStates = this.endState.transitions['$'];
    if (nextStates) {
      for (let state of nextStates) {
        events.push(new Event(this.endState, state, false));
      }
    }
    
    return events;
  }
  
  
}

