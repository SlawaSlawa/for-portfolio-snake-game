const startBtn = document.querySelector("#start-btn");
const restartBtn = document.querySelector("#restart-btn");
const scoreEl = document.querySelector(".score");
const recordEl = document.querySelector(".record");
const overlayEl = document.querySelector(".overlay");
const overlayScoreEl = document.querySelector(".overlay__score");
const overlayRecordEl = document.querySelector(".overlay__record");

const canvas = document.querySelector(".canvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const snakeColor = "red";
const eatColor = "green";

const snakeStartPosition = {
    x: 100,
    y: 100,
};

const canvasSizes = {
    width: canvas.width,
    height: canvas.height,
};

const snake = [
    {
        x: snakeStartPosition.x,
        y: snakeStartPosition.y,
    },
];

const foodPosition = {
    x: 0,
    y: 0,
};

let direction = "right";
let score = 0;
let record = localStorage.getItem("snake-game-record") || 0;
let speed = 500;
let foodIsRender = false;
let stopAnimationId = null;

const clearCanvas = () => {
    ctx.clearRect(0, 0, canvasSizes.width, canvasSizes.height);
};

const renderSnake = () => {
    clearCanvas();

    ctx.beginPath();
    snake.forEach((segment) => {
        ctx.rect(segment.x, segment.y, gridSize, gridSize);
        ctx.fillStyle = snakeColor;
        ctx.fill();
    });
};

const getFoodPosition = () => {
    if (!foodIsRender) {
        foodPosition.x =
            Math.floor(Math.random() * (canvasSizes.width / gridSize)) *
            gridSize;
        foodPosition.y =
            Math.floor(Math.random() * (canvasSizes.height / gridSize)) *
            gridSize;

        foodIsRender = true;
    }
    return { x: foodPosition.x, y: foodPosition.y };
};

const renderFood = () => {
    const { x, y } = getFoodPosition();
    foodPosition.x = x;
    foodPosition.y = y;

    ctx.beginPath();
    ctx.rect(x, y, gridSize, gridSize);
    ctx.fillStyle = eatColor;
    ctx.fill();
};

const changeDirection = (key) => {
    if (key === "ArrowRight" && direction !== "left") direction = "right";
    if (key === "ArrowLeft" && direction !== "right") direction = "left";
    if (key === "ArrowUp" && direction !== "down") direction = "up";
    if (key === "ArrowDown" && direction !== "up") direction = "down";
};

const hasCollision = () => {
    let collision = false;

    if (
        snake[0].x < 0 ||
        snake[0].x > canvas.width - gridSize ||
        snake[0].y < 0 ||
        snake[0].y > canvas.height - gridSize
    ) {
        collision = true;
    }

    snake.forEach((item, index) => {
        if (
            snake[0].x === item.x &&
            snake[0].y === item.y &&
            snake.length > 2 &&
            index !== 0
        )
            collision = true;
    });

    return collision;
};

const moveGame = () => {
    setTimeout(() => {
        const snakeHead = snake[0];

        if (direction === "right") {
            const newPosition = snakeHead.x + gridSize;
            snake.unshift({ x: newPosition, y: snakeHead.y });
        }
        if (direction === "left") {
            const newPosition = snakeHead.x - gridSize;
            snake.unshift({ x: newPosition, y: snakeHead.y });
        }
        if (direction === "up") {
            const newPosition = snakeHead.y - gridSize;
            snake.unshift({ x: snakeHead.x, y: newPosition });
        }
        if (direction === "down") {
            const newPosition = snakeHead.y + gridSize;
            snake.unshift({ x: snakeHead.x, y: newPosition });
        }

        if (snakeHead.x === foodPosition.x && snakeHead.y === foodPosition.y) {
            foodIsRender = false;
            renderFood();
            score++;
            scoreEl.textContent = `Score: ${score}`;
            if (score % 3 === 0 && speed >= 200) {
                speed -= 100;

                if (speed < 200) {
                    speed = 100;
                }
            }
        } else {
            snake.pop();
        }

        if (hasCollision()) {
            gameOver();
        } else {
            renderSnake();
            renderFood();
            stopAnimationId = requestAnimationFrame(moveGame);
        }
    }, speed);
};

const startGame = () => {
    startBtn.style.display = "none";
    renderSnake();
    renderFood();
    score = 0;
    scoreEl.textContent = `Score: ${score}`;
    recordEl.textContent = `Record: ${record}`;
    moveGame();
};

const gameOver = () => {
    if (
        localStorage.getItem("snake-game-record") < score ||
        !localStorage.getItem("snake-game-record")
    ) {
        localStorage.setItem("snake-game-record", score);
    }
    cancelAnimationFrame(stopAnimationId);

    overlayEl.classList.add("overlay--active");
    overlayScoreEl.textContent = score;
    overlayRecordEl.textContent = record;
};

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
    location.reload();
});
document.addEventListener("keydown", (evt) => {
    changeDirection(evt.key);
});

scoreEl.textContent = `Score: ${score}`;
recordEl.textContent = `Record: ${record}`;
