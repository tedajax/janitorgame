var eyeX = 50, eyeY = 50, eyeZ = 50;
var yaw = 180, pitch = 0, roll = 0;

var moveX = 0, moveY = 0, moveZ = 0;
var yawDelta = 0;

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
	if (event.keyCode == 32)
		bulletFired = false;
};

function handleKeys()
{
	//Right arrow
	if(pressedKeys[39])
	{
		yawDelta = 4.0;
	}
	
	//Left arrow
	if(pressedKeys[37])
	{
		yawDelta = -4.0;
	}
	
	//A
	if(pressedKeys[65])
	{
		moveX = -1.0;
	}
	
	//D
	if(pressedKeys[68])
	{
		moveX = 1.0;
	}
	
	//S
	if(pressedKeys[83])
	{
		moveZ = -1.0;
	}
	
	//W
	if(pressedKeys[87])
	{
		moveZ = 1.0;
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
	
	if (pressedKeys[38])
		moveY = 2.0;
	if (pressedKeys[40])
		moveY = -2.0;
};

function moveCamera()
{
	//Update x position.
	eyeX += Math.cos(yaw * Math.toRadians(1)) * moveX;
	eyeZ += Math.sin(yaw * Math.toRadians(1)) * moveX;
	
	//Update z position
	eyeX += Math.cos((yaw - 90) * Math.toRadians(1)) * moveZ;
	eyeZ += Math.sin((yaw - 90) * Math.toRadians(1)) * moveZ;
	
	//eyeY += moveY;
	eyeY = getTerrainHeight(eyeX, eyeZ) + 10.0;
	
	yaw += yawDelta;
	
	pitch = 0;
	
	yawDelta = 0;
	moveX = 0;
	moveY = 0;
	moveZ = 0;
};

function camTransforms()
{
	mvTranslate([0.0, 0.0, 0.0]);
	mvRotate(pitch, [1, 0, 0]);
	mvRotate(yaw, [0, 1, 0]);
	mvTranslate([-eyeX, -eyeY, -eyeZ]);
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
