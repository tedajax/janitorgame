function Camera(player) {
	this.player = player;
	this.X = 0;
	this.Y = 0;
	this.Z = 0;
	this.yaw = 0;
	this.pitch = 0;
	
	//this.Init();
};

// Camera.prototype.Init = function() {
	// this.X = this.player.position.e(1);
	// this.Y = this.player.position.e(2);
	// this.Z = this.player.position.e(3);
	// this.yaw = this.player.rotation;
// };

Camera.prototype.SetPosition = function(position) {
	this.X = position.e(1);
	this.Y = position.e(2);
	this.Z = position.e(3);
};
	
Camera.prototype.SetRotation = function(yaw, pitch) {
	this.yaw = yaw;
	this.pitch = pitch;
};

// Camera.prototype.Update = function() {
	// this.X = this.player.position.e(1);
	// this.Y = this.player.position.e(2);
	// this.Z = this.player.position.e(3);
	// this.yaw = this.player.rotation;
// }

Camera.prototype.Transforms = function() {
	mvTranslate([0.0, 0.0, 0.0]);
	mvRotate(this.pitch, [1, 0, 0]);
	mvRotate(this.yaw, [0, 1, 0]);
	
	mvTranslate([-this.X, -this.Y, -this.Z]);
};
