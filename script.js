
// gameState - gameplay or game over screen
var gameState = "game";

/* -------------------------------------------------------------------------- */
/*                       defining the board and objects                       */
/* -------------------------------------------------------------------------- */


/* ------------------------------ board layout ------------------------------ */

var board = document.getElementById("board");
var context = board.getContext("2d");
board.height = window.innerHeight - 50;
board.width = board.height;
var laneWidth = (board.width/3)



/* ----------------------------------- car ---------------------------------- */
var car = {
  // 3 car lanes - 0,1,2 - car starts in the middle
  lane: 1,
  widthX: laneWidth - 40,
  heightY: 100,
}


/* -------------------------------- obstacles ------------------------------- */

// stores a list of all the obstacles
var obstacles = [];

function createObstacle(){
  var newObstacle = {}
  newObstacle.lane = Math.floor(Math.random()*3);
  newObstacle.xPos = 20 + laneWidth*newObstacle.lane;
  newObstacle.yPos = 20;
  newObstacle.widthX = laneWidth - 40;
  newObstacle.heightY = 100;
  obstacles.push(newObstacle);
}



/* -------------------------------------------------------------------------- */
/*                     gameplay - functions, graphics, etc                    */
/* -------------------------------------------------------------------------- */


/* ---------------------- start the game on window load --------------------- */
window.onload = function(){
  startGame();
}


/* -------------------------- start/restart game ---------------------------- */

// changes game state, resets obstacles, sets new game timer
function startGame() {
    gameState = "game";
    obstacles = [];
    createObstacle();
    updateBoard();
    window.timer = setInterval(gameTick, 50);
  }


/* --------------- game tick - this function runs every 50 ms --------------- */
function gameTick() {
    if ((obstacles.length==0) || (obstacles.length<3 && obstacles[0].yPos>300)) {
        createObstacle();
    }

    // for each obstacle - move obstacles down and delete once off the board
    // removeObstacle is bool that checks if an obstacle needs to be removed
    removeObstacle = false;
    for (let i=0; i<obstacles.length; i++) {
      if (obstacles[i].yPos >= board.height) {
        removeObstacle = true;
      } else {
        obstacles[i].yPos += 10;
      }
    }

    if (removeObstacle == true) {obstacles.shift()}
    updateBoard();
    isCollision();
}


/* ------------------------------ update board ------------------------------ */
// resets the board and redraws each element
function updateBoard() {
    if (gameState === "game"){
        
    //   board - resets the board with a black rectangle
        context.fillStyle = "black";
        context.fillRect(0, 0, board.width, board.height);

    // lanes
        context.fillStyle = "grey";
        context.fillRect(laneWidth - 5, 0, 10, board.height);
        context.fillRect((2*laneWidth -5), 0, 10, board.height);

    //   car
        context.fillStyle = "white";
        car.xPos = 20 + (laneWidth*car.lane);
        car.yPos = board.height - car.heightY - 20;
        context.fillRect(car.xPos, car.yPos, car.widthX, car.heightY);

    //   obstacles
        context.fillStyle = "red";
        for (let i=0; i < obstacles.length; i++) {
            context.fillRect(obstacles[i].xPos, obstacles[i].yPos, 
              obstacles[i].widthX, obstacles[i].heightY);
        }   
    }
};


/* --------------------- moving the car with arrow keys --------------------- */
document.addEventListener("keydown", moveCar);
function moveCar(e) {
  if ((e.code == "ArrowLeft") && (car.lane > 0)) {
    car.lane-- ;
    updateBoard();
  } else if ((e.code == "ArrowRight") && (car.lane < 2)) {
    car.lane++ ;
    updateBoard();
  }
};


/* -------------------------------- game over ------------------------------- */
// change gameState to gameOver and clear timer
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


/* --------------------------- collision detection -------------------------- */
// if collision detected - game over
function isCollision() {
  for (let i = 0; i<obstacles.length;i++) {
    if ((car.xPos === obstacles[i].xPos)
        && (car.yPos - obstacles[i].heightY < obstacles[i].yPos)
        && (obstacles[i].yPos < board.height - 20)) {
      gameOver();
    }
  }
}