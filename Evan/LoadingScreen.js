function LoadingScreen() {
	this.canvas = document.getElementById("loadingCanvas");
	this.ctx = this.canvas.getContext('2d');
	this.canvas.style.visiability = "visible";
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	
	this.i = 0;
	this.res = 0;
	this.total_width = 300;
	this.total_height = 34;
	this.initial_x = 20;
	this.initial_y = 20;
	this.radius = this.total_height / 2;
	
	this.ctx.font = "16px Verdana";
	this.progress_lingrad = this.ctx.createLinearGradient(0,this.initial_y+this.total_height,0,0);
	this.progress_lingrad.addColorStop(0, '#4DA4F3');
	this.progress_lingrad.addColorStop(0.4, '#ADD9FF');
	this.progress_lingrad.addColorStop(1, '#9ED1FF');
    this.ctx.fillStyle = this.progress_lingrad;	
	
	//this.bgfill = 'rgba(131, 0, 131, 1)';
};

LoadingScreen.prototype.update = function(percent) {
		var cont=this.canvas.parentNode;
		if ((this.canvas.width!=cont.clientWidth)||(this.canvas.height!=cont.clientHeight))
		{
			this.canvas.width=cont.clientWidth;
			this.canvas.height=cont.clientHeight;
		}
		this.initial_x = this.canvas.width * 0.5 - 150;
		this.initial_y = this.canvas.height * 0.8;
		this.i = percent * 3;
		
};

LoadingScreen.prototype.clearScreen = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

LoadingScreen.prototype.draw = function() {
// if(this.i <= 100){
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.ctx.fillText("Super Janitor vs. Green Poop Monster", this.canvas.width * 0.2, this.canvas.height * 0.2);
		// Clear everything before drawing
		this.ctx.clearRect(this.initial_x-5,this.initial_y-5,this.total_width+15,this.total_height+15);
		this.progressLayerRect(this.ctx, this.initial_x, this.initial_y, this.total_width, this.total_height, this.radius);
		this.progressBarRect(this.ctx, this.initial_x, this.initial_y, this.i, this.total_height, this.radius, this.total_width);
		this.progressText(this.ctx, this.initial_x, this.initial_y, this.i, this.total_height, this.radius, this.total_width );
	// }
};

/**
 * Draws a rounded rectangle.
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius;
 */
LoadingScreen.prototype.roundRect = function(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
	ctx.lineTo(x + radius, y + height);
	ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
	ctx.closePath();
	ctx.fill();
}

/**
 * Draws a rounded rectangle.
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} radius The corner radius;
 */

LoadingScreen.prototype.roundInsetRect = function(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	// Draw huge anti-clockwise box
	ctx.moveTo(1000, 1000);
	ctx.lineTo(1000, -1000);
	ctx.lineTo(-1000, -1000);
	ctx.lineTo(-1000, 1000);
	ctx.lineTo(1000, 1000);
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.arc(x+width-radius, y+radius, radius, -Math.PI/2, Math.PI/2, false);
	ctx.lineTo(x + radius, y + height);
	ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
	ctx.closePath();
	ctx.fill();
}

LoadingScreen.prototype.progressLayerRect = function(ctx, x, y, width, height, radius) {
	ctx.save();
	// Set shadows to make some depth
	ctx.shadowOffsetX = 2;
	ctx.shadowOffsetY = 2;
	ctx.shadowBlur = 5;
	ctx.shadowColor = '#666';

	 // Create initial grey layer
	ctx.fillStyle = 'rgba(189,189,189,1)';
	this.roundRect(ctx, x, y, width, height, radius);

	// Overlay with gradient
	ctx.shadowColor = 'rgba(0,0,0,0)'
	var lingrad = ctx.createLinearGradient(0,y+height,0,0);
	lingrad.addColorStop(0, 'rgba(255,255,255, 0.1)');
	lingrad.addColorStop(0.4, 'rgba(255,255,255, 0.7)');
	lingrad.addColorStop(1, 'rgba(255,255,255,0.4)');
	ctx.fillStyle = lingrad;
	this.roundRect(ctx, x, y, width, height, radius);

	ctx.fillStyle = 'white';
	//roundInsetRect(ctx, x, y, width, height, radius);

	ctx.restore();
}

/**
 * Draws a half-rounded progress bar to properly fill rounded under-layer
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the bar
 * @param {Number} height The height of the bar
 * @param {Number} radius The corner radius;
 * @param {Number} max The under-layer total width;
 */
LoadingScreen.prototype.progressBarRect = function(ctx, x, y, width, height, radius, max) {
	// var to store offset for proper filling when inside rounded area
	var offset = 0;
	ctx.beginPath();
	if (width<radius) {
		offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
		ctx.moveTo(x + width, y+offset);
		ctx.lineTo(x + width, y+height-offset);
		ctx.arc(x + radius, y + radius, radius, Math.PI - Math.acos((radius - width) / radius), Math.PI + Math.acos((radius - width) / radius), false);
	}
	else if (width+radius>max) {
		offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius - (max-width)),2));
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width, y);
		ctx.arc(x+max-radius, y + radius, radius, -Math.PI/2, -Math.acos((radius - (max-width)) / radius), false);
		ctx.lineTo(x + width, y+height-offset);
		ctx.arc(x+max-radius, y + radius, radius, Math.acos((radius - (max-width)) / radius), Math.PI/2, false);
		ctx.lineTo(x + radius, y + height);
		ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
	}
	else {
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + width, y);
		ctx.lineTo(x + width, y + height);
		ctx.lineTo(x + radius, y + height);
		ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
	}
	ctx.closePath();
	ctx.fill();

	// draw progress bar right border shadow
	if (width<max-1) {
		ctx.save();
		ctx.shadowOffsetX = 1;
		ctx.shadowBlur = 1;
		ctx.shadowColor = '#666';
		if (width+radius>max)
		  offset = offset+1;
		ctx.fillRect(x+width,y+offset,1,this.total_height-offset*2);
		ctx.restore();
	}
}

/**
 * Draws properly-positioned progress bar percent text
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the bar
 * @param {Number} height The height of the bar
 * @param {Number} radius The corner radius;
 * @param {Number} max The under-layer total width;
 */
LoadingScreen.prototype.progressText = function(ctx, x, y, width, height, radius, max) {
	ctx.save();
	ctx.fillStyle = 'white';
	var text = Math.floor(width/max*100)+"%";
	var text_width = ctx.measureText(text).width;
	var text_x = x+width-text_width-radius/2;
	if (width<=radius+text_width) {
		text_x = x+radius/2;
	}
	ctx.fillText(text, text_x, y+22);
	ctx.restore();
}

