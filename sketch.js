// Roniel Pena 
// the turtle game

// Press 'D' to duck/hide
// I used Daniel Shiffman's tutorials among other creators to achieve this.  

let hatchingVid, predatorVid, finaldestinationVid;
let playButton = { x: 0, y: 0, w: 0, h: 55 };
let turtle;
let cars = [];
let trash = [];
let predators = [];
let predatorImgs = [];
let Shell = false;
let grid = 70;
let lives = 5;
let turtleImg, introImg, lifeImg, gameOverImg, shellImg;
let carImgs = [];
let trashImgs = [];
let moveSound;
let gameState = 'Intro';

function preload() {
  turtleImg = loadImage('sea-turtle.png');
  shellImg = loadImage('shell.png');
  introImg = loadImage('intro.jpg');
  lifeImg = loadImage('lives.png');
  gameOverImg = loadImage('gameover.png');
  carImgs.push(loadImage('recar.png'));
  carImgs.push(loadImage('yellowcar.png'));
  carImgs.push(loadImage('bluecar.png'));
  carImgs.push(loadImage('greencar.png'));
  trashImgs.push(loadImage('trash0.png'));
  trashImgs.push(loadImage('trash1.png'));
  trashImgs.push(loadImage('trash2.png'));
  trashImgs.push(loadImage('trash3.png'));
  trashImgs.push(loadImage('trash4.png'));
  moveSound = loadSound('move.mp3');
  predatorImgs[0] = loadImage('predator.png');
  predatorImgs[1] = loadImage('predator1.png');
  predatorImgs[2] = loadImage('predator2.png');
}

function setup() {
  // createCanvas(670, 500);
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  resetGame();
}

function resetGame() {
  turtle = new Turtle(width / 2 - grid / 2, height - grid, grid);
  cars = [];
  trash = [];
  predators = [];

  if (gameState === 'RoadLevel') {
    placeCarsOnRow(height - grid * 4, 3);
    placeCarsOnRow(height - grid * 6, 2);
    placeCarsOnRow(height - grid * 8, 3);
  } else if (gameState === 'BeachLevel') {
    placeStaticTrashRandomly(height - grid * 4, 3);
    placeStaticTrashRandomly(height - grid * 6, 3);
    placeStaticTrashRandomly(height - grid * 8, 3);

    for (let i = 0; i < predatorImgs.length; i++) {
      let x = random(width);
      let y = random(height / 2, height - grid * 2);
      predators.push(new Predator(x, y, predatorImgs[i]));
    }
  }
}

function placeCarsOnRow(y, count) {
  for (let i = 0; i < count; i++) {
    let x = i * random(150, 200) + random(30);
    let speed = random(2, 5);
    let img = random(carImgs);
    cars.push(new Car(x, y, grid * 2, grid, speed, img));
  }
}

function placeStaticTrashRandomly(y, count) {
  for (let i = 0; i < count; i++) {
    let x = random(0, width - grid);
    let speed = 0;
    let img = random(trashImgs);
    trash.push(new Trash(x, y, grid, grid, speed, img));
  }
}

function draw() {
  if (gameState === 'GameOver') {
    background(0);
    imageMode(CENTER);
    image(gameOverImg, width / 2, height / 2, width, height);
    return;
  } else if (gameState === 'BeachLevel') {
    background(255, 245, 180); 
  } else {
    background(0);
  }

  if (gameState === 'Intro') {
    image(introImg, 0, 0, width, height);
    textSize(60);
    let s = 'PLAY';
    playButton.w = textWidth(s) + 40;
    playButton.x = width / 2;
    playButton.y = height / 2.5;
    fill(0, 90, 205);
    rect(playButton.x, playButton.y, playButton.w, playButton.h, 12);
    fill(255);
    text(s, playButton.x, playButton.y);
    return;
  }

  if (gameState === 'Video' && hatchingVid && hatchingVid.time() <= 12) {
    image(hatchingVid, 0, 0, width, height);
    if (frameCount % 60 < 30) {
      fill(255);
      textSize(20);
      text("Press SPACE to skip", width / 2, height - 40);
    }
    return;
  } else if (gameState === 'Video' && hatchingVid && hatchingVid.time() > 12) {
    hatchingVid.stop();
    hatchingVid.hide();
    gameState = 'RoadLevel';
    resetGame();
  }

  if (gameState === 'PredatorVideo' && predatorVid && predatorVid.time() <= 14) {
    image(predatorVid, 0, 0, width, height);
    if (frameCount % 60 < 30) {
      fill(255);
      textSize(20);
      text("Press SPACE to skip", width / 2, height - 40);
    }
    return;
  } else if (gameState === 'PredatorVideo' && predatorVid && predatorVid.time() > 14) {
    predatorVid.stop();
    predatorVid.hide();
    gameState = 'BeachLevel';
    resetGame();
  }

  if (gameState === 'FinalVideo' && finaldestinationVid && finaldestinationVid.time() <= 86) {
    image(finaldestinationVid, 0, 0, width, height);
    if (frameCount % 60 < 30) {
      fill(255);
      textSize(20);
      text("Press SPACE to skip", width / 2, height - 40);
    }
    return;
  } else if (gameState === 'FinalVideo' && finaldestinationVid && finaldestinationVid.time() > 86) {
    finaldestinationVid.stop();
    finaldestinationVid.hide();
    gameState = 'Intro';
  }
  if (gameState === 'BeachLevel') {
    fill(0, 100, 255, 100); 
  } else {
    fill(255, 245, 180); 
  }
  rect(width / 2, grid / 2, width, 100);

  for (let i = 0; i < lives; i++) {
    image(lifeImg, 10 + i * 30, 10, 25, 25);
  }
  
  if (gameState === 'RoadLevel') {
    for (let car of cars) {
      car.update();
      car.show();
      if (turtle.collidesWith(car) && !Shell) {
        lives--;
        if (lives <= 0) {
          gameState = 'GameOver';  
          return;
        }
        resetGame();
        return;
      }
    }
  } else if (gameState === 'BeachLevel') {
    for (let t of trash) {
      t.show();
      if (turtle.collidesWith(t) && !Shell) {
        lives--;
        if (lives <= 0) {
          gameState = 'GameOver';  
          return;
        }
        resetGame();
        return;
      }
    }
    for (let predator of predators) {
      predator.seek(turtle.position);
      predator.update();
      predator.show();
      if (turtle.collidesWith(predator) && !Shell) {
        lives--;
        if (lives <= 0) {
          gameState = 'GameOver';
          return;
        }
        resetGame();
        return;
      } 
    }
  }
  turtle.update();
  turtle.show();
  if (turtle.position.y < grid) {
    if (gameState === 'RoadLevel') {
      gameState = 'PredatorVideo';
      predatorVid = createVideo('predator.mp4', () => predatorVid.play());
      predatorVid.size(width, height);
      predatorVid.hide();
    } else if (gameState === 'BeachLevel') {
      gameState = 'FinalVideo';
      finaldestinationVid = createVideo('finaldestination.mp4', () => finaldestinationVid.play());
      finaldestinationVid.size(width, height);
      finaldestinationVid.hide();
    } else {
      gameState = 'Intro';
      lives = 5;
    }
    resetGame();
  }
}

function mousePressed() {
  if (gameState === 'Intro') {
    if (
      mouseX > playButton.x - playButton.w / 2 &&
      mouseX < playButton.x + playButton.w / 2 &&
      mouseY > playButton.y - playButton.h / 2 &&
      mouseY < playButton.y + playButton.h / 2
    ) {
      gameState = 'Video';
      hatchingVid = createVideo('hacting.mp4', () => hatchingVid.play());
      hatchingVid.size(width, height);
      hatchingVid.hide();
    }
  }

  if (gameState === 'GameOver') {
    lives = 5;
    gameState = 'Intro';  
    resetGame();
  }
}

function keyPressed() {
  if (
    gameState !== 'Intro' &&
    gameState !== 'MainMenu' &&
    gameState !== 'Video' &&
    gameState !== 'PredatorVideo' &&
    gameState !== 'FinalVideo' &&
    gameState !== 'GameOver'
  ) {
    if (!Shell) {
      if (keyCode === UP_ARROW) turtle.move(0, -1);
      else if (keyCode === DOWN_ARROW) turtle.move(0, 1);
      else if (keyCode === LEFT_ARROW) turtle.move(-1, 0);
      else if (keyCode === RIGHT_ARROW) turtle.move(1, 0);
      if ([UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW].includes(keyCode)) {
        moveSound.play();
      }
    }
  }
  if (key === 'd' || key === 'D') {
    Shell = true;
  }
  if (key === ' ') {
    if (gameState === 'Video' && hatchingVid) {
      hatchingVid.stop();
      hatchingVid.hide();
      gameState = 'RoadLevel';
      lives = 5;
      resetGame();
      return;
    } else if (gameState === 'PredatorVideo' && predatorVid) {
      predatorVid.stop();
      predatorVid.hide();
      gameState = 'BeachLevel';
      lives = 5;
      resetGame();
      return;
    } else if (gameState === 'FinalVideo' && finaldestinationVid) {
      finaldestinationVid.stop();
      finaldestinationVid.hide();
      gameState = 'Intro';
      lives = 5;
      resetGame();
      return;
    }
  }
}

function keyReleased() {
  if (key === 'd' || key === 'D') {
    Shell = false;
  }
}

class Turtle {
  constructor(x, y, size) {
    this.position = createVector(x, y);
    this.size = size;
  }

  move(xdir, ydir) {
    this.position.x += xdir * grid;
    this.position.y += ydir * grid;
    this.position.x = constrain(this.position.x, 0, width - grid);
    this.position.y = constrain(this.position.y, 0, height - grid);
  }

  update() {}

  show() {
    imageMode(CORNER);
    if (Shell) {
      image(shellImg, this.position.x, this.position.y, this.size, this.size);
    } else {
      image(turtleImg, this.position.x, this.position.y, this.size, this.size);
    }
  }

  collidesWith(obj) {
    return (
      this.position.x < obj.x + obj.w &&
      this.position.x + this.size > obj.x &&
      this.position.y < obj.y + obj.h &&
      this.position.y + this.size > obj.y
    );
  }
}

class Car {
  constructor(x, y, w, h, speed, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.img = img;
  }

  update() {
    this.x += this.speed;
    if (this.x > width) this.x = -this.w;
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

class Trash {
  constructor(x, y, w, h, speed, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.img = img;
  }

  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

class Predator {
  constructor(x, y, img) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.vel.normalize().mult(1); // Start with some movement
    this.acc = createVector(0, 0);
    this.maxSpeed = 2; 
    this.maxForce = 0.2;
    this.img = img;
    this.w = grid;
    this.h = grid;
    this.targetReached = false;
    this.pauseTimer = 0;
    this.nextTargetTime = 0;
    this.circlingRadius = random(80, 150); 
    this.circlingSpeed = random(0.02, 0.02); 
    this.circlingAngle = random(TWO_PI); 
  }

  seek(target) {
    let distToTarget = p5.Vector.dist(this.pos, target);
    
     if (distToTarget < 20 || millis() > this.nextTargetTime) {
      this.targetReached = true;
      
        if (this.pauseTimer === 0) {
        this.pauseTimer = millis() + random(500, 1500);
      }
      
      if (millis() > this.pauseTimer) {
        this.targetReached = false;
        this.pauseTimer = 0;
        this.nextTargetTime = millis() + random(3000, 6000);
      }
    }
    
    if (this.targetReached) {
      this.circleAround(target);
    } else {
      let desired = p5.Vector.sub(target, this.pos);
      desired.normalize();
      desired.mult(this.maxSpeed);
      
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.maxForce);
      this.acc.add(steer);
    }
  }
  
  circleAround(center) {
    this.circlingAngle += this.circlingSpeed;
    
    let circleX = center.x + this.circlingRadius * cos(this.circlingAngle);
    let circleY = center.y + this.circlingRadius * sin(this.circlingAngle);
    let circlePos = createVector(circleX, circleY);
    
    let desired = p5.Vector.sub(circlePos, this.pos);
    desired.normalize();
    desired.mult(this.maxSpeed);
    
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(this.maxForce);
    this.acc.add(steer);
  }

  update() {
    this.vel.add(this.acc);
     if (this.vel.mag() < 0.5) {
      this.vel.normalize().mult(0.5);
    }
    
    this.vel.limit(this.maxSpeed);
    
    this.pos.add(this.vel);
    
    this.acc.mult(0);
    
    if (this.pos.x < -this.w) this.pos.x = width;
    if (this.pos.x > width) this.pos.x = -this.w;
    if (this.pos.y < -this.h) this.pos.y = height;
    if (this.pos.y > height) this.pos.y = -this.h;
  }

  show() {
    image(this.img, this.pos.x, this.pos.y, this.w, this.h);
  }

  get x() {
    return this.pos.x;
  }

  get y() {
    return this.pos.y;
  }
}
