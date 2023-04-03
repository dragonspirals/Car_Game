// board
var board = document.getElementById("board");
var context = board.getContext("2d");
var carLane = 1;


document.addEventListener("keydown", moveCar);
var obstacles = [];
var gameState = "game";

// start the game on window load
window.onload = function(){
  startGame();
}

// start/restart game - changes game state, resets obstacles, sets new game timer
function startGame() {
    gameState = "game";
    obstacles = [];
    createObstacle();
    updateBoard();
    window.timer = setInterval(gameTick, 50);
  }

// This function runs every 50 ms
function gameTick() {
    if (obstacles.length<3 && obstacles[0].obstacleY>300) {
        createObstacle();
    }

    // for each obstacle
    for (let i=0; i<obstacles.length; i++) {
        if (obstacles[i].obstacleY == board.height) {
            obstacles.shift();
        } else {
            obstacles[i].obstacleY += 10;
        }
    }
    updateBoard();
    isCollision();
}

// update the board - resets the board and then draws elements
function updateBoard() {
    if (gameState === "game"){
        
    //   board - resets the board with a black rectangle
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);

    // lanes
        context.fillStyle = "grey";
        context.fillRect(295, 0, 10, board.height);
        context.fillRect(595, 0, 10, board.height);

    //   car
        context.fillStyle = "white";
        context.fillRect(20 + 300*(carLane), board.height - 120, 260, 100);

    //   obstacles
        context.fillStyle = "red";
        for (let i=0; i < obstacles.length; i++) {
            context.fillRect(obstacles[i].obstacleX, obstacles[i].obstacleY, 260, 100);
        }   
    }
};

// moving the car with arrow keys
function moveCar(e) {
  if ((e.code == "ArrowLeft") && (carLane > 0)) {
    carLane-- ;
    updateBoard();
  } else if ((e.code == "ArrowRight") && (carLane < 2)) {
    carLane++ ;
    updateBoard();
  }
};

// checks if an obstacle has passed 300
// function obstacleClear(obstacle){
//     return obstacle.obstacleY > 300;
// }


// create an obstacle


function createObstacle(){
    var obstacleLane = Math.floor(Math.random()*3);
    var obstacleX = 20 + 300*obstacleLane;
    let obstacleY = 20;
    var newObstacle = {obstacleX: obstacleX, obstacleY: obstacleY};
    obstacles.push(newObstacle);
    // if (obstacles.every(obstacleClear)) {
    //     obstacles.push(newObstacle)
    // }
}

// game over - change game state, show game over and clear timer
function gameOver() {
    obstacles.length = 0;
    gameState = "gameOver";
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    
    // game over text
    context.fillStyle = "white";
    context.font = "50px Arial";
    context.fillText("Game Over", 300, 250);
    
    //   start over button
    context.font = "30px Arial";
    context.fillText("click to start again", 305, 320);
    board.addEventListener("click", startGame);

    clearInterval(timer);
}


// collision detection - if collision detected - game over
function isCollision() {
  for (let i = 0; i<obstacles.length;i++) {
    if ((20 + 300*(carLane) === obstacles [i].obstacleX)
        && (board.height - 220 < obstacles[i].obstacleY)) {
      gameOver();
    }
  }
}