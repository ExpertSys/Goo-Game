$(document).ready(function(){
  startGame();
  $("#stage-select").hide();
  $("#draw-system-ui").hide();
  $("#mainMenu-Btn").hide();
  $("#player").css("display","none");
  window.addEventListener("keydown", function(e) {
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
  }, false);
  
})

/* Player */
let speed = 0;
let currDir = '';
let playerItems = [];

/* Npc */
let npcSpeed = 0;

/* Game */
let gameObjects = [];
let drawDistance = [];
let gameWalls = [];
let gameItems = [];
let level = 0;

/* Drawing walls */
var bMouseDown = false;
let drawActive=false;
let totalX = 0;
let totalY = 0;
let startingPos = 0;
let t = 0;

function drawPath(width, height, color, x, y, r, id){
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;

  let map = document.getElementById("map");
  let draw = document.createElement("div");
  draw.setAttribute("id", "drawing");
  draw.setAttribute("class", id);
  draw.style.width = width + "px";
  draw.style.height = height + "px";
  draw.style.backgroundColor = color;
  draw.style.left = x + "px";
  draw.style.top = y + "px";
  draw.style.borderRadius = r + "px";
  map.appendChild(draw);

  drawDistance.push(this);
}

function walls(width, height, color, x, y, r, id, className, dataID){
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;
  this.c = className;
  this.className = className;
  this.dataID = dataID;
  this.color = color;

  let map = document.getElementById("map");
  let newWall = document.createElement("div");
  newWall.setAttribute("id", "wall");
  newWall.setAttribute("class", className);
  newWall.setAttribute("data-id", dataID);
  newWall.setAttribute("data-x", x);
  newWall.setAttribute("data-y", y);
  newWall.style.width = width + "px";
  newWall.style.height = height + "px";
  newWall.style.backgroundColor = color;
  newWall.style.left = x + "px";
  newWall.style.top = y + "px";
  newWall.style.borderRadius = r + "px";
  map.appendChild(newWall);

  gameWalls.push(this);
}

function object(width, height, color, x, y, r, id, className, dataID){
    /* Player character module */
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.r = r;
    this.id = id;
    this.className = className;
    this.dataID = dataID;

    /* Player stats */
    this.inventory = {
      0: {},
      1: {},
      2: {},
      3: {},
      4: {},
    }

    let map = document.getElementById("map");
    let newPlayer = document.createElement("div");
    newPlayer.setAttribute("id", "player");
    newPlayer.setAttribute("class", className);
    newPlayer.setAttribute("data-id", dataID);
    newPlayer.style.width = width + "px";
    newPlayer.style.height = height + "px";
    newPlayer.style.left = x + "px";
    newPlayer.style.top = y + "px";
    newPlayer.style.borderRadius = r + "px";

    map.appendChild(newPlayer);

    this.update = function() {
      if(currDir==='left' || currDir==='right'){
        this.speedY = 0;
        $("#player").animate({left: "+="+this.speedX}, 0);
      } 
      else{
        this.speedX = 0;
        $("#player").animate({top: "+="+this.speedY}, 0);
      }
    }

    this.crashWith = function(otherobj) {
    //If the shape is vertical
    if(otherobj.width <= 30){
    //left side
    if(this.x > otherobj.x - Number(otherobj.width)
    && this.x < otherobj.x - otherobj.width + Number(this.width)
    && this.y + Number(this.height) > Number(otherobj.y) && this.y < (Number(otherobj.y) + Number(otherobj.height))
     ){
      this.x = otherobj.x - Number((otherobj.width));
      $("#player").animate({left: otherobj.x - Number((otherobj.width))}, 0);
      $("#hitbox").css('border', '2px solid red');
      var crash = true;
    }

    //right side
    if(this.x > otherobj.x - otherobj.width && this.x < otherobj.x - otherobj.width + Number(this.width) + Number(this.width)
      && this.y + Number(this.height) > Number(otherobj.y) && this.y < (Number(otherobj.y) + Number(otherobj.height))){
      this.x = otherobj.x + Number((otherobj.width));
      $("#player").animate({left: otherobj.x + Number((otherobj.width))}, 0);
      $("#hitbox").css('border', '2px solid red');
      var crash = true;
      }
    } 
    
    //If the shape is horizontal
    else{
    //top side
    if(this.y > otherobj.y - (Number(otherobj.height))
    && this.y < (Number(otherobj.y))
    && this.x > Math.abs((Number(otherobj.height) - Number(otherobj.x)))
    && this.x < (Number(otherobj.width) + Number(otherobj.height) + Number(otherobj.x) - Number(this.width))){
      this.y = otherobj.y - (Number(otherobj.height));
      $("#player").animate({top: otherobj.y - (Number(otherobj.height))}, 0);
      $("#hitbox").css('border', '2px solid red');
      var crash = true;
    }
    
    //bottom side
    if(this.y < (Number(otherobj.y) + Number(this.height))
    && this.y > (Number(otherobj.y))
    && this.x > Math.abs((Number(otherobj.height) - Number(otherobj.x)))
    && this.x < (Number(otherobj.width) + Number(otherobj.height) + Number(otherobj.x) - Number(this.width))){
      this.y = (otherobj.y + Number(this.height));
      $("#player").animate({top: (otherobj.y + Number(this.height))}, 0);
      $("#hitbox").css('border', '2px solid red');
      var crash = true;
    }
    }
    return crash;
    }
    gameObjects.push(this);
}

function item(width, height, color, x, y, r, id){
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;
  this.c = id;

  let map = document.getElementById("map");
  let nItem = document.createElement("div");
  let itemHitBox = document.createElement("div");

  itemHitBox.setAttribute("class", "itemHitBox");
  itemHitBox.style.width = "30px";
  itemHitBox.style.height = "30px";
  itemHitBox.style.position = "absolute";
  itemHitBox.style.left = (width - width / 1) + "px";
  itemHitBox.style.width=width-30+"px";
  itemHitBox.style.height=height+"px"

  nItem.append(itemHitBox);
  nItem.setAttribute("id", "item");
  nItem.setAttribute("class", id);
  nItem.style.width = width + "px";
  nItem.style.height = height + "px";
  nItem.style.backgroundColor = color;
  nItem.style.left = x + "px";
  nItem.style.top = y + "px";
  nItem.style.borderRadius = r + "px";
  map.appendChild(nItem);

  this.crashWith = function(otherobj) {
    if(otherobj.width <= 30){
      //left side
      if(this.x > otherobj.x - Number(otherobj.width)
      && this.x < otherobj.x - otherobj.width + Number(this.width)
      && this.y > Number(otherobj.y) && this.y < (Number(otherobj.y) + Number(otherobj.height))
       ){
        this.x = otherobj.x - Number((otherobj.width));
        $(".npc").animate({left: otherobj.x - Number((otherobj.width))}, 0);
        var crash = true;
      }
      //right side
      if((this.x) > otherobj.x - otherobj.width && this.x < otherobj.x - otherobj.width + Number(this.width) + Number(this.width) + 20
        && (this.y) > Number(otherobj.y) && this.y < (Number(otherobj.y) + Number(otherobj.height))){
        this.x = otherobj.x + Number((otherobj.width));
        $(".npc").animate({left: otherobj.x + Number((otherobj.width))}, 0);
        var crash = true;
        }
      } 
      //If the shape is horizontal
      else{
      //top side
      if(this.y > otherobj.y - (Number(otherobj.height))
      && this.y < (Number(otherobj.y))
      && this.x > Math.abs((Number(otherobj.height) - Number(otherobj.x)))
      && this.x < (Number(otherobj.width) + Number(otherobj.height) + Number(otherobj.x) - Number(this.width))){
        this.y = otherobj.y - (Number(otherobj.height));
        $(".npc").animate({top: otherobj.y - (Number(otherobj.height))}, 0);
        var crash = true;
      }
      //bottom side
      if((this.y) < (Number(otherobj.y) + Number(this.height))
      && this.y > (Number(otherobj.y))
      && this.x > Math.abs((Number(otherobj.height) - Number(otherobj.x)))
      && this.x < (Number(otherobj.width) + Number(otherobj.height) + Number(otherobj.x) - Number(this.width))){
        this.y = (otherobj.y + Number(this.height));
        $(".npc").animate({top: (otherobj.y + Number(this.height))}, 0);
        var crash = true;
      }
    }
    var crash = true;
    return crash;
  }

}

function floorItems(width, height, img, x, y, r, id, stage){
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.r = r;
  this.id = id;
  this.c = id;
  this.stage = stage;

  let map = document.getElementById("map");
  let nItem = document.createElement("div");
  let itemHitBox = document.createElement("div");

  itemHitBox.setAttribute("class", "itemHitBox");
  itemHitBox.style.width = "30px";
  itemHitBox.style.height = "30px";
  itemHitBox.style.position = "absolute";
  itemHitBox.style.backgroundImage = "url('images/character-left.png')";
  itemHitBox.style.backgroundSize = "cover";

  itemHitBox.style.left = (width - width / 1) + "px";
  itemHitBox.style.width=width-30+"px";
  itemHitBox.style.height=height+"px"

  nItem.append(itemHitBox);
  nItem.setAttribute("id", "item");
  nItem.setAttribute("class", id);
  nItem.style.width = width + "px";
  nItem.style.height = height + "px";
  nItem.style.backgroundImage = `url('images/${img}.png')`;
  nItem.style.backgroundSize = "cover";
  nItem.style.backgroundPosition = "center";
  nItem.style.left = x + "px";
  nItem.style.top = y + "px";
  nItem.style.borderRadius = r + "px";
  map.appendChild(nItem);

  gameItems.push(this);
}

function checkIfTouchItem(item){
  let el = document.querySelectorAll('.itemHitBox');
  for(let x = 0; x < el.length; x++){
    $(".npc").animate({left: item.x, top: item.y}, 0);
    if((player.x+50) > item.x
    && (player.x-16) < (Number(item.x) + Number(item.width))
    && (player.y+50) > item.y
    && (player.y-30) < (Number(item.y) + Number(item.height))){
      // console.log("You passed x");
    }
  }
  return item;
}

function spawnItem(item, x, y){
  item.x = x;
  item.y = y;
  grabItem = "." + ''+ item.c+'';
  $(`${grabItem}`).animate({left: x, top: y}, 0);
}

function spawnRandLocation(item){
  x = Math.floor(Math.random() * (400 - 100));
  y = Math.floor(Math.random() * (400 - 100));
  let lx = item.x = x;
  let ly = item.y = y;
  $(".apple").animate({left: lx, top: ly}, 0);

  let dY = player.y - item.y;
  let dX = player.x - item.x;
  let tDistance = 30;

  if(Math.sqrt(dY * dY + dX * dX)
    < tDistance){
      item.x = x;
      item.y = y;
      $(".apple").animate({left: x, top: y}, 0);
    } else{
      // npc did not spawn on player
  }
}

function respawnItem(item){
  x = Math.floor(Math.random() * (400 - 30));
  y = Math.floor(Math.random() * (400 - 30));
  item.x = x;
  item.y = y;
  $(".apple").animate({left: x, top: y}, 0);
  return item;
}

let stage = [
  [
    [],
    [700, "30", "#333", 0, 0, '', 'stage', '1'],

    [730, "30", "#333", 0, 600, '', 'stage', '1'],

    ["30", 600, "#333", 0, 0, '', 'stage', '1'],

    ["30", 600, "#333", 700, 0, '', 'stage', '1'],

    [213, "30", "#333", 398, 356, 0, '', 'stage', '1'],

    ["30", 201, "#333", 280, 318, 0, '', 'stage', '1'],
    
    [210, "30", "#333", 98, 355, 0, '', 'stage', '1'],
    
    [240, "30", "#333", 128, 176, 0, '', 'stage', '1'],
    
    ["30", 245, "#333", 610, 68, 0, '', 'stage', '1'],
    
    ["30", 178, "#333", 400, 68, 0, '', 'stage', '1'],
    
    [240, "30", "#333", 400, 68, 0, '', 'stage', '1'],
    
    [188, "30", "#333", 98, 67, 0, '', 'stage', '1'],
    
    ["30", 33, "#333", 188, 570, 0, '', 'stage', '1'],
    
    ["30", 31, "#333", 70, 570, 0, '', 'stage', '1'],
    
    ["30", 34, "#333", 307, 570, 0, '', 'stage', '1'],
    
    [216, "30", "#333", 397, 463, 0, '', 'stage', '1'],
    
    [45, "35", "#333", 28, 138, 0, '', 'stage', '1'],
    
    ["30", 247, "#333", 68, 138, 0, '', 'stage', '1'],
  ],


  [
    [],

    [700, "30", "#333", 0, 0, '', 'stage', '2'],

    [730, "30", "#333", 0, 600, '', 'stage', '2'],

    ["30", 600, "#333", 0, 0, '', 'stage', '2'],

    ["30", 600, "#333", 700, 0, '', 'stage', '2'],

    [194, "30", "#333", 30, 463, 0, '', 'stage', '2'],

    ["30", 102, "#333", 223, 463, 0, '', 'stage', '2'],
    
    [90, "30", "#333", 322, 464, 0, '', 'stage', '2'],
    
    ["30", 36, "#333", 353, 493, 0, '', 'stage', '2'],
    
    [216, "30", "#333", 488, 465, 0, '', 'stage', '2'],
    
    ["30", 71, "#333", 488, 494, 0, '', 'stage', '2'],
    
    [383, "30", "#333", 158, 318, 0, '', 'stage', '2'],
    
    ["30", 40, "#333", 431, 278, 0, '', 'stage', '2'],
    
    ["30", 40, "#333", 250, 278, 0, '', 'stage', '2'],
    
    [385, "30", "#333", 157, 213, 0, '', 'stage', '2'],
    
    ["30", 36, "#333", 337, 243, 0, '', 'stage', '2'],
    
    ["30", 137, "#333", 71, 213, 0, '', 'stage', '2'],
    
    ["30", 136, "#333", 607, 213, 0, '', 'stage', '2'],
    
    [196, "30", "#333", 27, 105, 0, '', 'stage', '2'],
    
    ["30", 106, "#333", 282, 30, 0, '', 'stage', '2'],
    
    [152, "30", "#333", 548, 104, 0, '', 'stage', '2'],
  ],


  [
    [],

    [700, "30", "#333", 0, 0, '', 'stage', '3'],

    [730, "30", "#333", 0, 600, '', 'stage', '3'],

    ["30", 600, "#333", 0, 0, '', 'stage', '3'],

    ["30", 600, "#333", 700, 0, '', 'stage', '3'],

    [282, "30", "#333", 98, 213, 0, '', 'stage', '3'],

    [236, "30", "#333", 278, 285, 0, '', 'stage', '3'],

    [297, "30", "#333", 98, 393, 0, '', 'stage', '3'],

    [285, "30", "#333", 365, 535, 0, '', 'stage', '3'],

    ["30", 457, "#333", 620, 106, 0, '', 'stage', '3'],

    [431, "30", "#333", 218, 104, 0, '', 'stage', '3'],

    ["30", 142, "#333", 365, 423, 0, '', 'stage', '3'],

    [64, "30", "#333", 28, 104, 0, '', 'stage', '3'],

    ["30", 31, "#333", 217, 30, 0, '', 'stage', '3'],
  ],

[
  [],

  [700, "30", "#333", 0, 0, '', 'stage', '4'],

  [730, "30", "#333", 0, 600, '', 'stage', '4'],

  ["30", 600, "#333", 0, 0, '', 'stage', '4'],

  ["30", 600, "#333", 700, 0, '', 'stage', '4'],

  ["30", 215, "#333", 343, 131, 0, '', 'stage', '4'],

  [237, "30", "#333", 343, 320, 0, '', 'stage', '5'],
  
  ["30", 207, "#333", 550, 141, 0, '', 'stage', '4'],
  
  [361, "30", "#333", 223, 463, 0, '', 'stage', '4'],
  
  [276, "30", "#333", 308, 537, 0, '', 'stage', '4'],
  
  ["30", 207, "#333", 223, 285, 0, '', 'stage', '4'],
  
  ["30", 102, "#333", 554, 465, 0, '', 'stage', '4'],
  
  [275, "30", "#333", 98, 104, 0, '', 'stage', '4'],
],

[
  [],

  [700, "30", "#333", 0, 0, '', 'stage', '5'],

  [730, "30", "#333", 0, 600, '', 'stage', '5'],

  ["30", 600, "#333", 0, 0, '', 'stage', '5'],

  ["30", 600, "#333", 700, 0, '', 'stage', '5'],

  [522, "30", "#333", 100, 140, 0, '', 'stage', '5'],

  [523, "30", "#333", 98, 247, 0, '', 'stage', '5'],

  [526, "30", "#333", 98, 356, 0, '', 'stage', '5'],

  [530, "30", "#333", 97, 464, 0, '', 'stage', '5'],
  ],

  [
    []
  ]
]

function createLevel(){
  for(let x = 0; x < stage[(level)].length; x++){
    wall = new walls(
      stage[(level)][x][0], // Wall Width
      stage[(level)][x][1], // Wall Height
      stage[(level)][x][2], // Wall Color
      stage[(level)][x][3], // Wall X
      stage[(level)][x][4], // Wall Y
      stage[(level)][x][5], // Wall Radius
      stage[(level)][x][6], // Wall Id
      stage[(level)][x][7], // Wall Level
      stage[(level)][x][8]  // Wall Data ID
    ); 
  }
}

function checkStageProgress(){
  let checkProgress = {
    0: ['apple', 'pear'],
    1: ['pizza','burger','hotdog'],
    2: ['pretzel', 'donut', 'crossiant'],
    3: ['cucumber','broccoli','eggplant'],
    4: ['coffee','cola','milk','orange']
  }
  
  let stageItems = [];

  for(let i in player.inventory[level]){
    let collectedItems = player.inventory[level].id;

    if(!playerItems.includes(collectedItems)){
      playerItems.push(collectedItems);
    }
  }
  for(let x in checkProgress[level]){
    let items = checkProgress[level][x];
    stageItems.push(items);
  }
  // console.log(playerItems, stageItems); // Displays current items & stage items

  var isSameSet = function( arr1, arr2 ) {
    return  $( arr1 ).not( arr2 ).length === 0 && $( arr2 ).not( arr1 ).length === 0;  
  }
  if(isSameSet( playerItems, stageItems )){
    level++;
    clearStage();
    spawnFloorItems();
    createLevel();
    speed = 0;
    npcSpeed = 0;
    setTimeout(function(){
      speed = 5;
      npcSpeed = 3;
    }, 2000)
    spawnItem(player, 49, 53);
    spawnItem(npc, 511, 141);
    $("#curr-level").html(level);
    $("#stageMessage").fadeIn(1500).fadeOut(1500);
    if(level === 5){
      mainScreen();
    }
  } else{
    //Player hasn't collected all the floor items.
  }
}

function clearStage(){
  let stages = document.querySelectorAll('.stage');
  for(let x = 0; x < stages.length; x++){
    let id = stages[x].getAttribute('data-id');
    if(id !== level){
      stages[x].style.display = 'none';
      for(let x = 0; x < gameWalls.length; x++){
        gameWalls[x] = 0;
      }
    }
  }
}

function touchObj(item){
  let dY = player.y - item.y;
  let dX = player.x - item.x;
  let tDistance = 30;
  
  if(Math.sqrt(dY * dY + dX * dX)
    < tDistance){
      player.inventory[level].id = item.c;
      spawnItem(item, 9999, 9999);
      $("#itemPickup").trigger("play");
      checkStageProgress();
    } else{
  }
}

function touchEnemy(item){
  let dY = player.y - item.y;
  let dX = player.x - item.x;
  let tDistance = 30;
  
  if(Math.sqrt(dY * dY + dX * dX)
    < tDistance){
      spawnItem(player, 50, 50);
      spawnItem(npc, 512, 155);
      speed = 0;
      npcSpeed = 0;
      setTimeout(function(){
        speed = 5;
        npcSpeed = 3;
      }, 2000);
      $("#stageMessage").fadeIn(1500).fadeOut(1500);
    } else{
  }
}

function deleteWall(){
  let wallData = document.getElementById("map");
  let textOutput = document.querySelectorAll(".wallInformation");
  let tX;
  let tY;

  wallData.addEventListener('click', function(e){
      gameWalls.forEach(function(v){
        let width = e.target.offsetWidth;
        let height = e.target.offsetHeight;
        let wallX = e.target.getAttribute('data-x');
        let wallY = e.target.getAttribute('data-y');

        if(parseInt(width) === parseInt(v.width) && parseInt(height) === parseInt(v.height)
        && parseInt(wallX) === parseInt(v.x) && parseInt(wallY) === parseInt(v.y)){
          e.target.style.visibility = 'hidden';
          for(let x = 0; x < textOutput.length; x++){
            tX = textOutput[x].getAttribute("data-x");
            tY = textOutput[x].getAttribute("data-y");
            if(parseInt(tX) === parseInt(v.x) && parseInt(tY) === parseInt(v.y)){
              textOutput[x].style.display='none'; //Delete map code from output.
              v.x = 9000;
              v.y = 9000;
            }
          }
        }
      })
  })
}

// Display information about a wall
function getWallData(){
  let wallData = document.getElementById("map");
  wallData.addEventListener('click', function(e){
    let stageName = e.target;
    // console.log(stageName);
  })
}

function drawHitBox(px, py, ex, ey, w, l, x, y){
  let distanceY = py - ey;
  let distanceX = px - ex;
  let touchDistance = 30;
  let hitBox = document.createElement("hitbox");
  hitBox.setAttribute("id", "hitbox");

  $("#hitbox").css('position', 'absolute');
  $("#hitbox").css('left', '-12px');
  $("#hitbox").css('top', '-12px');
  $("#hitbox").css('padding', '25px');
  $("#hitbox").css('border', '2px solid blue');
  $("#hitbox").css('border-radius', '50%');
  $("#player").append(hitBox);
  
  if(Math.sqrt(distanceY * distanceY + distanceX * distanceX)
    < touchDistance){
      x = Math.floor(Math.random() * (400 - 30));
      y = Math.floor(Math.random() * (400 - 30));
      $("#hitbox").css('border', '2px solid red');
    } else{
      $("#hitbox").css('border', '2px solid blue');
      createLevel();
  }
}

function createMapGrid(){
  let columns = 368;
  var map = document.getElementById("map");

  for(var x = 0; x < columns; x++){
    var square = document.createElement("div");
    square.className = "coordinate";
    square.setAttribute("map_id", x);
   map.appendChild(square);
  }
}

function generateWalls(){
  let w;
  let l;
  let x;
  let y;
  w = Math.floor(Math.random() * 120);
  l = Math.floor(Math.random() * 120);
  x = Math.floor(Math.random() * (400 - 70));
  y = Math.floor(Math.random() * (400 - 70));

  if(w > l){
    l = 30/100 * w;
    if(l < 30){
      l = 30;
      w += 60;
    }
  } else{
    w = 30/100 * l;
    if(w < 30){
      w = 30;
      l += 60;
    }
  }
  drawHitBox(player.x, player.y, x, y, w, l, x, y);
}

function trail(){
  let grabItem = "." + ''+ playerTrail.c+'';

  if(player.x - 3 > playerTrail.x){
    $(`${grabItem}`).animate({left: "+=4.8"}, 0);
    playerTrail.x += 4.8;
  }
  if(player.x + 5 < playerTrail.x){
    $(`${grabItem}`).animate({left: "-=4.8"}, 0);
    playerTrail.x -= 4.8;
  }
  if(player.y - 10 > playerTrail.y){
    $(`${grabItem}`).animate({top: "+=4.8"}, 0);
    playerTrail.y += 4.8;
  }
  if(player.y + 10 < playerTrail.y){
    $(`${grabItem}`).animate({top: "-=4.8"}, 0);
    playerTrail.y -= 4.8;
  }
}

function aiPathFinder(unit, target){
    let grabItem = "." + ''+ unit.c+'';

    if(target.x > unit.x){
      //target is to the right of the npc.
      $(`${grabItem}`).animate({left: `+=${npcSpeed}`}, 0);
      unit.x += npcSpeed;
    }
    if(target.x < unit.x){
      //target is to the left of the npc.
      $(`${grabItem}`).animate({left: `-=${npcSpeed}`}, 0);
      unit.x -= npcSpeed;
    }
    if(target.y > unit.y){
      //target is underneath the npc.
      $(`${grabItem}`).animate({top: `+=${npcSpeed}`}, 0);
      unit.y += npcSpeed;
    }
    if(target.y < unit.y){
      //target is above the npc.
      $(`${grabItem}`).animate({top: `-=${npcSpeed}`}, 0);
      unit.y -= npcSpeed;
    }
}

function spawnFloorItems(){
  /* Level 1 Items */
  apple = new floorItems("20", "20", "apple", 160, 40, 0, "apple", 0);
  pear = new floorItems("20", "30", "pear", 40, 186, 0, "pear", 0); 
  /* Level 2 Items */
  pizza = new floorItems("33", "38", "pizza", 611, 514, 0, "pizza", 1); 
  burger = new floorItems("35", "30", "burger", 101, 516, 0, "burger", 1); 
  hotdog = new floorItems("46", "25", "hotdog", 614, 61, 0, "hotdog", 1); 
  /* Level 3 Items */
  pretzel = new floorItems("37", "23", "pretzel", 518, 466, 0, "pretzel", 2); 
  donut = new floorItems("35", "35", "donut", 660, 300, 0, "donut", 2);
  crossiant = new floorItems("45", "30", "crossiant", 281, 478, 0, "crossiant", 2);
  /* Level 4 Items */
  broccoli = new floorItems("45", "40", "broccoli", 462, 254, 0, "broccoli", 3);
  cucumber = new floorItems("45", "20", "cucumber", 488, 507, 0, "cucumber", 3);
  eggplant = new floorItems("45", "45", "eggplant", 458, 385, 0, "eggplant", 3);
  /* Level 5 Items */
  coffee = new floorItems("30", "30", "coffee", 344, 417, 0, "coffee", 4);
  cola = new floorItems("25", "40", "cola", 347, 300, 0, "cola", 4);
  milk = new floorItems("35", "40", "milk", 340, 187, 0, "milk", 4);
  orange = new floorItems("35", "35", "orange", 340, 80, 0, "orange", 4);
  /* Remove items if level is not it's stage level. */
  gameItems.forEach(function(e){
    if(level !== e.stage){
      playerItems = [];
      spawnItem(e, 9999, 9999);
    }
  })
}

function clearMap(){
  gameWalls.forEach(function(e){
    grabItem = "." + ''+ e.c+'';
    if(e.className !== "mapBorder" ){
      $(`${grabItem}`).css('display','none');
      e.x = 9999;
      e.y = 9999;
    }
  })
  gameItems.forEach(function(e){
    spawnItem(e, 9999, 9999);
  })
  spawnItem(npc, 9999, 9999);
}

function stageSelect(value){
  level = value;
  $("#stage-select").hide();
  clearMap();
  normalMode();
  speed = 0;
  npcSpeed = 0;
}

function showStages(){
  $("#mainMenu").hide();
  $("#stage-select").show();
  $("#mainMenu-Btn").show();
}

function mainScreen(){
  drawActive = false;
  $("#mainMenu").show();
  $("#draw-system-ui").hide();
  $("#stageMessage").hide();
  $("#stage-select").hide();
  $("#mainMenu-Btn").hide();
  $(".drawing-instructions").css("display","none");
  $("#player").css("display","none");
  $("#levelOneTrack").trigger("pause");
  $("#track4").trigger("pause");
  $("#track5").trigger("pause");
  // $("#menuTrack").trigger("play");
  $(".coordinate").hover(function(){
    $(".coordinate").removeClass('coordHover');
  })
  
  clearMap();
  speed = 0;
  npcSpeed = 0;
  player.speedY = 0;
  player.speedX = 0;
  level = 0;
}

function startGame() {
  mapTopBorder = new walls("700", "30", "#333", 0, 0, 0, '', 'mapBorder', '999');
  mapBottomBorder = new walls("730", "30", "#333", 0, 600, 0, '', 'mapBorder', '999');
  mapLeftBorder = new walls("30", "600", "#333", 0, 0, 0, '', 'mapBorder', '999');
  mapRightBorder = new walls("30", "600", "#333", 700, 0, 0, '', 'mapBorder', '999');
  player = new object("30", "30", "", 50, 50);
  npc = new item("20", "40", "rgb(177, 72, 72)", 9999999, 9999999, 50, "npc");
  myGameArea.start();
}

function normalMode(){
  drawActive = false;
  $(".coordinate").hover(function(){
    $(".coordinate").removeClass('coordHover');
  })
  $("#coords").css("visibility","hidden");
  // $("#levelOneTrack").trigger("play");
  $("#menuTrack").trigger("pause");
  $("#mainMenu-Btn").show();
  spawnItem(player, 50, 50);
  $("#player").css("display","block");
  $("#mainMenu").hide();
  $("#draw-system-ui").hide();
  // playerTrail = new item(30, 30, "blue", player.x - 3, player.y, 0, 'trail');
  npc = new item("20", "40", "rgb(177, 72, 72)", 525, 155, 50, "npc");
  generateWalls();
  setTimeout(function(){
    speed = 5;
    npcSpeed = 3;
  }, 2000)
  spawnFloorItems();
  getWallData();
  $("#curr-level").html(level);
  $("#stageMessage").fadeIn(1500).fadeOut(1500);
  $(".drawing-instructions").css("display","none");
}

function developerMode(){
  drawActive = true;
  $(".coordinate").hover(function(){
    $(".coordinate").removeClass('coordHover');
    $(this).addClass('coordHover');
  })
  $("#coords").css("visibility","visible");
  $("#mainMenu-Btn").hide();
  spawnItem(player, 50, 50);
  $("#player").css("display","block");
  $("#mainMenu").hide();
  $("#draw-system-ui").show();
  speed = 5;
  npc = new item("20", "40", "rgb(177, 72, 72)", 525, 155, 50, "npc");
  generateWalls();
  spawnFloorItems();
  getWallData();
  $("#curr-level").html(level);
  $("#stageMessage").fadeIn(1500).fadeOut(1500);
}

var myGameArea = {
  start: function() {
    this.interval = setInterval(updateGameArea, 20);
    $("#menuTrack").trigger("play");
  },
  clear: function() {
  },
  stop: function() {
    clearInterval(this.interval);
  }
}

function updateGameArea() {
    for(let x = 1; x < gameWalls.length; x++){
      if(player.crashWith((gameWalls[x]))){
      }
      if(npc.crashWith((gameWalls[x]))){
      }
    }
    player.x += player.speedX;
    player.y += player.speedY;
    player.update();
    aiPathFinder(npc, player);
    // trail(playerTrail, player);
    gameItems.forEach(function(v){
      touchObj(v);
    })
    touchEnemy(npc);
  }
  document.onkeydown = checkKeyD;

function checkKeyD(e) {
  e = e || window.event;
  // up arrow
  if (e.keyCode == '38') {
    player.speedY = -speed;
    currDir='up';
  } 
  // down arrow
  else if (e.keyCode == '40') {
    player.speedY = speed;
    currDir='down';
  } 
  // left arrow
  else if (e.keyCode == '37') {
    player.speedX = -speed;
    currDir='left';
    document.getElementById("player").style.backgroundImage = "url('images/character-left.png')";
  } 
  // right arrow
  else if (e.keyCode == '39') {
    player.speedX = speed;
    currDir='right';
    document.getElementById("player").style.backgroundImage = "url('images/character.png')";
  }
}
document.onkeyup = clearmove;

function clearmove() {
  $("#hitbox").css('border', '2px solid blue');
  player.speedX = 0;
  player.speedY = 0;
}

var oPreviousCoords = {
    'x': 0,
    'y': 0
}

$("#map").on('mousedown', function (oEvent) {
  bMouseDown = true;
  totalX = 0;
  totalY = 0;
  startingPos = oEvent.clientX;
  startingPosY = oEvent.clientY;
  oPreviousCoords = {
      'x': oEvent.clientX,
      'y': oEvent.clientY
  }
  startingPosNewY = startingPosY;
});
  
$("#map").on('mouseup', function (oEvent) {
    bMouseDown = false;
    let endingPos = oEvent.clientY;
    let xPos = oEvent.clientX;
    let width = t-startingPos;
    let widthHorizontal = endingPos - startingPosNewY;
    let yPos = oEvent.clientY - 130;

    //Outputting new stage codes
    let code = document.createElement("p");
    let codeDiv = document.getElementById("levelCodes");
    let stageNumber = 5;

    document.onkeypress = function(evt) {
      evt = evt || window.event;
      var charCode = evt.keyCode || evt.which;
      var charStr = String.fromCharCode(charCode);
      if(charStr==='z'){
        newWall2 = new walls(width, "30", "#333", startingPos, (yPos));
        code.innerHTML = `[${width}, "30", "#333", ${(startingPos)}, ${(yPos)}, 0, '', 'stage', '${stageNumber}'],`;
        code.setAttribute('class','wallInformation');
        code.setAttribute('data-x', startingPos);
        code.setAttribute('data-y', yPos);
        codeDiv.appendChild(code);
        deleteWall();
      }
      if(charStr==='x'){
        newWall = new walls("30", widthHorizontal, "#333", (xPos), (startingPosY-130));
        code.innerHTML = `["30", ${widthHorizontal}, "#333", ${(xPos)}, ${(startingPosY-130)}, 0, '', 'stage', '${stageNumber}'],`;
        code.setAttribute('class','wallInformation');
        code.setAttribute('data-x', xPos);
        code.setAttribute('data-y', (startingPosY-130));
        codeDiv.appendChild(code);
        deleteWall();
      }
    };
  //make grid map
  delete drawLevel;
});

$('#draw-mode-on').click(function(){
  drawActive = true;
  drawMap();
  deleteWall();
  $('.stageHover').css('display', 'block');
})

$('#draw-mode-off').click(function(){
  drawActive = false;
  $('.stageHover').css('display', 'none');
  $(".drawing-instructions").hide();
  $(".instruc").css("display","none");
  drawMap();
  deleteWall();
})

function drawMap(){
  $("#map").on('mousemove', function (oEvent) {
      var oDelta;
      if(drawActive === true){
      if (!bMouseDown) {
          return;
      }
      oDelta = {
          'x': oPreviousCoords.x + totalX,
          'y': oPreviousCoords.y,
      }
      oPreviousCoords = {
          'x': oEvent.clientX,
          'y': oEvent.clientY
      }
      t = oPreviousCoords.x;
      ty = oDelta.y;
      
      drawLevel = new drawPath("0", "30", "transparent", (oEvent.clientX), (oEvent.clientY-130), 0, 'instruc');
      drawLevel = new drawPath("30", "0", "transparent", (oEvent.clientX), (oEvent.clientY-130), 0, 'instruc');
    }
  });
  
  $(".stage").mouseenter(function(){
    $('.stage').removeClass('stageHover');
    if(drawActive === true){
      $(this).addClass('stageHover');
    }
  }).mouseleave(function(){
      $('.stage').removeClass('stageHover');
  })
  
  $("#map").on('mousedown', function(e){
    if(drawActive === true){
      $(".drawing-instructions").show();
    }
  })
  
  $("#map").on('mouseup', function (oEvent) {
    for(let f in drawDistance){
      drawDistance[f].width = 0;
      drawDistance[f].height = 0;
      delete drawDistance[f];
      $(".drawing-instructions").hide();
    }
    $(".instruc").css("display","none");
  }); 
}

function trackMouse(){
  let mie = (navigator.appName == "Microsoft Internet Explorer") ? true : false;
  let f = document.getElementById("map");
  let mouseX = 0;
  let mouseY = 0;
  
  if (!mie) {
      document.captureEvents(Event.MOUSEMOVE);
      document.captureEvents(Event.MOUSEDOWN);
  }
  f.onmousemove = function (e) {mousePos(e);};
  
  function mousePos (e) {
      if (!mie) {
          mouseX = e.pageX; 
          mouseY = e.pageY;
      }
      else {
          mouseX = event.clientX + document.body.scrollLeft;
          mouseY = event.clientY + document.body.scrollTop;
      }
      document.show.mouseXField.value = mouseX;
      document.show.mouseYField.value = mouseY;
      return true;
  }
}

$("#hitbox-mode-on").click(function(){
  $('#hitbox').toggle();
})

$("#hitbox-mode-on-target").click(function(){
  $('.itemHitBox').toggle();
})

$("#pauseMusic").click(function(){
  $("#menuTrack").trigger("pause");
  $("#levelOneTrack").trigger("pause");
})

$("#playMusic").click(function(){
  $("#levelOneTrack").trigger("play");
})

trackMouse();
createMapGrid();


