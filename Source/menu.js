/* **********************************
*				Menu				*
********************************** */

function Menu(name, isPopup) {
	this.selector = 0;
	this.isPopup = isPopup;
	this.backgroundImage;
	this.hasBackground = false;
	if(isPopup) {
		this.backgroundColor = 'rgba(0,0,0,0.7)';
		this.font = 'bold 20px chiller';
	} else {
		this.backgroundColor = 'rgb(0, 0, 0,)';
		this.font = 'bold 30px chiller';
	}
	this.selectorColor = 'rgb(255, 255, 255)';
	this.name = name;
	
	this.title = "None";
	this.titleXPercent = 10.0;
	this.titleYPercent = 10.0;	
	
	this.fontColor = 'rgb(255, 255, 255)';
	
	this.items = new Array();
};

//Returns the name of the menu
Menu.prototype.getName() {
	return this.name;
}

//Adds a background image to the menu.  If no image is added it will draw the default color
Menu.prototype.addBackgroundImage = function(url) {
	this.backgroundImage = aManager.getImage(url);
	this.hasBackground = true;
}

//Add an item to the menu
Menu.prototype.addItem = function(item, percentX, percentY, font, color) {
	var item;
	item.text = item;
	item.percentX = percentX;
	item.percentY = percentY;
	item.font = font;
	item.color = color;
	
	this.items.push(item);
};

//Add a menu title
Menu.prototype.addTitle = function(title) {
	this.title = title;
};

//Set the location of the title
Menu.prototype.titleLocation = function(xPercent, yPercent) {
	this.titleXPercent = xPercent;
	this.titleYPercent = yPercent;
};

//Returns which menu item is selected
Menu.prototype.getSelector = function() {
	return this.selector;
};

//Sets which menu item is selected
Menu.prototype.setSelector = function(sel) {
	this.selector = sel % this.items.length;
};

//Sets the color of the selected menu item
this.prototype.setSelectorColor = function(color) {
	this.selectorColor = color;
};

//Draws the menu
Menu.prototype.draw = function(canvas) {
	var context = canvas.getContext('2d');
	context.save();
	
	if(this.isPopup) {  //Is a popup window
		context.fillStyle = this.backgroundColor;
		var x = canvas.width * 0.25;
		var y = canvas.height * 0.25;
		var dx = canvas.width * 0.50;
		var dy = canvas.height * 0.50;
		context.fillRect(x, y, dx, dy);
			
		context.fillStyle = this.titleColor;
		context.font = this.titleFont;
		
		var xPos = this.titleXPercent * boxWidth;
		var yPos = this.titleYPercent * boxHeight;
		
		if(this.title == "None") {
			context.fillText(this.name, xPos + x, yPos + y);
		} else {
			context.fillText(this.title, xPos + x, yPos + y);
		}
		
		for(var i = 0; i < this.items.length; i++) {
			if(i == this.selector) {
				context.fillStyle = this.selectorColor;
			} else { 
				context.fillStyle = this.items[i].color;
			}
			var xPos = this.items[i].percentX * boxWidth;
			var yPos = this.items[i].percentY * boxHeight;
			context.font = this.items[i].font;
			context.fillText(this.items[i].text, xPos, yPos);
		}		
	} else {  //not a popup window
		context.clearRect(0, 0, canvas.width, canvas.height);
		
		if(this.hasBackground) {
			if(this.backgroundImage.isLoaded) {
				context.drawImage(this.backgroundImage, 0, 0, canvis.width, canvas.height);	
			}
		} else {
			context.fillStyle = this.backgroundColor;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		if(this.title != "None") {
			context.fillStyle = this.titleColor
			context.font = titleFont;
			var xPos = this.titleXPercent * canvas.width;
			var yPos = this.titleYPercent * canvas.height;
			context.fillText(this.title, xPos, yPos);
		}
		
		for(var i = 0; i < this.items.length; i++) {
			if(i == this.selector) {
				context.fillStyle = this.selectorColor;
			} else {
				context.fillStyle = this.items[i].color;
			}
			var xPos = this.items[i].percentX * canvas.width;
			var yPos = this.items[i].percentY * canvas.height;
			context.font = this.items[i].font;
			context.fillText(this.items[i].text, xPos, yPos);
		}		
	}
	
	context.restore();
};
