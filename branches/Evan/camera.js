/*var eyeX = 50, eyeY = 50, eyeZ = 50;
var yaw = 180, pitch = 0, roll = 0;

var moveX = 0, moveY = 0, moveZ = 0;
var yawDelta = 0;*/

function camera()
{
	this.initialize();	
}

camera.prototype.initialize = function()
{
	this.eyeX = 50;
	this.eyeY = 50;
	this.eyeZ = 50;
	this.yaw = 180;
	this.pitch = 0;
	this.roll = 0;
	this.moveX = 0;
	this.moveY = 0;
	this.moveZ = 0;
	this.yawDelta = 0;
}

//Setters
camera.prototype.setEyeX = function(num)
{
	engine.eyeX = num;
}

camera.prototype.setEyeY = function(num)
{
	engine.eyeY = num;
}

camera.prototype.setEyeZ = function(num)
{
	engine.eyeZ = num;
}

camera.prototype.setYaw = function(num)
{
	engine.yaw = num;
}

camera.prototype.setPitch = function(num)
{
	engine.pitch = num;
}

camera.prototype.setRoll = function(num)
{
	engine.roll = num;
}

camera.prototype.setEyeZ = function(num)
{
	engine.eyeZ = num;
}

camera.prototype.setMoveX = function(num)
{
	engine.moveX = num;
}

camera.prototype.setMoveY = function(num)
{
	engine.moveY = num;
}

camera.prototype.setMoveZ = function(num)
{
	engine.moveZ= num;
}

camera.prototype.setYawDelta = function(num)
{
	engine.yawDelta = num;
}

var pressedKeys = Object();

//Key pressed.
function handleKeyDown(event)
{
	pressedKeys[event.keyCode] = true;	
};

//Key unpressed.
function handleKeyUp(event)
{
	pressedKeys[event.keyCode] = false;
	
	//Space key
	if (event.keyCode == 32)
	{
		bulletFired = false;
	}
};

function handleKeys()
{
	//Right arrow
	if(pressedKeys[39])
	{
		//engine.setYawDelta(4.0);
		engine.yawDelta = 4.0;
	}
	
	//Left arrow
	if(pressedKeys[37])
	{
		//camera.yawDelta = -4.0;
		//engine.setYawDelta(-4.0);
		engine.yawDelta = -4.0;
	}
	
	//A
	if(pressedKeys[65])
	{
		//camera.moveX = -1.0;
		//engine.setMoveX(-1.0);
		engine.moveX = -1.0;
	}
	
	//D
	if(pressedKeys[68])
	{
		//camera.moveX = 1.0;
		//engine.setMoveX(1.0);
		engine.moveX = 1.0;
	}
	
	//S
	if(pressedKeys[83])
	{
		//camera.moveZ = -1.0;
		//engine.setMoveZ(-1.0);
		engine.moveZ = -1.0;
	}
	
	//W
	if(pressedKeys[87])
	{
		//camera.moveZ = 1.0;
		engine.moveZ = 1.0;
	}
	
	//X
	if(pressedKeys[88])
	{
		engine.healthVal -= 1.0;
	}
	
	//Spacebar -- Fire bullet
	if (pressedKeys[32] && !bulletFired)
	{
		engine.fireBullet();
		bulletFired = true;
	}
	
	//E
	if (pressedKeys[69])
	{
		tempscale += 0.1;
	}
	
	//q
	if(pressedKeys[81])
	{
		tempscale -= 0.1;
	}
	
	
	//Up arrow
	if(pressedKeys[38])
	{
		engine.moveY = 2.0;
	}
	
	//Down arrow
	if(pressedKeys[40])
	{
		engine.moveY = -2.0;
	}
};

function moveCamera()
{
	//Update x position.
	engine.eyeX += Math.cos(engine.yaw * Math.toRadians(1)) * engine.moveX;
	engine.eyeZ += Math.sin(engine.yaw * Math.toRadians(1)) * engine.moveX;
	
	//Update z position
	engine.eyeX += Math.cos((engine.yaw - 90) * Math.toRadians(1)) * engine.moveZ;
	engine.eyeZ += Math.sin((engine.yaw - 90) * Math.toRadians(1)) * engine.moveZ;
	
	//eyeY += moveY;
	engine.eyeY = getTerrainHeight(engine.eyeX, engine.eyeZ) + 10.0;
	
	engine.yaw += engine.yawDelta;
	
	engine.pitch = 0;
	engine.yawDelta = 0;
	engine.moveX = 0;
	engine.moveY = 0;
	engine.moveZ = 0;
};

function camTransforms()
{
	mvTranslate([0.0, 0.0, 0.0]);
	mvRotate(engine.pitch, [1, 0, 0]);
	mvRotate(engine.yaw, [0, 1, 0]);
	mvTranslate([-engine.eyeX, -engine.eyeY, -engine.eyeZ]);
};


//Convert from degrees to radians
Math.toRadians = function(degrees)
{
	return Math.PI * degrees / 180;
}

//Convert from radians to degrees
Math.toDegrees = function(radians)
{
	return 180 * radians / Math.PI;
}
