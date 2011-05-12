function HUD()
{
	this.width;
	this.height;
	
	this.healthBar;
	this.health;
	this.reticle;
	this.map;
	this.compass;
	this.direction;
	this.target;
	
	this.canvas;
	this.context;
	
	this.loaded = false;
	
	this.getCanvas();
	this.loadTextures();
};

HUD.prototype.checkLoaded = function()
{
	if (!this.healthBar.loaded) return;
	if (!this.health.loaded) return;
	if (!this.reticle.loaded) return;
	if (!this.compass.loaded) return;
	if (!this.direction.loaded) return;
	
	this.loaded = true;
};

HUD.prototype.getCanvas = function()
{
	this.canvas = document.getElementById("hudcanvas");
	this.context = this.canvas.getContext('2d');
	this.canvas.style.visibility = "visible";
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "5px";
	this.canvas.style.left = "5px";
	this.width = this.canvas.width;
	this.height = this.canvas.height;
};

HUD.prototype.loadTextures = function()
{
	this.healthBar = loadTexture("healthbar.png");
	this.health = loadTexture("health.png");
	this.reticle = loadTexture("reticule.png");
	this.compass = loadTexture("compass.png");
	this.direction = loadTexture("direction.png");	
};

HUD.prototype.drawImage = function(img, x, y, rot)
{
	var scaleX = 1.0;
	var scaleY = 1.0;
	
	if (img.scaleX)
		scaleX = img.scaleX;
	if (img.scaleY)
		scaleY = img.scaleY;
	
	var sclWidth = (img.width * scaleX) / 2;
	var sclHeight = (img.height * scaleY) / 2;
	
	var xpos = x + sclWidth;
	var ypos = y + sclHeight;
	
	this.context.scale(scaleX, scaleY);
	this.context.translate(xpos, ypos);
	this.context.rotate(rot * Math.PI / 180.0);
	this.context.drawImage(img, -sclWidth, -sclHeight);
	this.context.rotate(-rot * Math.PI / 180.0);
	this.context.translate(-xpos, -ypos);
	this.context.scale(1.0 / scaleX, 1.0 / scaleY);
};

HUD.prototype.draw = function()
{
	this.context.clearRect(0, 0, this.width, this.height);
	
	if (this.loaded)
	{
		this.drawImage(this.healthBar.image, 20, 20, 0);
		this.health.image.scaleX = (engine.healthVal / 100.0);
		this.drawImage(this.health.image, 20, 20, 0);
		
		this.drawImage(this.reticle.image, (this.width / 2) - (this.reticle.image.width / 2), (this.height / 2) - (this.reticle.image.height / 2), 0);
		
		this.drawImage(this.compass.image, (this.width - 84), 20, 0);
		this.drawImage(this.direction.image, (this.width - 84), 20, yaw);
	}
	else
	{
		this.checkLoaded();
	}
};
