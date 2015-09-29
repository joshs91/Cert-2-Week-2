
var GameState = function() 
{
	this.prototype = BaseState;
}

GameState.prototype.load = function() 
{
	this.delay = 2;
}

GameState.prototype.unload = function() 
{
}

GameState.prototype.update = function(dt) 
{
	if( this.delay > 0 )
		this.delay -= dt;

	if( this.delay <= 0 && keyboard.isKeyDown( keyboard.KEY_SPACE ) == true )
	{
		stateManager.switchState( new GameOverState() );
	}
}

GameState.prototype.draw = function() 
{
	context.font="72px Verdana";	
	context.fillStyle = "#FF0";	
	var width = context.measureText("GAME STATE").width;
	context.fillText("GAME STATE", SCREEN_WIDTH/2 - width/2, SCREEN_HEIGHT/2);		
	
	
	if( this.delay <= 0 )
	{
		context.font="18px Verdana";	
		context.fillStyle = "#000";	
		width = context.measureText("Press SPACE to Continue.").width;
		context.fillText("Press SPACE to Continue.", SCREEN_WIDTH/2 - width/2, 300);
	}
	else 
	{
		var time = Math.floor(this.delay);
		var decimal = Math.floor(this.delay * 10) - time*10;
	
		context.font="18px Verdana";	
		context.fillStyle = "#000";		
		width = context.measureText(time + "." + decimal).width;
		context.fillText(time + "." + decimal, SCREEN_WIDTH/2 - width/2, 300);
	}
}