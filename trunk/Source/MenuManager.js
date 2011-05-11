/******************************
*							  *
*		Menu Manager		  *
*							  *
******************************/

function MenuManager() {
	this.activeMenu = -1;
	this.menuList = new Array();
	this.redraw = true;
	
	this.game = document.getElementbyId('Game');
	this.canvas = document.createElement('canvas');
	this.game.appendChild(this.canvas);
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.canvas.style.position = 'absolute';
	this.canvas.style.top = '0px';
	this.canvas.style.left = '0px';
	this.canvas.style.zIndex = '10';
};

MenuManager.prototype.addMenu = function(menu) {
	this.clearMenu();
	this.menuList.push(menu);
};

MenuManager.prototype.getCurrMenuSelector = function() {
	return this.menuList[this.activeMenu].getSelector();
};

MenuManager.prototype.setCurrMenuSelector = function(sel) {
	this.menuList[this.activeMenu].setSelector(sel);
	this.redraw = true;
};

MenuManager.prototype.activate = function(menuName) {
	for(var i = 0; i < this.menuList.length; i++) {
		if(menuName == this.menuList[i].getName()) {
			this.activeMenu = i;
		}
	}
};

MenuManager.prototype.draw = function() {
	if(this.redraw) {
		this.menuList[this.ActiveMenu].draw();
		this.redraw = false;
	}
};

