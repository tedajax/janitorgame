/***************************************************************************************************
//File:					keyboardInfo.js
//Original author:		Mike McClish
//Author:				Evan Pittfield
//Date:					3-24-2011
//Purpose:				Collect keyboard input
***************************************************************************************************/



//Holds current keys down
var currentKeysDown = Object();
var trueBullet;


//Key up event
function handleKeyUp(event)
{
	currentKeysDown[event.keyCode] = false;
}

//Key down event
function handleKeyDown(event)
{
	currentKeysDown[event.keyCode] = true;
}

//Handle the keys that are down this frame
function handleInput()
{
	//Move camera forward/backward
	//W
	if (currentKeysDown[87])
	{
		var p = teapot.getPosition().subtract($V([Math.sin(Math.PI * yaw / 180.0), 0, Math.cos(Math.PI * yaw / 180.0)]));

		p.elements[0] = Math.max(0, Math.min(255, p.elements[0]));
		p.elements[2] = Math.max(0, Math.min(255, p.elements[2]));

		p.elements[1] = terrain.foo[3 * (Math.round(p.e(1)) * 256 + Math.round(p.e(3))) + 1]  + 0.8;
		teapot.setPosition(p);
		//vase.setPosition(p);
	}
	//S
	else if (currentKeysDown[83])
	{
		var p = teapot.getPosition().add($V([Math.sin(Math.PI * yaw / 180.0), 0, Math.cos(Math.PI * yaw / 180.0)]));

		p.elements[0] = Math.max(0, Math.min(255, p.elements[0]));
		p.elements[2] = Math.max(0, Math.min(255, p.elements[2]));

		p.elements[1] = terrain.foo[3 * (Math.round(p.e(1)) * 256 + Math.round(p.e(3))) + 1]  + 0.8;
		teapot.setPosition(p);
	}

	//Move camera left/right
	//A
	if (currentKeysDown[65])
	{
		yaw += 1;
	}
	//D
	else if (currentKeysDown[68])
	{
		yaw -= 1;
	}

	//Move camer up/down
	//O
	if (currentKeysDown[79])
	{
		pitch += 1;
	}
	//L
	else if (currentKeysDown[76])
	{
		pitch -= 1;
	}
	
	//X for more health
	if (currentKeysDown[88])
	{
		characterHealth++;
		//enemyHealth++;
		level = level - 50;
		console.log(characterHealth);
	}
	
	//C for less health
	else if (currentKeysDown[67])
	{
		characterHealth--;
		//enemyHealth--;
		level = level + 50;
		console.log(characterHealth);
	}
	
	//F - fire bullet
	if(currentKeysDown[70])
	{
		trueBullet = true;
		enemyHealth--;
	}
	
	//1 - for tonal shading
	if(currentKeysDown[49])
	{
		tonalShade = true;
	}
	
	//2 - for toon shading
	if(currentKeysDown[50])
	{
	}

	//3 - for normal shading
	else if(currentKeysDown[51])
	{
		tonalShade = false;
	}

}