// Basic setup for the Snake game
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
const canvasSize = canvas.width / grid;

let snake = [{ x: 10 * grid, y: 10 * grid }];
let direction = 'RIGHT';
let apple = { x: 15 * grid, y: 15 * grid };
let score = 0;
let gameInterval;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, grid, grid));

    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid, grid);

    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 20);
}

function update() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= grid;
            break;
        case 'DOWN':
            head.y += grid;
            break;
        case 'LEFT':
            head.x -= grid;
            break;
        case 'RIGHT':
            head.x += grid;
            break;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        placeApple();
    } else {
        snake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height || collision()) {
        clearInterval(gameInterval);
        alert('Game Over');
    }

    draw();
}

function collision() {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    return false;
}

function placeApple() {
    apple.x = Math.floor(Math.random() * canvasSize) * grid;
    apple.y = Math.floor(Math.random() * canvasSize) * grid;
}

function changeDirection(event) {
    const key = event.key;
    if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

document.getElementById('startButton').addEventListener('click', () => {
    if (gameInterval) clearInterval(gameInterval);
    snake = [{ x: 10 * grid, y: 10 * grid }];
    direction = 'RIGHT';
    score = 0;
    placeApple();
    gameInterval = setInterval(update, 100);
});

document.getElementById('pauseButton').addEventListener('click', () => {
    clearInterval(gameInterval);
});

document.getElementById('resetButton').addEventListener('click', () => {
    clearInterval(gameInterval);
    snake = [{ x: 10 * grid, y: 10 * grid }];
    direction = 'RIGHT';
    score = 0;
    placeApple();
    draw();
});

document.addEventListener('keydown', changeDirection);

draw();
