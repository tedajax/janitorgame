
//when image is done loading bind the texture in gl
function bindLoadedTexture(tex)
{
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, tex.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.bindTexture(gl.TEXTURE_2D, null);
	tex.loaded = true;
};

//load image data and store in gl texture class
function loadTexture(texLoc)
{
	var tex = gl.createTexture();
	
	tex.image = new Image();
	tex.loaded = false;
	tex.image.onload = function()
	{
		bindLoadedTexture(tex);
	};
	
	tex.image.src = texLoc;
	
	return tex;
};