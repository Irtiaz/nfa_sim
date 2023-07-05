const animationIncrement = 0.03;

const vertices = [];

let holdingDownControl = false;
let edgeFromVertex = null;

let hasStarted = false;

let str = null;
let doneStr = null;

let activeVertices = [];

let eventManager = null;

function setup() {
  createCanvas(700, 700);
}

function draw() {
  background(51);

  const currentActives = getActiveStates();
  let hasAccepting = false;
  for (const v of currentActives) {
    if (v.isAccepting) {
      hasAccepting = true;
      break;
    }
  }

  if (str) {
    textAlign(RIGHT, TOP);
    textSize(32);
    fill(255);
    noStroke();
    text(str, width - 10, 10);
  }

  if (doneStr != null) {
    let displayStr = doneStr.length == 0 ? 'ε' : doneStr;

    textAlign(LEFT, TOP);
    textSize(32);
    if (hasAccepting) fill(184, 187, 38);
    else fill(200, 73, 52);
    noStroke();
    text(displayStr, 10, 10);
  }

  for (const vertex of vertices) {
    vertex.display();
  }

  if (eventManager && !eventManager.isDone) {
    eventManager.update();
    eventManager.render();
  }
}

function mousePressed() {
  if (hasStarted) return;

  if (mouseX <= 0 || mouseX >= width || mouseY <= 0 || mouseY >= height) return;

  if (!holdingDownControl) {
    for (let v of vertices) {
      if (v.mouseOn()) return;
    }

    vertices.push(new Vertex(`q${vertices.length}`, mouseX, mouseY));

    if (vertices.length == 1) {
      vertices[0].isActive = true;
    }
  } else {
    for (const vertex of vertices) {
      if (vertex.mouseOn()) {
        if (edgeFromVertex == null) edgeFromVertex = vertex;
        else {
          let symbols = prompt(
            'Symbols for transition (comma separated), $ means ε'
          );

          if (symbols) {
            symbols = symbols.split(',').map((e) => e.trim());

            for (const symbol of symbols) {
              if (edgeFromVertex.transitions[symbol])
                edgeFromVertex.transitions[symbol].push(vertex);
              else edgeFromVertex.transitions[symbol] = [vertex];
            }

            edgeFromVertex.edgesList.push({
              symbols,
              endVertex: vertex,
            });
          }

          edgeFromVertex = null;
          holdingDownControl = false;
        }

        break;
      }
    }
  }
}

function keyPressed() {
  if (eventManager && !eventManager.isDone) return;

  if (!hasStarted) {
    if (key == 'Control') holdingDownControl = true;
    else if (key == 'a') {
      for (const vertex of vertices) {
        if (vertex.mouseOn()) {
          vertex.isAccepting = !vertex.isAccepting;

          break;
        }
      }
    }
  }

  if (key == ' ') {
    if (!hasStarted) {
      str = prompt('Enter the string');
      doneStr = '';
      hasStarted = true;

      eventManager = new EventManager([vertices[0]], '$');
      vertices[0].isActive = true;
    } else if (str.length > 0) {
      eventManager = new EventManager(getActiveStates(), str[0]);

      doneStr += str[0];
      str = str.slice(1);
    }
  } else if (hasStarted && key == 'r') {
    str = prompt('Enter the string');
    doneStr = '';
    hasStarted = true;

    for (let v of vertices) v.isActive = false;
    vertices[0].isActive = true;

    eventManager = new EventManager([vertices[0]], '$');
    vertices[0].isActive = true;
  }
}

function keyReleased() {
  if (key == 'Control') {
    holdingDownControl = false;
    edgeFromVertex = null;
  }
}

function getActiveStates() {
  let active = [];
  for (let v of vertices) {
    if (v.isActive) active.push(v);
  }
  return active;
}
