// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;
var Constraint = Matter.Constraint;
var Mouse = Matter.Mouse;
var MouseConstraint = Matter.MouseConstraint;

var engine;
var propeller;
var boxes = [];
var birds = [];
var clouds = [];
var cloudImg;
var colors = [];
var ground;
var slingshotBird, slingshotConstraint;
var angle=0;
var angleSpeed=0;
var canvas;
var countdown;

////////////////////////////////////////////////////////////

//loads in the cloud image
function preload(){
  cloudImg = loadImage('assets/cloud.png')
}

function setup() {
  canvas = createCanvas(1000, 600);

  engine = Engine.create();  // create an engine

  //sets the countdown time to 1 second intervals
  setInterval(countDownTimer, 1000);
  countdown = 60;

  setupGround();

  setupPropeller();

  setupTower();

  setupClouds();

  setupSlingshot();

  setupMouseInteraction();

}
////////////////////////////////////////////////////////////
function draw() {
  background(135,206,235);

  Engine.update(engine);

  drawGround();

  drawPropeller();

  drawTower();

  drawClouds();

  drawBirds();

  drawSlingshot();

  drawStats();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed(){
  if (keyCode == LEFT_ARROW){
    //your code here
    angleSpeed += 0.01;
  }
  else if (keyCode == RIGHT_ARROW){
    //your code here
    angleSpeed -= 0.01;
  }
}
////////////////////////////////////////////////////////////
function keyTyped(){
  //if 'b' create a new bird to use with propeller
  if (key==='b'){
    setupBird();
  }

  //if 'r' reset the slingshot
  if (key==='r'){
    removeFromWorld(slingshotBird);
    removeFromWorld(slingshotConstraint);
    setupSlingshot();
  }
}

//decrements the countdown timer
function countDownTimer(){
  countdown --;
}

//draws the countdown timer and number of boxes
//calls game over if timer reaches 0 or youWon if boxes reaches 0
function drawStats(){
  fill (255);
  noStroke();
  textSize(25);
  text("Time Left: " + countdown, 20, 50);
  text("Boxes: " + boxes.length,  width - 140, 50);

  if (countdown === 0){
    gameOver();
  }
  if (boxes.length === 0){
    youWon();
  }
}

//displays game over message if countdown reaches 0
function gameOver(){

  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("GAME OVER", width/2, height/2)
  noLoop();
}

//displays you win message if no boxes are on screen
function youWon(){

  fill(255);
  textSize(80);
  textAlign(CENTER);
  text("YOU WIN", width/2, height/2)
  noLoop();
}

//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased(){
  setTimeout(() => {
    slingshotConstraint.bodyB = null;
    slingshotConstraint.pointA = { x: 0, y: 0 };
  }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body){
  var pos = body.position;
  return (pos.y > height || pos.x<0 || pos.x>width);
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
  World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
  beginShape();
  for (var i = 0; i < vertices.length; i++) {
    vertex(vertices[i].x, vertices[i].y);
  }
  endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
  push();
  var offsetA = constraint.pointA;
  var posA = {x:0, y:0};
  if (constraint.bodyA) {
    posA = constraint.bodyA.position;
  }
  var offsetB = constraint.pointB;
  var posB = {x:0, y:0};
  if (constraint.bodyB) {
    posB = constraint.bodyB.position;
  }
  strokeWeight(5);
  stroke(255);
  line(
    posA.x + offsetA.x,
    posA.y + offsetA.y,
    posB.x + offsetB.x,
    posB.y + offsetB.y
  );
  pop();
}



