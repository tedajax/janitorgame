/***************************************************************************************************
//File:					mouseInfo.js
//Original author:		Mike McClish
//Author:				Evan Pittfield
//Date:					3-24-2011
//Purpose:				Collect mouse input
***************************************************************************************************/

//Holds mouse movement
var mouseRotationY = 0;
var mouseRotationX = 0;

//When mouse is on canvas
function handleMouseMovement(event)
{
	//Figure Y rotation movement
	var value = (event.clientX - (gl.viewportWidth / 2)) / 200.0;

	if (Math.abs(value) > 0.2)
	{
		if (value < 0)
		{
			value += 0.2;
			mouseRotationY = Math.min(value * value * value * -0.8, 1);
		}
		else
		{
			value -= 0.2;
			mouseRotationY = Math.max(value * value * value * -0.8, -1);
		}
	}
	else
	{
		mouseRotationY = 0;
	}

	//Figure X rotation movement
	value = (event.clientY - (gl.viewportHeight / 2)) / 200.0;

	if (Math.abs(value) > 0.2)
	{
		if (value < 0)
		{
			value += 0.2;
			mouseRotationX = Math.min(value * value * value * -0.8, 1)
		}
		else
		{
			value -= 0.2;;
			mouseRotationX = Math.max(value * value * value * -0.8, -1);
		}
	}
	else
	{
		mouseRotationX = 0;
	}
}

//When mouse leaves canvas
function handleMouseLeave()
{
	mouseRotationY = 0;
	mouseRotationX = 0;
} 