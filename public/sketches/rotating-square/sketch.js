let angle = 0;

function setup() {
  createCanvas(600, 400);
  rectMode(CENTER);
  noStroke();
}

function draw() {
  background(245, 240, 235);
  translate(width / 2, height / 2);
  rotate(angle);
  fill(30, 60, 200);
  rect(0, 0, 160, 160);
  angle += 0.01;
}
