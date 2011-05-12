/**********************************************
*											  *
*				  Sound Manager			  	  *
*											  *
**********************************************/

function SoundManager() {
	this.sounds = new Array();
};

SoundManager.prototype.addSound = function(src, pos, rad) {
	var sound = new Audio();
	sound.src = src;
	sound.addEventListener('ended',function() { this.currentTime = 0; }, false);
	sound.position = pos;
	sound.radius = rad;
	
	this.sounds.push(sound);
};

SoundManager.prototype.update = function(pos) {
	for(var i = 0; i < this.sounds.length; i++) {
		var dx = this.sounds[i].position.e(1) - pos.e(1);
		var dy = this.sounds[i].position.e(2) - pos.e(2);
		var dz = this.sounds[i].position.e(3) - pos.e(3);
		
		var dist = Math.sqrt((dx*dx) + (dy*dy) + (dz*dz));
		
		if(dist < this.sounds[i].radius) {
			//fix later
			var vol = 1;
			if(this.sounds[i].paused) this.sounds[i].play();
			audio[i].volume = vol;
		} else {
			this.sounds[i].pause();
		}
	}
};