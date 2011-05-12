function AssetHolder(url, type){
	this.url = url;
	this.type = type;
};

/* ***********************************
*									 *
*			Assets Manager			 *
*									 *
*********************************** */

function AssetManager() {
	this.textures = new Array();
	this.objects = new Array();
	this.images = new Array();
	this.isLoaded = false;
	this.numAssets = 0;
};

AssetManager.prototype.CheckStatus = function(){
	var numLoaded = 0;
	for(var i = 0; i < this.textures.length; i++)
		if(this.textures[i].isLoaded)	{ numLoaded++; }
	for(var i = 0; i < this.images.length; i++)
		if(this.images[i].isLoaded)	{ numLoaded++; }
	for(var i = 0; i < this.images.length; i++)
		if(this.images[i].isLoaded)  { numLoaded++; }
	var percent = (numLoaded / this.numAssets) * 100;
	if(percent == 100) { this.isLoaded = true; }
	return percent
};

AssetManager.prototype.BulkLoad = function(assets){
	for(var i = 0; i < assets.length; i++) {
		if(assets[i].type == 1) {  //Image Loader
			this.LoadImage(".Assets/Images/" + assets[i].url);
		} else if(assets[i].type == 2) { //Texture Loader
			this.LoadTexture("./Assets/Textures/" + assets[i].url);
		} else if(assets[i].type == 3) { //Object Loader
			this.LoadObject("./Assets/Objects/" + assets[i].url);
		} else {
			var message = assets[i].url + "'s type doesn't exist, you idiot!";
			console.log(message);
		}
	}
};


/* ***********************************
*			Load Image				 *
*********************************** */
AssetManager.prototype.getImage = function(url) {
	//Check to see if image is already loaded
	var p = "./Assets/Images/" + url;
	for(var i = 0; i < this.images.length; i++) {
		if(p == this.images[i].src) {
			return this.images[i];
		}
	}
	var message = url + " not loaded.  Add to load list";
	console.log(message);
}

AssetManager.prototype.LoadImage = function(url) {	
	this.numAssets++;
	//If image has not already been loaded then load it.
	var image = new Image();
	image.isLoaded = false;
	image.onload = function() {
		image.isLoaded = true;
	}
	this.images.push(image);
};

/* ***********************************
*			 Textures			     *
*********************************** */
AssetManager.prototype.getTexture = function(url) {
	//Check to see is texture is already loaded
	var p = "./Assets/Textures/" + url;
	for(var i = 0; i < this.textures.length; i++) {
		if(p == this.textures[i].url) {
			return this.textures[i];
		}
	}
	var message = url + " not loded.  Add to load list";
	console.log(message);
	return false;
	// //If texture has not been loaded then load it
	// var texture = gl.createTexture();
	// texture.url = url;
	// texture.isLoaded = false;
	// texture.image = new Image();
	// texture.image.onload = function() {
		// bindTexture(texture);
	// }
	// texture.image.src = url;
	// this.textures.push(texture);
	// return texture;
};

AssetManager.prototype.LoadTexture = function(url) {
	this.numAssets++;
	var texture = gl.createTexture();
	texture.url = url;
	texture.isLoaded = false;
	texture.image = new Image();
	texture.image.onload = function() {
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.bindTexture(gl.TEXTURE_2D, null);
		texture.isLoaded = true
	}
	texture.image.src = url;
	this.textures.push(texture);
};

// bindTexture = function(texture) {
	// gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
	// gl.bindTexture(gl.TEXTURE_2D, texture);
	// gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	// gl.generateMipmap(gl.TEXTURE_2D);
    // gl.bindTexture(gl.TEXTURE_2D, null);
	// texture.isLoaded = true
// };

/* ***********************************
*			Load Object				 *
*********************************** */
AssetManager.prototype.getModel = function(url) {
	var p = "./Assets/Objects/" + url;
	for(var i = 0; i < this.objects.length; i++) {
		if(p == this.objects[i].url) {
			return this.objects[i];
		}
	}
	var message = url + " not loaded.  Add to load list";
	console.log(message);
}

AssetManager.prototype.LoadObject = function(url) {
	this.numAssets++;
	var obj = { loaded : false };
    obj.ctx = gl;
	obj.url = url;
    var req = new XMLHttpRequest();
    req.obj = obj;
    req.onreadystatechange = function () { processLoadObj(req) };
    req.open("GET", url, true);
    req.send(null);
	this.objects.push(obj);
};

function processLoadObj(req)
{
    
    // only if req shows "complete"
    if (req.readyState == 4) {
        doLoadObj(req.obj, req.responseText);
    }
}

function doLoadObj(obj, text)
{
    vertexArray = [ ];
    normalArray = [ ];
    textureArray = [ ];
    indexArray = [ ];

    var vertex = [ ];
    var normal = [ ];
    var texture = [ ];
    var facemap = { };
    var index = 0;

    // This is a map which associates a range of indices with a name
    // The name comes from the 'g' tag (of the form "g NAME"). Indices
    // are part of one group until another 'g' tag is seen. If any indices
    // come before a 'g' tag, it is given the group name "_unnamed"
    // 'group' is an object whose property names are the group name and
    // whose value is a 2 element array with [<first index>, <num indices>]
    var groups = { };
    var currentGroup = [-1, 0];
    groups["_unnamed"] = currentGroup;

    var lines = text.split("\n");
    for (var lineIndex in lines) {
        var line = lines[lineIndex].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");

        // ignore comments
        if (line[0] == "#")
            continue;

        var array = line.split(" ");
        if (array[0] == "g") {
            // new group
            currentGroup = [indexArray.length, 0];
            groups[array[1]] = currentGroup;
        }
        else if (array[0] == "v") {
            // vertex
            vertex.push(parseFloat(array[1]));
            vertex.push(parseFloat(array[2]));
            vertex.push(parseFloat(array[3]));
        }
        else if (array[0] == "vt") {
            // normal
            texture.push(parseFloat(array[1]));
            texture.push(parseFloat(array[2]));
        }
        else if (array[0] == "vn") {
            // normal
            normal.push(parseFloat(array[1]));
            normal.push(parseFloat(array[2]));
            normal.push(parseFloat(array[3]));
        }
        else if (array[0] == "f") {
            // face
            if (array.length != 4) {
                
                continue;
            }

            for (var i = 1; i < 4; ++i) {
                if (!(array[i] in facemap)) {
                    // add a new entry to the map and arrays
                    var f = array[i].split("/");
                    var vtx, nor, tex;

                    if (f.length == 1) {
                        vtx = parseInt(f[0]) - 1;
                        nor = vtx;
                        tex = vtx;
                    }
                    else if (f.length = 3) {
                        vtx = parseInt(f[0]) - 1;
                        tex = parseInt(f[1]) - 1;
                        nor = parseInt(f[2]) - 1;
                    }
                    else {
                       
                        return null;
                    }

                    // do the vertices
                    var x = 0;
                    var y = 0;
                    var z = 0;
                    if (vtx * 3 + 2 < vertex.length) {
                        x = vertex[vtx*3];
                        y = vertex[vtx*3+1];
                        z = vertex[vtx*3+2];					
                    }
                    vertexArray.push(x);
                    vertexArray.push(y);
                    vertexArray.push(z);

                    // do the textures
                    x = 0;
                    y = 0;
                    if (tex * 2 + 1 < texture.length) {
                        x = texture[tex*2];
                        y = texture[tex*2+1];
                    }
                    textureArray.push(x);
                    textureArray.push(y);

                    // do the normals
                    x = 0;
                    y = 0;
                    z = 1;
                    if (nor * 3 + 2 < normal.length) {
                        x = normal[nor*3];
                        y = normal[nor*3+1];
                        z = normal[nor*3+2];
                    }
                    normalArray.push(x);
                    normalArray.push(y);
                    normalArray.push(z);

                    facemap[array[i]] = index++;
                }

                indexArray.push(facemap[array[i]]);
                currentGroup[1]++;
            }
        }
    }
	
	//New code begins
	var max = vertexArray[0];
	var min = vertexArray[0];
	
	for(var z = 0; z < vertexArray.length; z++) {
		max = Math.max(max, Math.abs(vertexArray[z]));
		min = Math.min(min, vertexArray[z]);
	}
	
	var temp = 0;
	for(var z = 0; z < vertexArray.length; z++) {
		temp = vertexArray[z] / max;
		vertexArray[z] = temp;
	}
	
	//Get max/min for x/y/z
	var xMax = vertexArray[0];
	var xMin = vertexArray[0];
	var yMax = vertexArray[1];
	var yMin = vertexArray[1];
	var zMax = vertexArray[2];
	var zMin = vertexArray[2];
	var vertMax, vertMin;
	var range, xRange, zRange;
	
	//Find max/min - x/y/z
	for(var j = 0; j < vertexArray.length; j+=3) {
		xMax = Math.max(xMax, vertexArray[j]);
		xMin = Math.min(xMin, vertexArray[j]);
		yMax = Math.max(yMax, vertexArray[j+1]);
		yMin = Math.min(yMin, vertexArray[j+1]);
		zMax = Math.max(zMax, vertexArray[j+2]);
		zMin = Math.min(zMin, vertexArray[j+2]);
	}
		
	if(xMax > yMax){vertMax = xMax;}
	else{vertMax = yMax;}
	if(zMax > vertMax){vertMax = zMax;}
		
	if(xMin > yMin){vertMin = xMin;}
	else{vertMin = yMin;}
	if(zMin > vertMin){vertMin = zMin;}
	
	xRange = xMax - Math.abs(xMin);
	zRange = zMax - Math.abs(zMin);
	range = vertMax - vertMin;
	for(var k = 0; k < vertexArray.length; k+=3) {
		vertexArray[k] = (vertexArray[k] - xRange) / range; //Center around origin
		vertexArray[k+1] = (vertexArray[k+1] - yMin) / range; //move to sit on y=0 plane
		vertexArray[k+2] = (vertexArray[k+2] - zRange) / range; //Center around origin
	}	
	
    // set the VBOs
    obj.normalObject = obj.ctx.createBuffer();
    obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.normalObject);
    obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(normalArray), obj.ctx.STATIC_DRAW);
	obj.normalObject.itemSize = 3;
	obj.normalObject.numItems = normalArray.length / 3;
	
    obj.texCoordObject = obj.ctx.createBuffer();
    obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.texCoordObject);
    obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(textureArray), obj.ctx.STATIC_DRAW);
	obj.texCoordObject.itemSize = 2;
	obj.texCoordObject.numItems = textureArray.length / 2;
	
    obj.vertexObject = obj.ctx.createBuffer();
    obj.ctx.bindBuffer(obj.ctx.ARRAY_BUFFER, obj.vertexObject);
    obj.ctx.bufferData(obj.ctx.ARRAY_BUFFER, new Float32Array(vertexArray), obj.ctx.STATIC_DRAW);
	obj.vertexObject.itemSize = 3;
	obj.vertexObject.numItems = vertexArray.length / 3;
	
    obj.numIndices = indexArray.length;
    obj.indexObject = obj.ctx.createBuffer();
    obj.ctx.bindBuffer(obj.ctx.ELEMENT_ARRAY_BUFFER, obj.indexObject);
    obj.ctx.bufferData(obj.ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), obj.ctx.STREAM_DRAW);
	obj.indexObject.itemSize = 1;
	obj.indexObject.numItems = indexArray.length;
	
    obj.groups = groups;

    obj.loaded = true;
};

/* ***********************************
*		Load Pixel Data				 *
*********************************** */
AssetManager.prototype.getPixelData = function(image) {
  var canvasPD = pixelCanvas();  
  canvasPD.width  = image.width;
  canvasPD.height = image.height;
  var contextPD = canvas_element_context;
  contextPD.drawImage(image, 0, 0);
  var image_data;
  try {
    image_data =  contextPD.getImageData(0, 0, image.width, image.height);
  } catch (e) {
    //netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
    image_data = contextPD.getImageData(0, 0, image.width, image.height);
  }
  return image_data;

};
var canvas_element_context;
pixelCanvas = function()
{

  canvas_element = document.createElement('canvas');
  canvas_element.style.visibility = "hidden";
  canvas_element.style.border = "0px solid #000";
  canvas_element_context = canvas_element.getContext('2d');
  document.body.appendChild(canvas_element);
  
  return canvas_element;
};

// context = function()
// {
  // var cVas = canvas();
  // return canvas_element_context;
// };
