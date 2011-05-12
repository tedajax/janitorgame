var currentlyPressedKeys = Object();
function Controller() {
	this.gamepad = new Joystick();
	this.center = 32768;
	this.deadZone = this.center * .1;
};

Controller.prototype.KeyPressed = function(key) {
	if(currentlyPressedKeys[key]) {
		return true;
	} else {
		return false;
	}
};

Controller.prototype.handleKeyDown = function(event) {
    currentlyPressedKeys[event.keyCode] = true;
};
 
Controller.prototype.handleKeyUp = function(event) {
    currentlyPressedKeys[event.keyCode] = false;
}; 

Controller.prototype.StickX = function() {
	return this.gamepad.getX();
};

Controller.prototype.StickY = function() {
	return this.gamepad.getY();
};

Controller.prototype.PadA = function() {
	var value = this.gamepad.getButtons();
	if(value == 1 || value == 17 || value == 33) { return true; }
	else { return false; }
};

Controller.prototype.PadB = function() {
	var value = this.gamepad.getButtons();
	if(value == 2 || value == 18 || value == 34) { return true; }
	else { return false; }
};

Controller.prototype.PadX = function() {
	var value = this.gamepad.getButtons();
	if(value == 4 || value == 20 || value == 36) { return true; }
	else { return false; }
};

Controller.prototype.PadY = function() {
	var value = this.gamepad.getButtons();
	if(value == 8 || value == 24 || value == 40) { return true; }
	else { return false; }
};

Controller.prototype.PadLB = function() {
	var value = this.gamepad.getButtons();
	if(value == 16 || value == 17 || value == 18 || value == 20 || value ==24) { return true; }
	else { return false; }
};

Controller.prototype.PadRB = function() {
	var value = this.gamepad.getButtons();
	if(value == 32 || value == 33 || value == 34 || value == 36 || value ==40) { return true; }
	else { return false; }
};

Controller.prototype.PadBack = function() {
	if(this.gamepad.getButtons() == 64) { return true; }
	else { return false; }
};

Controller.prototype.PadStart = function() {
	if(this.gamepad.getButtons() == 128) { return true; }
	else { return false; }
};

Controller.prototype.LowerDZ = function() {
	return this.center - this.deadZone;
};	

Controller.prototype.UpperDZ = function() {
	return this.center + this.deadZone;
};