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
const carImage = document.createElement("img");
carImage.setAttribute("src", "assets\\car.png");


var car = {
  // 3 car lanes - 0,1,2 - car starts in the middle
  lane: 1,
  newLane:1,
  widthX: laneWidth/2,
  speed:20
}
car.heightY = car.widthX*(4/3);
car.yPos = board.height - car.heightY;


// determines car position
function carPosition() {

  // when car is switching lanes, car.newLane will be the lane it's moving towards

  // if the car's lane is the same
  if (car.lane == car.newLane) {
    car.xPos = laneWidth*(car.lane + 1/4);
  } 

  // if the car has reached it's new lane
  else if (Math.abs(laneWidth*(car.newLane + 1/4) - car.xPos) < car.speed) {
    car.lane = car.newLane;
  }

  // car move right
  else if (car.newLane > car.lane) {
    car.xPos += car.speed;
  }

  // car move left
  else if (car.newLane < car.lane) {
    car.xPos -= car.speed;
  }

}

/* -------------------- creating items (obstacles, coins etc.) ------------------- */
function createItem(items){
  var newItem = {}
  newItem.lane = Math.floor(Math.random()*3);
  newItem.xPos = items.laneGap + laneWidth*newItem.lane;
  newItem.yPos = 0;
  newItem.widthX = items.widthX;
  newItem.heightY = items.heightY;


  var collision = false;
  for (let i=0; i<allItems.length; i++) {
    if (allItems[i] != items) {
      if (listCollision(newItem, allItems[i].list, updateBoard)!=false) {
        collision = true;
      }
    }
  }
  if (collision == false) {
    items.list.push(newItem);
  }
  
}


// stores a list of all the obstacles
var obstacles = {
  list:[],
  widthX: laneWidth - 40,
  heightY: 100,
  laneGap:20
}


// stores a list of coins
var coins = {
  list:[],
  widthX: laneWidth/2,
}
coins.laneGap = (laneWidth - coins.widthX)/2;
coins.heightY = coins.widthX;


allItems = [obstacles, coins];

/* -------------------------------------------------------------------------- */
/*                           moving and animation                             */
/* -------------------------------------------------------------------------- */


/* ------------------------------ update board ------------------------------ */
// resets the board and redraws each element
function updateBoard() {
  if (gameState === "game"){
      

    /* ---------------- board - resets the board with a rectangle --------------- */
      context.fillStyle = "grey";
      drawBoard = context.fillRect(0, 0, board.width, board.height);


  /* ---------------------------------- lanes --------------------------------- */
      context.fillStyle = "white";
      drawLane1 = context.fillRect(laneWidth - 5, 0, 10, board.height);
      drawLane2 = context.fillRect((2*laneWidth -5), 0, 10, board.height);


    /* ----------------------------------- car ---------------------------------- */
      drawCar = context.drawImage(carImage, car.xPos, car.yPos, car.widthX, car.heightY);


    /* -------------------------------- obstacles ------------------------------- */
      context.fillStyle = "pink";
      for (let i=0; i < obstacles.list.length; i++) {
          context.fillRect(obstacles.list[i].xPos, obstacles.list[i].yPos, 
            obstacles.list[i].widthX, obstacles.list[i].heightY);
      }   



      /* ---------------------------------- coins --------------------------------- */
      context.fillStyle = "yellow";
      for (let i=0; i < coins.list.length; i++) {
          context.beginPath();
          context.arc(coins.list[i].xPos+coins.widthX/2, coins.list[i].yPos+coins.widthX/2,
             coins.widthX/2, 0, 2*Math.PI);
          context.fill();
      } 

      /* ---------------------------------- score --------------------------------- */
      window.scoreText = "Score: " + score;
      context.fillStyle = "white";
      context.font = "20px Arial";
      context.fillText(scoreText, board.width -200, 50);
  }
};



/* --------------- game tick - this function runs every 50 ms --------------- */
function gameTick() {

  // create obstacles.list
  if ((obstacles.list.length==0) || (obstacles.list.length<3 && obstacles.list[0].yPos>300)) {
      createItem(obstacles);
  }

  // create coins
  if (coins.list.length==0) {
    createItem(coins);
  }

  carPosition();
  moveItems(obstacles);
  moveItems(coins);

  listCollision(car, obstacles.list, gameOver);
  listCollision(car, coins.list, collectCoin);
  updateBoard();
}



/* -------------------------- move items downwards -------------------------- */
// deletes items that have reached the end of the board

function moveItems(items) {

  // this function should run every set interval. 
  // items should be stored in a list

  var removeItem = false;
  for (let i=0; i<items.list.length; i++) {
    if (items.list[i].yPos >= board.height) {
      removeItem = true;
    } else {
      items.list[i].yPos += 10;
    }
  }
  if (removeItem == true) {items.list.shift()}
}



function collectCoin(i) {
  score+=1;
  coins.list.splice(i, 1);
}





/* --------------------- moving the car with arrow keys --------------------- */
document.addEventListener("keydown", moveCar);
function moveCar(e) {
  if ((e.code == "ArrowLeft") && (car.lane > 0)) {
    car.newLane-- ;
    updateBoard();
  } else if ((e.code == "ArrowRight") && (car.lane < 2)) {
    car.newLane++ ;
    updateBoard();
  }
};


/* -------------------------------------------------------------------------- */
/*                          starting and ending game                          */
/* -------------------------------------------------------------------------- */


/* ---------------------- start the game on window load --------------------- */
window.onload = function(){
  startGame();
  
}


/* -------------------------- start/restart game ---------------------------- */
// changes game state, resets obstacles.list, sets new game timer
function startGame() {

    gameState = "game";
    obstacles.list = [];
    score = 0;

    car.xPos = 20 + (laneWidth*car.lane);
    createItem(obstacles);
    updateBoard();
    timer = setInterval(gameTick, 50);
    board.removeEventListener("click", startGame);
  }


/* -------------------------------- game over ------------------------------- */
// change gameState to gameOver and clear timer
function gameOver() {
    obstacles.list.length = 0;
    gameState = "gameOver";
    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);
    
    // game over text
    context.fillStyle = "white";
    context.font = "50px Arial";
    context.fillText("Game Over", board.width/3, board.height/2);

    // score
    context.font = "30px Arial";
    context.fillText(scoreText, board.width/3, board.height/2 + 75);
    
    //   start over button
    context.fillText("click to start again", board.width/3 , board.height/2 + 150);
    startClick = board.addEventListener("click", startGame);

    clearInterval(timer);
}


/* --------------------------- collision detection -------------------------- */
// if collision detected - game over
function obstacleCollision() {
  for (let i = 0; i<obstacles.list.length;i++) {

    if ((car.yPos >= obstacles.list[i].yPos-car.heightY )
    && (car.yPos <= obstacles.list[i].yPos+obstacles.list[i].heightY)
    && (car.xPos >= obstacles.list[i].xPos-car.widthX )
    && (car.xPos <= obstacles.list[i].xPos+obstacles.list[i].widthX)) {
      gameOver();
    }


    
  }
}

function isCollision(objectA, objectB) {
  if ((objectA.yPos >= objectB.yPos-objectA.heightY )
    && (objectA.yPos <= objectB.yPos+objectB.heightY)
    && (objectA.xPos >= objectB.xPos-objectA.widthX )
    && (objectA.xPos <= objectB.xPos+objectB.widthX)) {
      return true;
    } else {
      return false;
    }
}

function listCollision(objectA, list, action) {

  var collision = false
  for (let i=0; i<list.length; i++) {
    if (isCollision(objectA, list[i])) {
      action();
      collision = true
      return i;
    }
  }

  if (collision == false) {
    return false;
  }
}
