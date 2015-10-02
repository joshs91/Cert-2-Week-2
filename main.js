var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

var background = document.createElement("img");
background.src = "background.png";

var death_background = document.createElement("img");
death_background.src = "death_background.png";

var win_background = document.createElement("img");
win_background.src = "win_background.jpg";

var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function lerp(value, min, max)
{
	return value * (max - min) + min
}

// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 1)
		deltaTime = 1;
		
	return deltaTime;
}

var STATE_SPLASH = 0;
var STATE_GAME = 1;
var STATE_GAMEOVER = 2;
var STATE_GAMEWIN = 3;
var splashTimer = 4;
var gameState = STATE_SPLASH;

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var background_sound = new Howl(
{
	urls: ["background.ogg"],
	loop: true,
	buffer: true,
	volume: 0.5
});
background_sound.play();


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

function initialize(input_level) 
{
	var return_cells = [];
	
	for(var layerIdx = 0; layerIdx < LAYER_COUNT; layerIdx++)
	{
		return_cells[layerIdx] = [];
		var idx = 0;
		for(var y = 0; y < input_level.layers[layerIdx].height; y++)
		{
			return_cells[layerIdx][y] = [];
			for(var x = 0; x < input_level.layers[layerIdx].width; x++)
			{
				if(input_level.layers[layerIdx].data[idx] != 0)
				{
					return_cells[layerIdx][y][x] = 1;
					return_cells[layerIdx][y][x+1] = 1;
					
					if(y != 0)
					{
						return_cells[layerIdx][y-1][x] = 1;
						return_cells[layerIdx][y-1][x+1] = 1;
					}
				}
				else if(return_cells[layerIdx][y][x] != 1)
				{
					return_cells[layerIdx][y][x] = 0;
				}
				idx++;
			}
		}
	}
	return return_cells;
}

var cells = initialize(level1);

var player = new Player();
var keyboard = new Keyboard();

var cam_x = 0;
var cam_y = 0;

//var example_emitter = new Emitter();
//example_emitter.Initialise(200, 200, 1, 0, 13000, 4.0, 1000, 0.5, true)


function runSplash(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height)
	
	context.fillStyle = "#000";
	context.font = "24px Arial";
	context.fillText("Chuck me a Game!", 220, 200);
	
	context.font = "17px Arial";
	context.fillText("Press Enter To Chuck Norris", 216, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_ENTER) && (gameState == STATE_SPLASH))
	{
		gameState = STATE_GAME;
		return;
	}
}


function runGame(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(background, 0, 0, canvas.width, canvas.height)
	
	var wanted_cam_x;
	var wanted_cam_y;
	
	wanted_cam_x = player.x - SCREEN_WIDTH/2;
	wanted_cam_y = player.y - SCREEN_HEIGHT/2;
	
	if (wanted_cam_x < 0)
		wanted_cam_x = 0;
	if (wanted_cam_y < 0)
		wanted_cam_y = 0;
	
	if (wanted_cam_x > MAP.tw * TILE - SCREEN_WIDTH)
		wanted_cam_x = MAP.tw * TILE - SCREEN_WIDTH;
	if (wanted_cam_y > MAP.th * TILE - SCREEN_HEIGHT)
		wanted_cam_y = MAP.th * TILE - SCREEN_HEIGHT;
	
	cam_x = Math.floor(lerp(0.1, cam_x, wanted_cam_x));
	cam_y = Math.floor(lerp(0.1, cam_y, wanted_cam_y));
	
	drawMap(cam_x, cam_y);
	
	player.update(deltaTime);
	player.draw(cam_x, cam_y);
	
	//example_emitter.update(deltaTime);
	//example_emitter.draw(cam_x, cam_y);
		
	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	// draw the FPS
	//context.fillStyle = "#f00";
	//context.font="14px Arial";
	//context.fillText("FPS: " + fps, 5, 20, 100);
}

function runGameOver(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(death_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "40px Arial";
	context.fillStyle = "white";
	context.fillText("GAME OVER", 200, 200);
	
	context.font = "20px Arial";
	context.fillStyle = "white";
	context.fillText("Get Chucked, Mate", 230, 220);
	
	context.font = "15px Arial";
	context.fillStyle = "white";
	context.fillText("Press R to Restart", 260, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_R) && (gameState == STATE_GAMEOVER))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 4;
			return;
		}
}

function runGameWin(deltaTime)
{
	context.fillStyle = "#ccc";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.drawImage(win_background, 0, 0, canvas.width, canvas.height)
	
	context.font = "40px Arial";
	context.fillStyle = "black";
	context.fillText("YOU WIN", 240, 200);
	
	context.font = "15px Arial";
	context.fillStyle = "black";
	context.fillText("Press R to Chuck Off", 260, 250);
	
	if(keyboard.isKeyDown(keyboard.KEY_R) && (gameState == STATE_GAMEWIN))
		{
			gameState = STATE_GAME;
			player.isDead = false;
			player.lives = 3;
			player.x = player.spawn_x;
			player.y = player.spawn_y;
			return;
		}
}

function run()
{
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_SPLASH:
			runSplash(deltaTime);
			break;
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
		case STATE_GAMEWIN:
			runGameWin(deltaTime);
			break;
	}
}


//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
