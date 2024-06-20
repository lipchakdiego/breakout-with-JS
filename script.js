//Stores reference to canvas element to canvas variable
const canvas = document.getElementById('myCanvas');
//stores reference to 2d rendering context, the tool used to paint on canvas
const ctx = canvas.getContext('2d');

// //All instructions go between beginPath() and closePath()
// ctx.beginPath();
// //First 2 variables define top left corner, second 2 variables define width and height
// ctx.rect(20, 40, 50, 50);
// //Defines color for square
// ctx.fillStyle = '#ff0000'
// //Actually paints the square with defined color
// ctx.fill()
// ctx.closePath();

// ctx.beginPath();
// //(x-coordinate, y-coordinate, arc radius, start angle, end angle, direction of drawing (false: clockwise, true: anti-clockwise)(optional))
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = 'green'
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40)
// ctx.strokeStyle = 'rgb(0 0 255 / 50%)'
// ctx.stroke();
// ctx.closePath()

//Define the position the circle is drawn at
let x = canvas.width / 2
let y = canvas.height - 30

//Define change values that will be added to x and y
let dx = (Math.random() * 4) - 2
let dy = -2

//Will hold the radius of the drawn circle
let ballRadius = 10;

//Define a paddle to hit the ball
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2

//Pressed buttons to be defined as boolean variables
let rightPressed = false;
let leftPressed = false;

//Declare interval variable
let interval = 0

//Variables to define bricks
const brickRowCount = 3
const brickColumnCount = 5
const brickWidth = 75
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffestLeft = 30

//Create brick array that has 2d array for the columns then the rows, storing an object containing the x and y coordinate for the brick
const bricks = []
for(let c = 0; c < brickColumnCount; c++){
    bricks[c] = []
    for(let r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1}
    }
}

//Declare variable to track score
let score = 0

//Declare variable to track lives
let lives = 3

//Function to draw the ball on the canvas
const drawBall = () => {
    ctx.beginPath()
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}

//Function to draw the paddle on canvas
const drawPaddle = () => {
    ctx.beginPath()
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
    ctx.fillStyle = '#0095DD'
    ctx.fill()
    ctx.closePath()
}

//Draws all the bricks in array in grid pattern on canvas
const drawBricks = () => {
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            if(bricks[c][r].status === 1){
                const brickX = c * (brickWidth + brickPadding) + brickOffestLeft
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
                bricks[c][r].x = brickX
                bricks[c][r].y = brickY
                ctx.beginPath()
                ctx.rect(brickX, brickY, brickWidth, brickHeight)
                ctx.fillStyle = '#0095DD'
                ctx.fill()
                ctx.closePath()
            }
            
        }
    }
}


const draw = () => {
    //Clears anything previously painted inside the rect
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawBricks()
    drawBall()
    x += dx
    y += dy
    //If ball center position will be at the top wall or bottom wall, reverse y direction
    if (y + dy < ballRadius) {
        dy = -dy
    } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            lives--;
            if(!lives){
                alert('GAME OVER')
                document.location.reload()
            }else{
                x = canvas.width / 2
                y = canvas.height - 30
                dx = ((Math.random() * 4) - 2)
                dy = -2
                paddleX = (canvas.width - paddleWidth) /2
            }
            
        }

    }
    if (x + dx < ballRadius || x + dx > canvas.width - ballRadius) { dx = -dx }
    //If right or left keys are pressed, move paddle position
    drawPaddle()
    drawScore()
    drawLives()
    collisionDetection()
    if (rightPressed) { paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth) }
    if (leftPressed) { paddleX = Math.max(paddleX - 7, 0) }
    requestAnimationFrame(draw)
}

//Fires when a key is pressed down
const keyDownHandler = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
}

//Fires when a key is pressed down
const keyUpHandler = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
}

//Anchors paddle movement to mouse location
const mouseMoveHandler = (e) => {
    const relativeX = e.clientX - canvas.offsetLeft
    if(relativeX > 0 && relativeX < canvas.width){
        paddleX = relativeX - paddleWidth / 2
    }
}

//Collision detection for each brick in the array
const collisionDetection = () => {
    for(let c = 0; c < brickColumnCount; c++){
        for(let r = 0; r < brickRowCount; r++){
            const b = bricks[c][r]
            if(b.status === 1){
                if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                    dy = -dy
                    b.status = 0
                    score++
                    if(score === brickColumnCount * brickRowCount){
                        alert('YOU WIN, CONGRATULATIONS!')
                        document.location.reload()
                    }
                }
            }
            
        }
    }
}

//Draw score function to display score
const drawScore = () => {
    ctx.font = '16px Arial'
    ctx.fillStyle = '#0095DD'
    ctx.fillText(`Score: ${score}`, 8, 20)
}

//Draws life counter on canvas
const drawLives = () => {
    ctx.font = '16px Ariel'
    ctx.fillStyle = '#0095DD'
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20)
}

//Event listeners for keydown and keyup
document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)

//Event listener for mouse movement
document.addEventListener('mousemove', mouseMoveHandler, false)



//Runs when start game button is clicked and begins the drawing
const startGame = () => {
    draw()
}

//Adds listenter to start game button
document.getElementById('runButton').addEventListener('click', () => {
    startGame()
})