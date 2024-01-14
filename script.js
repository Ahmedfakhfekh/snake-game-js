var board = document.getElementById('game-board');
var instructionText = document.getElementById('instruction-text');
var logo = document.getElementById('logo');
var score = document.getElementById('score');
var highScoreText = document.getElementById('highScore');

var gridSize = 20;
var snake = [{ x: 10, y: 10 }];
var direction, gameInterval, gameSpeedDelay = 200, highScore = 0, gameStarted = false;
var food = generateFood();

function drawFood() {
  if (gameStarted) {
    var foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
  }
}

function startGame() {
  gameStarted = true;
  instructionText.style.display = logo.style.display = 'none';
  food = generateFood();
  gameInterval = setInterval(() => { move(); checkCollision(); draw(); }, gameSpeedDelay);
}

function draw() {
  board.innerHTML = '';
  snake.forEach(segment => drawElement(createElement('div', 'snake'), segment));
  drawElement(createElement('div', 'food'), food);
  updateScore();
}

function drawElement(element, position) {
  setPosition(element, position);
  board.appendChild(element);
}

function createElement(tag, className) {
  var element = document.createElement(tag);
  element.className = className;
  return element;
}

function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

function generateFood() {
  return { x: Math.floor(Math.random() * gridSize) + 1, y: Math.floor(Math.random() * gridSize) + 1 };
}

function move() {
  var head = { ...snake[0] };
  updateHeadPosition(head);
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = generateFood();
    increaseSpeed();
  } else {
    snake.pop();
  }
}

function updateHeadPosition(head) {
  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }
}

function handleKeyPress(event) {
  if (!gameStarted && (event.code === 'Space' || event.key === ' ')) {
    startGame();
  } else {
    direction = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[event.key] || direction;
  }
}

document.addEventListener('keydown', handleKeyPress);

function increaseSpeed() {
  gameSpeedDelay = Math.max(gameSpeedDelay - (gameSpeedDelay > 150 ? 5 : gameSpeedDelay > 100 ? 3 : gameSpeedDelay > 50 ? 2 : 1), 25);
}

function checkCollision() {
  var head = snake[0];

  if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize || snake.slice(1).some(segment => head.x === segment.x && head.y === segment.y)) {
    resetGame();
  }
}

function resetGame() {
  updateHighScore();
  stopGame();
  snake = [{ x: 10, y: 10 }];
  food = generateFood();
  direction = 'right';
  gameSpeedDelay = 200;
  updateScore();
}

function updateScore() {
  score.textContent = (snake.length - 1).toString().padStart(3, '0');
}

function stopGame() {
  clearInterval(gameInterval);
  gameStarted = false;
  instructionText.style.display = logo.style.display = 'block';
}

function updateHighScore() {
  var currentScore = snake.length - 1;
  if (currentScore > highScore) {
    highScore = currentScore;
    highScoreText.textContent = highScore.toString().padStart(3, '0');
  }
  highScoreText.style.display = 'block';
}
