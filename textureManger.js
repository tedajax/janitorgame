//Textures class which stores all the textures
function textures()
{
	textures.teapot;
	
	textures.grass;
	textures.rock;
	textures.snow;
	textures.sand;
	
	textures.shrub;
	
	this.dict = new Array();
	
	
	
	textures.loaded = false;
};

//Checks if the textures are all loaded and sets texture loaded status accordingly
function checkLoadedTextures()
{
	if (!textures.loaded)
	{
		if (!textures.grass.loaded) return false;
		if (!textures.rock.loaded) return false;
		if (!textures.snow.loaded) return false;
		if (!textures.sand.loaded) return false;
		if (!textures.shrub.loaded) return false;
	}
	
	textures.loaded = true;
	return true;
};