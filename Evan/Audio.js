/*********************************

Sound manager
Evan Pittfield


*********************************/

var sounds = new Array();
var music = null;
var stopMusic = false;
var currentlyPlaying = null;


//Stop Music from playing
function disableMusic(disable)
{
	stopMusic = disable;
	
	if(disable)
	{
		if(music != null)
		{
			music.pause();
		}
		
		music = null;
	}
	else
	{
		if (music == null && currentlyPlaying != null)
		{
			playMusic(currentlyPlaying);
		}
	}
}
				
function playMusic(s)
{
	currentlyPlaying = s;
	
	if(stopMusic)
	{
		return;
	}
	
	var a = new Audio();
	a.src = document.getElementById(s).src;
	a.loop = true;
	a.play();	


	if (music != null)
	{
		music.pause();
	}
	
	music = a;
}

function playsound(s) 
{
	var thistime = new Date();
	var now = thistime.getTime();
	
	var origaudio = document.getElementById(s);
	if (origaudio == null)
		return;

	origaudio.play();
}
