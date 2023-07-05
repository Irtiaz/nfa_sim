class EventManager {
  
  constructor(actives, symbol) {
    
    this.events = [];
    
    for (let active of actives) {
      
      const nextStates = active.transitions[symbol];
      
      if (nextStates) {
        
        for (let state of nextStates) {
          const e = new Event(active, state, true);
          if (!containsEvent(this.events, e)) this.events.push(e);
        }
        
      }
      
      else active.isActive = false;
      
    }
    
    this.isDone = this.events.length == 0;
  }
  
  update() {
    let levelDone = true;
    
    let nextActives = [];
    
    for (let event of this.events) {
      event.update();
      levelDone &= event.isDone;
      
      if (event.isDone) nextActives.push(event.endState);
      
    }
    
    
    for (let state of nextActives) {
      state.isActive = true;
    }
    
    
    if (levelDone) {
      let temp = [];
      
      for (let event of this.events) {
        const nextEv = event.getNextLevelEvents();
        for (let e of nextEv) {
          if (!containsEvent(temp, e)) temp.push(e);
        }
      }
      
      this.events = temp;
      
      if (this.events.length == 0) this.isDone = true;
    }
    
  }
  
  
  render() {
    for (let event of this.events) {
      if (!event.isDone) event.render();
    }
  }
  
  
}


function containsEvent(arr, event) {
  for (let e of arr) {
    if (sameEvent(e, event)) return true;
  }
  return false;
}



function sameEvent(event1, event2) {
  return event1.startState == event2.startState && event1.endState == event2.endState;
}
