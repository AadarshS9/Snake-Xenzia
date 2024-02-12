// Define constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

// Define variables
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 10};
let dx = 1;
let dy = 0;
let score = 0;
let intervalId;

// Get references to HTML elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");

// Function to draw the snake
function drawSnake() {
  ctx.fillStyle = "#000"; // Black color
  snake.forEach(segment => {
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  });
}

// Function to draw the food
function drawFood() {
  ctx.fillStyle = "#f00"; // Red color for regular food
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Function to move the snake
function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // Check if the snake hits the wall
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    gameOver();
    return;
  }

  // Check if the snake crashes into itself
  if (isSnakeCollision(head)) {
    gameOver();
    return;
  }

  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

// Function to check if the snake crashes into itself
function isSnakeCollision(head) {
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

// Function to handle game over
function gameOver() {
  clearInterval(intervalId);
  alert("Game Over! Your score: " + score);
  resetGame(); // You can implement this function to reset the game if needed
}

// Function to generate new food
function generateFood() {
  // Generate random position
  let validPosition = false;
  while (!validPosition) {
    food.x = Math.floor(Math.random() * GRID_SIZE);
    food.y = Math.floor(Math.random() * GRID_SIZE);

    // Check if the position is not occupied by the snake
    validPosition = !snake.some(segment => segment.x === food.x && segment.y === food.y);
  }
}

// Function to handle key events
function handleKeyDown(e) {
  // Prevent default behavior for arrow keys
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    e.preventDefault();
  }

  switch (e.key) {
    case "ArrowUp":
      if (dy === 0) {
        dx = 0;
        dy = -1;
      }
      break;
    case "ArrowDown":
      if (dy === 0) {
        dx = 0;
        dy = 1;
      }
      break;
    case "ArrowLeft":
      if (dx === 0) {
        dx = -1;
        dy = 0;
      }
      break;
    case "ArrowRight":
      if (dx === 0) {
        dx = 1;
        dy = 0;
      }
      break;
  }
}

// Function to start the game
function startGame() {
  intervalId = setInterval(() => {
    moveSnake();
    drawGame();
  }, 100);
}

// Function to draw the entire game
function drawGame() {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawSnake();
  drawFood();
}

// Initialize the game
function init() {
  generateFood();
  document.addEventListener("keydown", handleKeyDown);
  startGame();
}

// Start the game
init();



// Initialize high scores array if not already present in local storage
if (!localStorage.getItem('highScores')) {
  localStorage.setItem('highScores', JSON.stringify([0, 0, 0, 0, 0]));
}

// Function to update high scores
function updateHighScores(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores'));
  let updated = false;
  
  // Check if the current score is higher than any of the high scores
  for (let i = 0; i < highScores.length; i++) {
    if (score > highScores[i]) {
      highScores.splice(i, 0, score);
      highScores.pop(); // Remove the lowest high score
      updated = true;
      break;
    }
  }

  // Save the updated high scores array to local storage
  if (updated) {
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores(); // Refresh displayed high scores
  }
}
// Function to display high scores
function displayHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores'));
  const highScoresList = document.getElementById('highScoresList');
  highScoresList.innerHTML = '';

  highScores.forEach((score, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${index + 1}) : ${score}`;
    highScoresList.appendChild(listItem);
  });
}

// Call displayHighScores to initially display high scores
displayHighScores();