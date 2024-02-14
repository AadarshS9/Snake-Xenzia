    // Define constants
    const GRID_SIZE = 20;
    const CELL_SIZE = 20;
    const GAME_WIDTH = 900;
    const GAME_HEIGHT = 900;

    // Define variables
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 10};
    let dx = 1;
    let dy = 0;
    let score = 0;
    let intervalId;
    let isGameOver = false;

    // Get references to HTML elements
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.createElement("div");

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
  isGameOver = true;

  // Draw game over message and "Play Again" button
  drawGame();

  // Add event listener for button click
  canvas.addEventListener("click", handleButtonClick);
}

// Function to handle button click
function handleButtonClick(event) {
  const buttonWidth = 120;
  const buttonHeight = 40;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  const buttonY = canvas.height / 2 + 50;

  // Check if the click occurred within the button area
  if (
    event.offsetX >= buttonX &&
    event.offsetX <= buttonX + buttonWidth &&
    event.offsetY >= buttonY &&
    event.offsetY <= buttonY + buttonHeight
  ) {
    // If clicked within the button area, restart the game
    restartGame();
    // Remove the event listener
    canvas.removeEventListener("click", handleButtonClick);
  }
}

    // Function to draw the entire game
    function drawGame() {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      drawSnake();
      drawFood();

      // Check if game is over
      if (isGameOver) {
        // Draw game over message
        ctx.fillStyle = "#000"; // Black color
        ctx.font = "30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
        ctx.font = "20px Arial";
        ctx.fillText("Your score: " + score, canvas.width / 2, canvas.height / 2 + 20);

        // Draw "Play Again" button
        const buttonWidth = 120;
        const buttonHeight = 40;
        const buttonX = canvas.width / 2 - buttonWidth / 2;
        const buttonY = canvas.height / 2 + 50;
        ctx.fillStyle = "#008000"; // Green color for the button
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // Button text
        ctx.fillStyle = "#fff"; // White color for the text
        ctx.font = "20px Arial";
        ctx.fillText("Play Again", canvas.width / 2, canvas.height / 2 + 80);
      }
    }

    // Function to restart the game
    function restartGame() {
      // Remove event listener to prevent multiple clicks
      canvas.removeEventListener("click", restartGame);
      
      // Reset the score
      score = 0;
      scoreElement.textContent = score;

      // Reset snake and food positions
      snake = [{x: 10, y: 10}];
      generateFood();

      // Restart the game
      isGameOver = false;
      intervalId = setInterval(() => {
        moveSnake();
        drawGame();
      }, 100);
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

    // Initialize the game
    function init() {
      generateFood();
      document.addEventListener("keydown", handleKeyDown);
      startGame();
    }

    // Start the game
    init();

