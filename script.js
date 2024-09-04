const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const grid = 20;
const canvasSize = canvas.width / grid;

let snake = [{ x: 10 * grid, y: 10 * grid }];
let direction = 'RIGHT';
let apple = { x: 15 * grid, y: 15 * grid };
let score = 0;
let lastTime = 0;
let animationId;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw apple
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x, apple.y, grid, grid);
    ctx.fillStyle = 'darkred';
    ctx.fillRect(apple.x + 3, apple.y + 3, grid - 6, grid - 6);

    // Draw snake
    snake.forEach((part, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? 'darkgreen' : 'green';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(part.x, part.y, grid, grid);
        ctx.fillRect(part.x, part.y, grid, grid);

        if (!isHead) {
            ctx.fillStyle = 'lightgreen';
            ctx.fillRect(part.x + 2, part.y + 2, grid - 4, grid - 4);
        }
    });

    // Draw score
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

    // Wrap around the canvas edges
    if (head.x >= canvas.width) head.x = 0;
    if (head.x < 0) head.x = canvas.width - grid;
    if (head.y >= canvas.height) head.y = 0;
    if (head.y < 0) head.y = canvas.height - grid;

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        placeApple();
    } else {
        snake.pop();
    }

    if (collision()) {
        cancelAnimationFrame(animationId);
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
    if (event.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (event.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (event.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (event.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
}

document.getElementById('startButton').addEventListener('click', () => {
    snake = [{ x: 10 * grid, y: 10 * grid }];
    direction = 'RIGHT';
    score = 0;
    placeApple();
    lastTime = 0;
    if (animationId) cancelAnimationFrame(animationId);
    animationId = requestAnimationFrame(gameLoop);
});

document.getElementById('pauseButton').addEventListener('click', () => {
    cancelAnimationFrame(animationId);
});

document.getElementById('resetButton').addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    snake = [{ x: 10 * grid, y: 10 * grid }];
    direction = 'RIGHT';
    score = 0;
    placeApple();
    draw();
});

document.addEventListener('keydown', changeDirection);

document.getElementById('up').addEventListener('click', () => {
    if (direction !== 'DOWN') direction = 'UP';
});

document.getElementById('down').addEventListener('click', () => {
    if (direction !== 'UP') direction = 'DOWN';
});

document.getElementById('left').addEventListener('click', () => {
    if (direction !== 'RIGHT') direction = 'LEFT';
});

document.getElementById('right').addEventListener('click', () => {
    if (direction !== 'LEFT') direction = 'RIGHT';
});

function gameLoop(timestamp) {
    if (timestamp - lastTime >= 100) { // Update every 100ms
        update();
        lastTime = timestamp;
    }
    animationId = requestAnimationFrame(gameLoop);
}

draw();
