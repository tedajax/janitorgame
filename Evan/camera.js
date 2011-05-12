var eyeX = 50, eyeY = 50, eyeZ = 50;
var yaw = 180, pitch = 0, roll = 0;

var moveX = 0, moveY = 0, moveZ = 0;
var yawDelta = 0;

var pressedKeys = Object();
function handleKeyDown(event)
{
	pressedKeys[event.keyCode] = true;	
};

function handleKeyUp(event)
{
	pressedKeys[event.keyCode] = false;
	if (event.keyCode == 32)
		bulletFired = false;
};

function handleKeys()
{
	if (pressedKeys[39])
		yawDelta = 4.0;
	if (pressedKeys[37])
		yawDelta = -4.0;
	
	if (pressedKeys[65])
		moveX = -1.0;
	if (pressedKeys[68])
		moveX = 1.0;
	if (pressedKeys[83])
		moveZ = -1.0;
	if (pressedKeys[87])
		moveZ = 1.0;
	
	if (pressedKeys[88])
		engine.healthVal -= 1.0;
	
	if (pressedKeys[32] && !bulletFired)
	{
		engine.fireBullet();
		bulletFired = true;
	}
	
	if (pressedKeys[69])
		tempscale += 0.1;
	if (pressedKeys[81])
		tempscale -= 0.1;
	
	//if (pressedKeys[38])
	//	moveY = 2.0;
	//if (pressedKeys[40])
	//	moveY = -2.0;
};

function moveCamera()
{
	var PIOVER180 = Math.PI / 180;
	
	eyeX += Math.cos(yaw * PIOVER180) * moveX;
	eyeZ += Math.sin(yaw * PIOVER180) * moveX;
	
	eyeX += Math.cos((yaw - 90) * PIOVER180) * moveZ;
	eyeZ += Math.sin((yaw - 90) * PIOVER180) * moveZ;
	
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
