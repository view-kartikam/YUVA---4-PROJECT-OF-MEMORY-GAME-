const rules = document.getElementById("rules");
const startBtn = document.getElementById("startBtn");
const game = document.getElementById("game");
const grid = document.getElementById("grid");
const levelText = document.getElementById("level");
const report = document.getElementById("report");

let level = 1;
let pattern = [];
let input = [];
let accepting = false;

// Start game after rules
startBtn.onclick = () => {
  rules.style.display = "none";
  game.style.display = "block";
  startLevel();
};

// Memory load based on your rules
function memoryLoad() {
  if (level === 1) return 1;
  if (level === 2) return 2;
  if (level === 3) return 3;
  if (level === 4) return 4;
  if (level < 15) return 4;
  return 5;
}

// Board size based on your rules
function tileCount() {
  if (level <= 3) return 9;
  if (level <= 6) return 12;
  if (level <= 9) return 16;
  if (level <= 14) return 24;
  return 25;
}

// Start a new level
function startLevel() {
  grid.innerHTML = "";
  pattern = [];
  input = [];
  accepting = false;
  report.innerHTML = "";

  const total = tileCount();
  const size = Math.ceil(Math.sqrt(total));
  grid.style.gridTemplateColumns = `repeat(${size}, 70px)`;

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.onclick = () => selectCell(i, cell);
    grid.appendChild(cell);
  }

  const load = memoryLoad();
  while (pattern.length < load) {
    const r = Math.floor(Math.random() * total);
    if (!pattern.includes(r)) pattern.push(r);
  }

  showPattern();
}

// Show the memory pattern
function showPattern() {
  const cells = document.querySelectorAll(".cell");
  let i = 0;

  const timer = setInterval(() => {
    if (i > 0) cells[pattern[i - 1]].classList.remove("active");

    if (i === pattern.length) {
      clearInterval(timer);
      accepting = true;
      return;
    }

    cells[pattern[i]].classList.add("active");
    i++;
  }, 500);
}

// Handle user click
function selectCell(index, cell) {
  if (!accepting || cell.classList.contains("selected")) return;

  cell.classList.add("selected");
  input.push(index);

  if (input[input.length - 1] !== pattern[input.length - 1]) {
    showReport();
    return;
  }

  if (input.length === pattern.length) {
    level++;
    levelText.textContent = "Level: " + level;

    if (level === 15) {
      report.innerHTML = "🌟 You are something special. Elite memory unlocked.";
    }

    setTimeout(startLevel, 600);
  }
}

// Show memory performance report
function showReport() {
  const best = level - 1;

  report.innerHTML = `
    <h3>Memory Performance Report</h3>
    <p>Highest Level: ${best}</p>
    <p>Memory Capacity: ${memoryLoad()} items</p>
    <p>Estimated World Rank: Top ${Math.max(1, 100 - best * 4)}%</p>
  `;

  level = 1;
  levelText.textContent = "Level: 1";

  setTimeout(startLevel, 1500);
}
