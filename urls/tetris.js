// 游戏常量
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;
const COLORS = [
    '#00FFFF', // 青色 - I形
    '#0055FF', // 蓝色 - J形
    '#FFA500', // 橙色 - L形
    '#FFFF00', // 黄色 - O形
    '#00FF00', // 绿色 - S形
    '#800080', // 紫色 - T形
    '#FF0000'  // 红色 - Z形
];

// 方块形状定义
const SHAPES = [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]], // I
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],                         // J
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],                         // L
    [[1, 1], [1, 1]],                                          // O
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],                         // S
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],                         // T
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]]                          // Z
];

// 游戏状态
let canvas;
let ctx;
let nextCanvas;
let nextCtx;
let board;
let currentPiece;
let nextPiece;
let score = 0;
let level = 1;
let lines = 0;
let gameOver = false;
let isPaused = false;
let requestId;
let dropCounter = 0;
let dropInterval = 1000; // 初始下落间隔（毫秒）
let lastTime = 0;

// DOM 元素
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const linesElement = document.getElementById('lines');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');

// 初始化游戏
function init() {
    canvas = document.getElementById('tetris');
    ctx = canvas.getContext('2d');
    
    nextCanvas = document.getElementById('next-piece');
    nextCtx = nextCanvas.getContext('2d');
    
    // 设置画布缩放
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    nextCtx.scale(BLOCK_SIZE / 2, BLOCK_SIZE / 2);
    
    // 事件监听
    document.addEventListener('keydown', handleKeyPress);
    
    pauseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        togglePause();
    });
    
    resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        resetGame();
    });
    
    speedSlider.addEventListener('input', updateSpeed);
    
    resetGame(); // 先重置游戏
    startGame(); // 然后开始游戏
}

// 重置游戏
function resetGame() {
    cancelAnimationFrame(requestId);
    requestId = null; // 确保requestId被正确重置为null
    
    // 初始化游戏板
    board = Array.from({length: ROWS}, () => Array(COLS).fill(0));
    
    // 重置分数
    score = 0;
    level = 1;
    lines = 0;
    updateScore();
    
    // 创建新方块
    currentPiece = createPiece();
    nextPiece = createPiece();
    
    // 重置游戏状态
    gameOver = false;
    isPaused = false;
    lastTime = 0;
    dropCounter = 0; // 重置下落计数器
    pauseBtn.textContent = '暂停'; // 重置按钮文本为暂停
    
    // 更新速度
    updateSpeed();
    
    // 绘制初始状态
    draw();
    drawNextPiece();

    animate();
}

// 开始游戏
function startGame() {
    if (gameOver) {
        resetGame();
    }
    
    // 修改这里的条件判断，确保游戏能够正确启动
    if (!requestId && !isPaused) {
        isPaused = false;
        lastTime = 0;
        dropCounter = 0; // 重置下落计数器
        animate();
    }
}

// 暂停/继续游戏
function togglePause() {
    if (gameOver) return;
    
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
    
    if (!isPaused && !requestId) {
        animate();
    }
}

// 更新速度
function updateSpeed() {
    const speed = speedSlider.value;
    speedValue.textContent = speed;
    dropInterval = 1000 / (speed * 0.5);
}

// 创建新方块
function createPiece() {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    
    return {
        shape,
        color: COLORS[shapeIndex],
        x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2),
        y: 0
    };
}

// 绘制游戏板
function draw() {
    if (gameOver) return
    // 将背景色改为深灰色而不是黑色，增加对比度
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制已固定的方块
    drawMatrix(board, {x: 0, y: 0});
    
    // 绘制当前方块
    if (currentPiece) {
        drawMatrix(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y}, currentPiece.color);
    }
}

// 绘制下一个方块
function drawNextPiece() {
    nextCtx.fillStyle = '#eee';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    
    if (nextPiece) {
        const offsetX = (4 - nextPiece.shape[0].length) / 2;
        const offsetY = (4 - nextPiece.shape.length) / 2;
        drawMatrix(nextPiece.shape, {x: offsetX + 1, y: offsetY + 1}, nextPiece.color, nextCtx);
    }
}

// 绘制矩阵
function drawMatrix(matrix, offset, color = null, context = ctx) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                // 设置方块填充颜色
                context.fillStyle = color || COLORS[value - 1];
                context.fillRect(x + offset.x, y + offset.y, 1, 1);
                
                // 添加边框使方块更容易区分
                context.strokeStyle = '#000000';
                context.lineWidth = 0.05;
                context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                
                // 添加高光效果
                // context.fillStyle = 'rgba(255, 255, 255, 0.3)';
                // context.fillRect(x + offset.x, y + offset.y, 0.3, 0.3);
            }
        });
    });
}

// 碰撞检测
function collide(matrix, position) {
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            if (matrix[y][x] !== 0 &&
                (board[y + position.y] === undefined ||
                    board[y + position.y][x + position.x] === undefined ||
                    board[y + position.y][x + position.x] !== 0)) {
                return true;
            }
        }
    }
    return false;
}

// 合并方块到游戏板
function merge() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                const boardX = x + currentPiece.x;
                const boardY = y + currentPiece.y;
                if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
                    board[boardY][boardX] = COLORS.indexOf(currentPiece.color) + 1;
                }
            }
        });
    });
}

// 旋转方块
function rotate() {
    const rotated = [];
    for (let i = 0; i < currentPiece.shape[0].length; i++) {
        const row = [];
        for (let j = currentPiece.shape.length - 1; j >= 0; j--) {
            row.push(currentPiece.shape[j][i]);
        }
        rotated.push(row);
    }
    
    const originalShape = currentPiece.shape;
    currentPiece.shape = rotated;
    
    // 如果旋转后发生碰撞，尝试左右移动来适应
    if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
        // 尝试向左移动
        currentPiece.x--;
        if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
            // 尝试向右移动（最多2格）
            currentPiece.x += 2;
            if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
                // 如果仍然碰撞，恢复原状
                currentPiece.x--;
                currentPiece.shape = originalShape;
            }
        }
    }
}

// 移动方块
function move(dir) {
    currentPiece.x += dir;
    if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
        currentPiece.x -= dir;
    }
}

// 下落方块
function drop() {
    if (gameOver) return
    currentPiece.y++;
    if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
        currentPiece.y--;
        merge();
        
        // 检查游戏结束
        if (currentPiece.y <= 0) {
            gameOver = true;
            cancelAnimationFrame(requestId);
            requestId = null;
            // 替换alert为自定义游戏结束显示
            showGameOver();
            return;
        }
        
        // 检查并清除完整行
        clearLines();
        
        // 获取下一个方块
        currentPiece = nextPiece;
        nextPiece = createPiece();
        
        // 检查新方块是否能放置，如果不能则游戏结束
        if (collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y})) {
            gameOver = true;
            cancelAnimationFrame(requestId);
            requestId = null;
            showGameOver();
            return;
        }
        
        drawNextPiece();
    }
    
    dropCounter = 0;
}

// 快速下落
function hardDrop() {
    while (!collide(currentPiece.shape, {x: currentPiece.x, y: currentPiece.y + 1})) {
        currentPiece.y++;
    }
    drop();
}

// 清除完整行
function clearLines() {
    let linesCleared = 0;
    
    outer: for (let y = ROWS - 1; y >= 0; y--) {
        for (let x = 0; x < COLS; x++) {
            if (board[y][x] === 0) {
                continue outer;
            }
        }
        
        // 移除完整行
        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        y++; // 检查同一行（现在是新行）
        
        linesCleared++;
    }
    
    if (linesCleared > 0) {
        // 更新分数
        lines += linesCleared;
        score += calculateScore(linesCleared);
        
        // 更新等级
        level = Math.floor(lines / 10) + 1;
        
        // 更新下落速度
        dropInterval = 1000 / (level * 0.5);
        
        updateScore();
    }
}

// 计算得分
function calculateScore(linesCleared) {
    const linePoints = [40, 100, 300, 1200]; // 1, 2, 3, 4 行的基础分数
    return linePoints[linesCleared - 1] * level;
}

// 更新分数显示
function updateScore() {
    scoreElement.textContent = score;
    levelElement.textContent = level;
    linesElement.textContent = lines;
}

// 处理键盘输入
function handleKeyPress(e) {
    if (gameOver || isPaused) return;
    
    // 防止空格键触发按钮点击事件
    if (e.keyCode === 32) {
        e.preventDefault(); // 阻止默认行为
    }
    
    switch (e.keyCode) {
        case 37: // 左箭头
            move(-1);
            break;
        case 39: // 右箭头
            move(1);
            break;
        case 40: // 下箭头
            drop();
            break;
        case 38: // 上箭头
            rotate();
            break;
        case 32: // 空格
            hardDrop();
            break;
    }
}

// 游戏循环
function animate(time = 0) {
    if (isPaused) {
        requestId = null;
        return;
    }
    
    const deltaTime = time - lastTime;
    lastTime = time;
    
    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        drop();
    }
    
    draw();
    requestId = requestAnimationFrame(animate);
}

// 添加游戏结束显示函数
function showGameOver() {
    // 绘制半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, COLS, ROWS);
    
    // 绘制游戏结束文本
    ctx.font = '1px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('游戏结束!', COLS / 2, ROWS / 2 - 1);
    ctx.fillText('得分: ' + score, COLS / 2, ROWS / 2);
}

// 初始化游戏
document.addEventListener('DOMContentLoaded', init)