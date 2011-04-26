/***************************************************************************************************
//File:					artLoader.js
//Original author:		Mike McClish
//Author:				Evan Pittfield
//Date:					3-24-2011
//Purpose:				Load images, store loading in cache
***************************************************************************************************/


var textureCache = Array();
var modelCache = Array();

//Linear search the cache
function checkCache(cache, file)
{
	for (var i = 0; i < cache.length; i++)
	{
		if (cache[i].src == file)
		{
			return i;
		}
	}

	return -1;
}

//Create a cube texture
function loadCubeMap(prefix, type)
{
	//Check the cache if it's already laoded
	var cachePos = checkCache(textureCache, prefix);

	//If the texture isn't in the cache
	if (cachePos == -1)
	{
		var texture = gl.createTexture();
		texture.src = prefix;
		texture.loaded = false;

		texture.images = Array();

		for (var i = 0; i < 6; i++)
		{
			texture.images[i] = new Image();
			texture.images[i].side = i;
			texture.images[i].onload = function() {handleCubeTextureLoaded(texture, this.side)}
			texture.images[i].src = prefix + i + "." + type;
		}

		textureCache[textureCache.length] = texture;

		return texture;
	}
	//Texture is in cache
	else
	{
		return textureCache[location];
	}
}

//Create a 2d texture from file
function loadGLTexture(location, repeat)
{
	//Check the cache if it's already laoded
	var cachePos = checkCache(textureCache, location);

	//If the texture isn't in the cache
	if (cachePos == -1)
	{
		var texture = gl.createTexture();
		texture.src = location;
		texture.loaded = false;

		texture.image = new Image();
		texture.image.onload = function() {handleTextureLoaded(texture, repeat)}
		texture.image.src = location;

		textureCache[textureCache.length] = texture;	

		return texture;
	}
	//Texture is in cache
	else
	{
		return textureCache[cachePos];
	}
}

//Call back when a texture is loaded
function handleTextureLoaded(texture, repeat)
{
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
	
	if (repeat)
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
	}
	//Needed for impostors on some hardware
	else
	{
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	}

	gl.generateMipmap(gl.TEXTURE_2D);
	gl.bindTexture(gl.TEXTURE_2D, null);

	//Texture is loaded
	texture.loaded = true;
}

//Call back when a texture is loaded
function handleCubeTextureLoaded(texture, target)
{

	if (target != 5)
	{
		return;
	}

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[0]);
//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[1]);
//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[2]);
//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[3]);
//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[4]);
//	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[5]);

	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[0]);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[1]);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[2]);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[3]);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[4]);
	gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.images[5]);

	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);

		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

//	gl.texParemeteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//	gl.texParemeteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//	gl.texParemeteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.LINEAR);
//	gl.texParemeteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.LINEAR);

	gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

	gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

	//Texture is loaded
	texture.loaded = true;
}

//Loading .obj file
function loadObj(model, url)
{
	//Check the cache if it's already laoded
	var cachePos = checkCache(modelCache, url);

	//Set model location
	model.src = url;

	//If the model isn't in the cache
	if (cachePos == -1)
	{
		model.loaded = false;
	
		var req = new XMLHttpRequest();
		req.model = model;
		req.onreadystatechange = function () { processLoadObj(req) };
		req.open("GET", url, true);
		req.send(null);

		modelCache[modelCache.length] = model;
	}
	//Model is in the cache
	else
	{		
		//Copy over data
		//Buffer info
		model.numberOfBuffers = modelCache[cachePos].numberOfBuffers;
		model.onlyIndices = modelCache[cachePos].onlyIndices;

		//Buffers
		model.vertexBuffer = modelCache[cachePos].vertexBuffer;
		model.indexBuffer =  modelCache[cachePos].indexBuffer;
		model.normalBuffer =  modelCache[cachePos].normalBuffer;
		model.textureCoordsBuffer =  modelCache[cachePos].textureCoordsBuffer;

		//Draw type (triangles, triangle list)
		model.drawType = modelCache[cachePos].drawType;

		//Bounding box
		model.box = modelCache[cachePos].box;
		model.adjustedBox = modelCache[cachePos].adjustedBox;

		model.loaded = true;
	}
}

function processLoadObj(req)
{
    
    // only if req shows "complete"
    if (req.readyState == 4) {
        doLoadObj(req.model, req.responseText);
    }
}

function doLoadObj(model, text)
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

	//Create the vertex buffer
	model.vertexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);
	model.vertexBuffer[0].size = vertexArray.length / 3;

	//Build up bounding box
	for (var i = 0; i < vertexArray.length; i++)
	{
		model.box.addPoint([vertexArray[i * 3], vertexArray[i * 3 + 1], vertexArray[i * 3 + 2]], false);
	}

	var points = Array();

	for (var i = 0; i < 8; i++)
	{
		//X
		if (i & 1)
		{
			points[i * 3] = model.box.max.e(1);
		}
		else
		{
			points[i * 3] = model.box.min.e(1);
		}
		
		//Y
		if (i & 4)
		{
			points[i * 3 + 1] = model.box.max.e(2);
		}
		else
		{
			points[i * 3 + 1] = model.box.min.e(2);
		}	

		//Z
		if (i & 2)
		{
			points[i * 3 + 2] = model.box.max.e(3);
		}
		else
		{
			points[i * 3 + 2] = model.box.min.e(3);
		}
	}


	model.box.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.box.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
	model.box.vertexBuffer.size = points.length / 3;

	var boxIndexArray = Array();
	boxIndexArray[0] = 0;
	boxIndexArray[1] = 1;
	boxIndexArray[2] = 1;
	boxIndexArray[3] = 3;
	boxIndexArray[4] = 3;
	boxIndexArray[5] = 2;
	boxIndexArray[6] = 2;
	boxIndexArray[7] = 0;

	boxIndexArray[8] = 4;
	boxIndexArray[9] = 5;
	boxIndexArray[10] = 5;
	boxIndexArray[11] = 7;
	boxIndexArray[12] = 7;
	boxIndexArray[13] = 6;
	boxIndexArray[14] = 6;
	boxIndexArray[15] = 4;

	boxIndexArray[16] = 0;
	boxIndexArray[17] = 4;
	boxIndexArray[18] = 1;
	boxIndexArray[19] = 5;
	boxIndexArray[20] = 2;
	boxIndexArray[21] = 6;
	boxIndexArray[22] = 3;
	boxIndexArray[23] = 7;

	model.box.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.box.indexBuffer);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndexArray), gl.STATIC_DRAW);
	model.box.indexBuffer.size = boxIndexArray.length;


	//Create the index buffer
	model.indexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.indexBuffer[0]);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);
	model.indexBuffer[0].size = indexArray.length;

	//Create the normal buffer
	model.normalBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.normalBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArray), gl.STATIC_DRAW);
	model.normalBuffer[0].size = normalArray.length / 3;

	//Create the texture coordinate buffer
	model.textureCoordsBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, model.textureCoordsBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureArray), gl.STATIC_DRAW);
	model.textureCoordsBuffer[0].size = textureArray.length / 2;

	//Buffer count
	model.numberOfBuffers = 1;

	model.groups = groups;

	model.loaded = true;
}