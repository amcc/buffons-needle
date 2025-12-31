let needleLength = 0;
let divisions = 3;
let halfNeedle = 0;

let crossCount = 0;
let dropCount = 0;

let pi;
const UPDATE_INTERVAL = 1000000; // Update DOM every 100 needles
const NEEDLES_PER_FRAME = 1000000; // Balance throughput vs draw cost
const DRAW_INTERVAL = NEEDLES_PER_FRAME / 100; // Only draw every 10th needle (90% faster visually)
// const NEEDLES_PER_FRAME = 1; // Balance throughput vs draw cost

await createCanvas(window.innerWidth / 3, window.innerHeight);

needleLength = height / divisions;
halfNeedle = needleLength / 2;
background(0);

Q5.draw = function () {
  for (let i = 0; i < NEEDLES_PER_FRAME; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const angle = Math.random() * Math.PI; // Direction modulo π is sufficient

    const crossed = crossedALine(y, angle);
    dropCount++;
    if (crossed) crossCount++;

    if (i % DRAW_INTERVAL === 0) {
      stroke(crossed ? [0, 255, 0] : [255, 0, 255]);
      strokeWeight(1);
      const cos_a = Math.cos(angle);
      const sin_a = Math.sin(angle);
      line(
        x - halfNeedle * cos_a,
        y - halfNeedle * sin_a,
        x + halfNeedle * cos_a,
        y + halfNeedle * sin_a
      );
    }
  }
  if (dropCount % UPDATE_INTERVAL === 0) {
    updateUI();
  }
  drawLines();
};

function calculatePi() {
  if (crossCount === 0) {
    return 0;
  }
  return 2 / (crossCount / dropCount);
}

function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateUI() {
  pi = calculatePi();
  document.getElementById("needle-count").innerText = formatNumber(dropCount);
  document.getElementById("crossing-count").innerText =
    formatNumber(crossCount);
  document.getElementById("pi-value").innerText = pi.toFixed(10);
  document.getElementById("frame-rate").innerText = frameRate().toFixed(2);

  document.getElementById("needles-per-frame").innerText =
    formatNumber(NEEDLES_PER_FRAME);
  document.getElementById("needles-drawn").innerText =
    "1 in every " + formatNumber(DRAW_INTERVAL);
}

function drawLines() {
  for (let i = 0; i <= divisions; i++) {
    let y = (i * height) / divisions;
    stroke(255);
    strokeWeight(1);
    line(0, y, width, y);
  }
}

function crossedALine(y, angle) {
  const o = Math.sin(angle) * halfNeedle; // vertical projection (angle in [0, π))
  const d = y % needleLength; // distance to nearest line
  return d < o || needleLength - d < o;
}
