let sunX;
let buildings = [];
let cloudX = 600;
let birds = [];
let cars = [];
let moonVisible = false;

function setup() {
  createCanvas(800, 400);
  sunX = 100;

  // Prédios
  buildings.push(new Building(450, 200, 80, 200));
  buildings.push(new Building(550, 150, 70, 250));
  buildings.push(new Building(650, 180, 60, 220));
  buildings.push(new Building(730, 230, 50, 170));

  // Pássaros no céu do campo
  for (let i = 0; i < 5; i++) {
    birds.push(new Bird(random(0, width / 2), random(50, 150)));
  }

  // Carros na rua da cidade
  for (let i = 0; i < 3; i++) {
    cars.push(new Car(width / 2 + random(0, width / 2), height * 0.85));
  }
}

function draw() {
  background(135, 206, 235); // Céu azul

  // Linha divisória
  stroke(0);
  line(width / 2, 0, width / 2, height);

  // Sol (segue mouse no eixo X, limitado ao campo)
  sunX = constrain(mouseX, 50, width / 2 - 50);
  drawSun(sunX, 80);

  // Mostrar lua quando sol estiver longe do campo (lado direito)
  moonVisible = sunX > width / 2 - 80;
  if (moonVisible) drawMoon(width - 100, 80);

  // Campo
  noStroke();
  // Sombra suave do campo
  fill(20, 100, 20);
  rect(0, height * 0.6 + 10, width / 2, height * 0.4 - 10);

  fill(34, 139, 34);
  rect(0, height * 0.6, width / 2, height * 0.4);

  // Rio sinuoso
  drawRiver();

  // Árvores com sombra
  drawTreeShadow(100, height * 0.6);
  drawTree(100, height * 0.6);
  drawTreeShadow(200, height * 0.65);
  drawTree(200, height * 0.65);
  drawTreeShadow(300, height * 0.6);
  drawTree(300, height * 0.6);

  // Pássaros animados
  for (let bird of birds) {
    bird.fly();
    bird.display();
  }

  // Cidade
  fill(60, 179, 113);
  rect(width / 2, height * 0.7, width / 2, height * 0.3);

  // Nuvem se movendo suavemente no céu da cidade
  drawCloud(cloudX, 80);
  cloudX += 0.5;
  if (cloudX > width) cloudX = width / 2;

  // Prédios com sombra
  for (let b of buildings) {
    b.displayShadow();
  }
  for (let b of buildings) {
    b.display();
  }

  // Carros animados na rua da cidade
  for (let car of cars) {
    car.move();
    car.display();
  }
}

function drawSun(x, y) {
  fill(255, 204, 0);
  noStroke();
  ellipse(x, y, 80, 80);
  for (let i = 0; i < 8; i++) {
    let angle = TWO_PI / 8 * i;
    let sx = x + cos(angle) * 50;
    let sy = y + sin(angle) * 50;
    line(x, y, sx, sy);
  }
}

function drawMoon(x, y) {
  fill(230, 230, 250);
  noStroke();
  ellipse(x, y, 70, 70);
  fill(135, 206, 235);
  ellipse(x + 20, y - 10, 50, 50);
}

function drawTree(x, y) {
  fill(101, 67, 33);
  rect(x - 10, y, 20, 40);
  fill(34, 139, 34);
  ellipse(x, y, 60, 60);
  ellipse(x - 20, y + 10, 50, 50);
  ellipse(x + 20, y + 10, 50, 50);
}

function drawTreeShadow(x, y) {
  fill(0, 50);
  noStroke();
  rect(x - 5, y + 40, 40, 15, 10);
}

function drawCloud(x, y) {
  fill(255);
  noStroke();
  ellipse(x, y, 50, 50);
  ellipse(x + 30, y + 10, 60, 40);
  ellipse(x - 30, y + 10, 60, 40);
}

function drawRiver() {
  noStroke();
  fill(30, 144, 255, 180);
  beginShape();
  vertex(0, height * 0.8);
  bezierVertex(width / 8, height * 0.7, width / 4, height * 0.9, width / 2, height * 0.75);
  vertex(width / 2, height);
  vertex(0, height);
  endShape(CLOSE);

  // Reflexo do sol no rio
  fill(255, 255, 150, 100);
  ellipse(sunX, height * 0.85, 50, 10);
}

// CLASSE PRÉDIO
class Building {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.rows = floor(h / 40);
    this.cols = floor(w / 20);

    this.windows = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(random() > 0.5);
      }
      this.windows.push(row);
    }
  }

  displayShadow() {
    fill(0, 50);
    noStroke();
    rect(this.x + 10, this.y + this.h, this.w, 20, 5);
  }

  display() {
    fill(169, 169, 169);
    rect(this.x, this.y, this.w, this.h);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.windows[i][j]) fill(255, 255, 102);
        else fill(50);
        rect(this.x + 5 + j * 20, this.y + 5 + i * 40, 10, 20);
      }
    }
  }

  toggleWindow(mx, my) {
    if (mx > this.x && mx < this.x + this.w && my > this.y && my < this.y + this.h) {
      let col = floor((mx - this.x - 5) / 20);
      let row = floor((my - this.y - 5) / 40);

      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.windows[row][col] = !this.windows[row][col];
      }
    }
  }
}

// CLASSE PÁSSARO
class Bird {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.speed = random(1, 3);
    this.wingUp = true;
  }

  fly() {
    this.x += this.speed;
    if (this.x > width / 2) this.x = 0;
    // Bater asas
    if (frameCount % 20 === 0) this.wingUp = !this.wingUp;
  }

  display() {
    stroke(0);
    noFill();
    strokeWeight(2);
    if (this.wingUp) {
      // asas abertas
      line(this.x, this.y, this.x - this.size / 2, this.y - this.size / 2);
      line(this.x, this.y, this.x + this.size / 2, this.y - this.size / 2);
    } else {
      // asas fechadas
      line(this.x - this.size / 2, this.y, this.x, this.y - this.size / 2);
      line(this.x + this.size / 2, this.y, this.x, this.y - this.size / 2);
    }
    noStroke();
  }
}

// CLASSE CARRO
class Car {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 30;
    this.speed = random(2, 4);
    this.wheelAngle = 0;
  }

  move() {
    this.x += this.speed;
    if (this.x > width) this.x = width / 2;
    this.wheelAngle += this.speed * 0.1;
  }

  display() {
    // Corpo do carro
    fill(255, 0, 0);
    rect(this.x, this.y - this.h / 2, this.w, this.h, 10);

    // Janelas
    fill(200);
    rect(this.x + 10, this.y - this.h / 2 + 5, this.w / 2, this.h / 2, 5);

    // Rodas girando
    push();
    translate(this.x + 15, this.y + this.h / 2 - 5);
    rotate(sin(this.wheelAngle));
    fill(0);
    ellipse(0, 0, 15, 15);
    pop();

    push();
    translate(this.x + this.w - 15, this.y + this.h / 2 - 5);
    rotate(sin(this.wheelAngle));
    fill(0);
    ellipse(0, 0, 15, 15);
    pop();
  }
}

function mousePressed() {
  for (let b of buildings) {
    b.toggleWindow(mouseX, mouseY);
  }
}