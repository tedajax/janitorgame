var currentlyPressedKeys = Object();
function Controller() {
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