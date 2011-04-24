/***************************************************************************************************
//File:		HUD.js
//Author:	Evan Pittfield
//Date:		3-24-2011
//Purpose:	This is where the HUD is made, and drawm, but it is instantiated and called in Launch.
***************************************************************************************************/
function HUD()
{
	//Get canvas from Launch.
	this.canvas = document.getElementById("headsUpDisplay");

	//CSS position attributes, this will allow to overlay canvas.
	//originally had a problem where (0,0) was below 3d canvas, this
	//solved it.
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	
	//Grab GL context, height, and width.
	//The height and width will be same as 3d context height/width.
	this.context = document.getElementById("headsUpDisplay").getContext("2d");		
	this.height = document.getElementById("headsUpDisplay").height;				
	this.width = document.getElementById("headsUpDisplay").width;		
	
	//Enemy.
	this.image1 = new Image();
	this.image1.src = "enemyVase.png"
	
	//Reticle.
	this.image2 = new Image();
	this.image2.src = "tehRedicle.png"
	
	//Character Healthbar
	this.image3 = new Image();
	this.image3.src = "tehhealthbar.png"
	
	//Compass
	this.image4 = new Image();
	this.image4.src = "tehcompass.png"
	
	//Level up indicator
	this.image5 = new Image();
	this.image5.src = "levelup.png"
	
	//Enemy Healthbar
	this.image6 = new Image();
	this.image6.src = "enemyHealth.png"

};

HUD.prototype.draw = function()
{
	/**************************
		Enemy target
	**************************/
	//Push state on to stack.
	this.context.save();
	
	//Draw image, include font, and place image.
	this.context.drawImage(this.image1, 30, 475);
	this.context.font = 'bold 42px chiller';
	this.context.fillStyle = "rgb(255, 0, 0)";
	this.context.fillText("The Enemy Target", 10, 430);

	//Pop the top state on the stack, and restore context to that state.
	this.context.restore();
		
	/**************************
		Reticle
	**************************/
	//Push state on to stack.
	this.context.save();
	
	//Always draw at center, kind of a hack but i guess this is really how it works.
	this.context.drawImage(this.image2, ((this.width - this.image2.width)/2) + 25, ((this.height - this.image2.height)/2) + 25);
	
	//Pop the top state on the stack, and restore context to that state.
	this.context.restore();
	
	
	/**************************
		Character Health bar
	**************************/
	//Push state on to stack.
	this.context.save();
	
	//Draw image, include font, place image.
	this.context.drawImage(this.image3, 400, 730);
	this.context.font = 'bold 42px chiller';
	this.context.fillStyle = "rgb(0, 255, 0)";
	this.context.fillText("Player Health", 430, 700);

	//Clear when maxhealth is reached.
	if(characterHealth >= 183)
	{
		this.context.clearRect(430, 740, 183, 6);
	}
	
	//Clear when minhealth is reached.
	else if(characterHealth <= 0)
	{
		this.context.clearRect(430, 740, 0, 6);
	}
	
	//Otherwise clear current health.
	else
	{
		this.context.clearRect(430, 740, characterHealth+1, 6);
	}

	//Set maxhealth, draw maxhealth, and block drawing above it.
	if(characterHealth >= 183)
	{
		characterHealth = 183;
		this.context.fillRect(430, 740, 183, 6);
	}
	
	//Set minhealth, draw minhealth, and block drawing behind it.
	else if(characterHealth <= 0)
	{
		characterHealth = 0;
		this.context.fillRect(430, 740, 0, 6);
	}
	
	//Otherwise, draw current health.
	else
	{
		this.context.fillRect(430, 740, characterHealth, 6);
	}
	
	//Pop the top state on the stack, and restore context to that state.
	this.context.restore();

	
	/**************************
		Compass
	**************************/
	//Cheat and use black out box each draw because i do not know how to do Axis Aligned bounding Box AABB.
	this.context.fillStyle = "rgb(89, 89, 89)";
	this.context.fillRect(875, 25, this.image4.width, this.image4.height);
	
	//Push state on to stack.
	this.context.save();
	
	//Translate to center of picture as origin.
	this.context.translate((this.image4.width/2)+875, (this.image4.height/2)+25);

	//Rotate by current yaw.
	this.context.rotate(DegToRad(yaw));

	//Translate back to top left
	this.context.translate(-this.image4.width/2, -this.image4.height/2);
	
	//Draw image.
	this.context.drawImage(this.image4, 0, 0);
	
	//Pop the top state on the stack, and restore context to that state.
	this.context.restore();
	
	
	/**************************
		Level up indicator
	**************************/

	//Levelup
	this.context.save();
	this.context.drawImage(this.image5, 725, 650);
	this.context.restore();
	
	
	/**************************
		Enemy Health bar
	**************************/
	//Push state on to stack.
	this.context.save();
	
	//Draw image, include font, place image.
	this.context.drawImage(this.image6, 15, 720);
	this.context.font = 'bold 42px chiller';
	this.context.fillStyle = "rgb(255, 0, 0)";
	this.context.fillText("Enemy Health", 55, 700);
	//this.context.fillRect(60, 740, 200, 6);


	//Clear when maxhealth is reached.
	if(enemyHealth >= 200)
	{
		this.context.clearRect(60, 740, 200, 6);
	}
	
	//Clear when minhealth is reached.
	else if(enemyHealth <= 0)
	{
		this.context.clearRect(60, 740, 0, 6);
	}
	
	//Otherwise clear current health.
	else
	{
		this.context.clearRect(60, 740, enemyHealth+1, 6);
	}

	//Set maxhealth, draw maxhealth, and block drawing above it.
	if(enemyHealth >= 200)
	{
		enemyHealth = 200;
		this.context.fillRect(60, 740, 200, 6);
	}
	
	//Set minhealth, draw minhealth, and block drawing behind it.
	else if(enemyHealth <= 0)
	{
		enemyHealth = 0
		this.context.fillRect(60, 740, 0, 6);
	}
	
	//Otherwise, draw current health.
	else
	{
		this.context.fillRect(60, 740, enemyHealth, 6);
	}
	
	//Pop the top state on the stack, and restore context to that state.
	this.context.restore();
};

//Quick convert method.
function DegToRad(d)
{
	return d*0.0174532925199432957;
}	


 