let needleLength = 0;
let divisions = 10;
let halfNeedle = 0;

let crossCount = 0;
let dropCount = 0;

let pi;
const UPDATE_INTERVAL = 100000; // Update DOM every 100 needles

await createCanvas(500, 500);

needleLength = height / divisions;
halfNeedle = needleLength / 2;
background(255);
drawLines();

Q5.draw = function () {
  for (let i = 0; i < 100000; i++) {
    dropNeedle(random(width), random(height));
  }
  if (dropCount % UPDATE_INTERVAL === 0) {
    updateUI();
  }
};

function calculatePi() {
  if (crossCount === 0) {
    return 0;
  }
  return 2 / (crossCount / dropCount);
}

function updateUI() {
  pi = calculatePi();
  document.getElementById("needle-count").innerText = dropCount;
  document.getElementById("crossing-count").innerText = crossCount;
  document.getElementById("pi-value").innerText = pi.toFixed(6);
  document.getElementById("frame-rate").innerText = frameRate().toFixed(2);
}

function dropNeedle(x, y) {
  dropCount++;
  let angle = random(TWO_PI);

  if (crossedALine(x, y, angle)) {
    stroke("red");
  } else {
    stroke("green");
  }

  strokeWeight(2);
  let cos_a = cos(angle);
  let sin_a = sin(angle);
  line(
    x - halfNeedle * cos_a,
    y - halfNeedle * sin_a,
    x + halfNeedle * cos_a,
    y + halfNeedle * sin_a
  );
}

function drawLines() {
  for (let i = 0; i <= divisions; i++) {
    let y = (i * height) / divisions;
    stroke(100, 100, 255);
    strokeWeight(1);
    line(0, y, width, y);
  }
}

function crossedALine(x, y, angle) {
  let a = angle % PI;
  let h = needleLength / 2;
  let o = sin(a) * h;
  let d = y % needleLength;

  //   console.log(angle, h, o, d);
  if (d < o || needleLength - d < o) {
    crossCount++;
    return true;
  }
  return false;
}
