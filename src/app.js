"use-strict"
// the loop methodes
const METHODE = {
  animation: 0,
  interval: 1
}
// set the loop methode
const LOOP_METHODE = METHODE.animation;
// duration to refresh the loop if in interval mode
const REFRESH_TIME = 100;
/* movement speed
 * dont set it less than 1
*/
const MOVE_X = 7;
const MOVE_Y = 7;

// possible stats in this application
const STATE = {
  none: -1, // normal
  click: 0  // item draged
};

const canvas = document.getElementById('canvas');

var IMG_WIDTH;
var IMG_HEIGHT;

var img = new Image();
img.src = './assets/img.png';
img.onload = (e) =>{
  IMG_WIDTH = img.width;
  IMG_HEIGHT = img.height;
  load();
}

// position if the image
var x = Math.floor(Math.random() * window.innerWidth);
var y = Math.floor(Math.random() * window.innerHeight);
// movement direction
var moveX = MOVE_X;
var moveY = MOVE_Y;
// the colorchange of the image
var hue = 255;

var state = STATE.none;

// handlers
canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mouseup', mouseUp, true);
canvas.addEventListener('mousemove', setPointer, true);

canvas.addEventListener('touchstart', mouseDown, true);
canvas.addEventListener('touchend', mouseUp, true);
canvas.addEventListener('touchmove', setPointer, true);

// dragging
function mouseDown(e) {
  state = STATE.click;
}

// leave the mouse
function mouseUp(e) {
  state = STATE.none;
}

// change the coordinates
function setPointer(e) {
    console.log(e);
  if (state === STATE.click) {
    if (e.type ==='touchmove') {
      x = e.changedTouches.item(0).clientX;
      y = e.changedTouches.item(0).clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

  }
}

// change the color
function changeHue() {
  hue = Math.floor(Math.random() * 255);
}

// darwing loop
function loop() {
  // window size
  let wHeight = window.innerHeight;
  let wWidth = window.innerWidth;

  // resize the window
  canvas.width = wWidth;
  canvas.height = wHeight;

  let ctx = canvas.getContext("2d");

  // draw the image
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(img, x - IMG_WIDTH/2, y - IMG_HEIGHT/2);


  ctx.globalCompositeOperation = "hue";
  ctx.fillStyle = "hsl(" + hue + ",1%, 50%)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(img, x - IMG_WIDTH/2, y - IMG_HEIGHT/2);

  ctx.globalCompositeOperation = "source-over";

  // dont update if in click state
  if (state === STATE.none) {
    updateCoordinates(wWidth, wHeight);
  }

  // update again
  if (LOOP_METHODE === METHODE.animation) {
    window.requestAnimationFrame(loop);
  }
}

// movement logic
function updateCoordinates(width, height) {
  // upper corner
  if (x - IMG_WIDTH/2 <= 0) {
    if (moveX < 0) {
        moveX *= -1;
        changeHue();
    }
    // bottom
  } else if (x + IMG_WIDTH/2 >= width) {
      if (moveX > 0) {
        moveX *= -1;
        changeHue();
      }
  }
  // upper corner
  if (y - IMG_HEIGHT/2 <= 0) {
    if (moveY < 0) {
        moveY *= -1;
        changeHue();
    }
    // bottom
  } else if (y + IMG_HEIGHT/2 >= height) {
    if (moveY > 0) {
      moveY *= -1;
      changeHue();
    }
  }

  // apply the new directions
  x += moveX;
  y += moveY;
}

// start the show
function load() {
  if (LOOP_METHODE === METHODE.animation) {
    window.requestAnimationFrame(loop);
  } else if (LOOP_METHODE === METHODE.interval) {
    setInterval(loop, REFRESH_TIME);
  }
}
