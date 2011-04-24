/***************************************************************************************************
//File:					GameObjects.js
//Original author:		Mike McClish
//Author:				Evan Pittfield
//Date:					3-24-2011
//Purpose:				Make physical game objects, physical properties, and matrix math
***************************************************************************************************/


//Bounding box object
function BoundingBox()
{
	this.min = $V([0, 0, 0]);
	this.max = $V([0, 0, 0]);
	this.vertexBuffer = null;
	this.indexBuffer = null;
}

//Reset box
BoundingBox.prototype.reset = function()
{
	this.min.setElements([0, 0, 0]);
	this.max.setElements([0, 0, 0]);
}

//Add point to bounding box
BoundingBox.prototype.addPoint = function(v, isVector)
{
	//If a vector was passed in
	if (isVector)
	{
		for (var i = 0; i < 3; i++)
		{
			if (v.elements[i] < this.min.elements[i])
			{
				this.min.elements[i] = v.elements[i];
			}			
	
			if (v.elements[i] > this.max.elements[i])
			{
				this.max.elements[i] = v.elements[i];
			}		
		}
	}
	else 	//If an array was passed in
	{
		for (var j = 0; j < 3; j++)
		{
			if (v[j] < this.min.elements[j])
			{
				this.min.elements[j] = v[j];
			}

			if (v[j] > this.max.elements[j])
			{
				this.max.elements[j] = v[j];
			}
		}
	}
}

//Get the center of the bounding box

BoundingBox.prototype.getCenter = function()
{
	return $V([(this.min.e(1) + this.max.e(1)) / 2, (this.min.e(2) + this.max.e(2)) / 2, (this.min.e(3) + this.max.e(3)) / 2]);
}

//Get the center of the bounding box
BoundingBox.prototype.getBottomCenter = function()
{
	return $V([(this.min.e(1) + this.max.e(1)) / 2, this.min.e(2), (this.min.e(3) + this.max.e(3)) / 2]);
}


//Generic base game object
function GameObject()
{
	//Object type
	this.type = "generic";
	this.loaded = false;
	this.enabled = true;

	//Buffer info
	this.numberOfBuffers = 0;
	this.onlyIndices = false;

	//Buffers
	this.vertexBuffer = Array();
	this.indexBuffer = Array();
	this.normalBuffer = Array();
	this.textureCoordsBuffer = Array();

	//Draw type (triangles, triangle list)
	this.drawType = 4;

	//Textures
	this.textures = Array();

	//Model matrix info
	this.mMatrix = Matrix.I(4);
	this.position = $V([0, 0, 0]);
	this.rotation = $V([0, 0, 0]);
	this.scale = 1.0;

	//Bounding box
	this.box = new BoundingBox();
	this.adjustedBox = new BoundingBox();
}

//Returns if the object is enabled
GameObject.prototype.isEnabled = function()
{
	return this.enabled;
}

//Set the object enabled status
GameObject.prototype.setEnabled = function(value)
{
	this.enabled = value;
}

//Rebuilds the objects matrix
GameObject.prototype.rebuildMatrix = function()
{
	this.mMatrix = Matrix.I(4);

	this.mMatrix = this.mMatrix.x(Matrix.Translation(this.position).ensure4x4().x(Matrix.Scale(this.scale, 4)));

	this.mMatrix = this.mMatrix.x(Matrix.Rotation(this.rotation.e(2) * Math.PI / 180.0, $V([0, 1, 0])).ensure4x4());
}

//Set the object's Y rotation
GameObject.prototype.setYRotation = function(yRot)
{
	this.rotation.elements[1] = yRot;
	this.rebuildMatrix();
}

//Set the object's scale
GameObject.prototype.setScale = function(newScale)
{
	this.scale = newScale;
	this.rebuildMatrix();
}

//Get the object's scale
GameObject.prototype.getScale = function()
{
	return this.scale;
}

//Set the object's position
GameObject.prototype.setPosition = function(newPos)
{
	this.position = newPos;
	this.rebuildMatrix();
}

//Return the object's position
GameObject.prototype.getPosition = function()
{
	return this.position;
}

//Get the object's model matrix
GameObject.prototype.getMatrix = function()
{
	return this.mMatrix;
}

//Return the object's draw type
GameObject.prototype.getDrawType = function()
{
	return this.drawType;
}

//Returns if the object is loaded yet
GameObject.prototype.isLoaded = function()
{
	//If we weren't loaded before check to see if the textures are loaded yet
	if (!this.loaded)
	{
		for (var i = 0; i < this.textures.length; i++)
		{
			if (!this.textures[i].loaded)
			{
				return false;
			}
		}

		this.loaded = true;
	}

	return true;
}

//Vertex Buffer
GameObject.prototype.setVertexBuffer = function(buff, pos)
{
	this.vertexBuffer[pos] = buff;	
}

GameObject.prototype.getVertexBuffer = function(pos)
{
	return this.vertexBuffer[pos];
}

GameObject.prototype.hasVertexBuffer = function(pos)
{
	return this.vertexBuffer[pos] != null;
}

//Index Buffer
GameObject.prototype.setIndexBuffer = function(buff, pos)
{
	this.indexBuffer = buff;	
}

GameObject.prototype.getIndexBuffer = function(pos)
{
	return this.indexBuffer[pos];
}

GameObject.prototype.hasIndexBuffer = function(pos)
{
	return this.indexBuffer[pos] != null;
}

//Normal Buffer
GameObject.prototype.setNormalBuffer = function(buff, pos)
{
	this.normalBuffer[pos] = buff;	
}

GameObject.prototype.getNormalBuffer = function(pos)
{
	return this.normalBuffer[pos];
}

GameObject.prototype.hasNormalBuffer = function(pos)
{
	return this.normalBuffer[pos] != null;
}

//TextureCoords Buffer
GameObject.prototype.setTextureCoordsBuffer = function(buff, pos)
{
	this.textureCoordsBuffer[pos] = buff;	
}

GameObject.prototype.getTextureCoordsBuffer = function(pos)
{
	return this.textureCoordsBuffer[pos];
}

GameObject.prototype.hasTextureCoordsBuffer = function(pos)
{
	return this.textureCoordsBuffer[pos] != null;
}

//Only index buffers change
GameObject.prototype.onlyIndicesChange = function()
{
	return this.onlyIndices;
}

//Set texture
GameObject.prototype.setTexture = function(pos, texture)
{
	this.textures[pos] = texture;

	//If the texture isn't loaded, mark the object as not loaded
	if (!texture.loaded)
	{
		this.loaded = false;
	}
}

//Get texture
GameObject.prototype.getTexture = function(pos)
{
	return this.textures[pos];
}

//Height map object
HeightmapTerrain.prototype = new GameObject;
HeightmapTerrain.prototype.constructor = HeightmapTerrain;
function HeightmapTerrain(fileLoc)
{
	GameObject.call(this);

	//Custom properties
	this.type = "heightmap";
	this.drawType = gl.TRIANGLE_STRIP;

	//Image for the heightmap
	this.imageFile = new Image(); 

	var imageData = getData(this.imageFile, fileLoc);

	var heights = Array();
	var normals = Array();
	var textureCoords = Array();

	var mapWidth = this.imageFile.width;
	var mapHeight = this.imageFile.height;

	//Generate positions for vertices
	for (var i = 0; i < mapHeight; i++)
	{
		for (var j = 0; j < mapWidth; j++)
		{
			heights[3 * (i * mapWidth + j)] = i;
			heights[3 * (i * mapWidth + j) + 1] = (imageData.data[4 * (i * mapWidth + j)]) / 63.75;
			heights[3 * (i * mapWidth + j) + 2] = j;

			//Initialize normals to 0
			normals[3 * (i * mapWidth + j)] = 0;
			normals[3 * (i * mapWidth + j) + 1] = 0;
			normals[3 * (i * mapWidth + j) + 2] = 0;

			//Set up texture coords
			textureCoords.push(i / 10.0);
			textureCoords.push(j / 10.0);
		}
	}

	//Generate indicies for triangles
	var indices = Array();
	var count = 2;

	//Initialize
	indices[0] = 0;
	indices[1] = 1;

	for (var i = 0; i < mapWidth - 1; i++)
	{
		//Even row/column
		if (i % 2 == 0)
		{
			for (var j = 1; j < mapHeight; j++)
			{
				indices[count++] = j * mapWidth + i;
				indices[count++] = j * mapWidth + i + 1;
			}

			//Degenerate to continue to next row/column
			if (i < mapWidth - 2)
			{
				indices[count++] = indices[count - 2];
				indices[count++] = indices[count - 2];
				indices[count++] = mapWidth * (mapHeight - 1) + i + 2;
			}
		}
		//Odd row/column
		else
		{
			for (var j = mapHeight - 2; j >= 0; j--)
			{
				indices[count++] = j * mapWidth + i;
				indices[count++] = j * mapWidth + i + 1;
			}

			//Degenerate to continue to next row/column
			if (i < mapWidth - 2)
			{
				indices[count++] = indices[count - 2];
				indices[count++] = indices[count - 2];
				indices[count++] = i + 2;
			}					
		}
	}

	//Figure out normals
	for (var i = 0; i < indices.length - 2; i++)
	{
		if (indices[i] != indices[i + 1] && indices[i] != indices[i + 2] && indices[i + 1] != indices[i + 2])
		{

			var a = $V([heights[3 * indices[i]], heights[3 * indices[i] + 1], heights[3 * indices[i] + 2]]);
			var b = $V([heights[3 * indices[i + 1]], heights[3 * indices[i + 1] + 1], heights[3 * indices[i + 1] + 2]]);
			var c = $V([heights[3 * indices[i + 2]], heights[3 * indices[i + 2] + 1], heights[3 * indices[i + 2] + 2]]);

			var d;
			//Flip flop as the indices are stored based on opengl triangle strip
			//so every other set will be opposite winding
			if (i % 2 == 0)
			{
				b = b.subtract(a);
				c = c.subtract(a);

				d = b.cross(c);
			}
			else
			{
				a = a.subtract(b);
				c = c.subtract(b);

				d = a.cross(c);
			}				

			//Add to normals
			normals[3 * indices[i]] += d.e(1);
			normals[3 * indices[i] + 1] += d.e(2);
			normals[3 * indices[i] + 2] += d.e(3);

			normals[3 * indices[i + 1]] += d.e(1);
			normals[3 * indices[i + 1] + 1] += d.e(2);
			normals[3 * indices[i + 1] + 2] += d.e(3);

			normals[3 * indices[i + 2]] += d.e(1);
			normals[3 * indices[i + 2] + 1] += d.e(2);
			normals[3 * indices[i + 2] + 2] += d.e(3);
		}
	}

	//Create the vertex buffer
	this.vertexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(heights), gl.STATIC_DRAW);
	this.vertexBuffer[0].size = heights.length / 3;

	//Create the index buffer
	this.indexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer[0]);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer[0].size = indices.length;

	//Create the normal buffer
	this.normalBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.normalBuffer[0].size = normals.length / 3;

	//Create the texture coordinate buffer
	this.textureCoordsBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.textureCoordsBuffer[0].size = textureCoords.length / 2;

	//Buffer count
	this.numberOfBuffers = 1;

	//Clean up
	this.foo = heights; //Temporary
//	heights = null;
	normals = null;
	indices = null;
	textureCoords = null;
	imageData = null;
}

Impostor.prototype = new GameObject;
Impostor.prototype.constructor = Impostor;
function Impostor(width, height, texture)
{
	GameObject.call(this);

	//Custom properties
	this.type = "impostor";
	this.drawType = gl.TRIANGLES;

	var heights = Array();
	var normals = Array();

	var count = 0;

	//Z axis front
	heights[count++] = 0;
	heights[count++] = 0;
	heights[count++] = -width / 2;
		
	heights[count++] = 0;
	heights[count++] = 0;
	heights[count++] = width / 2;

	heights[count++] = 0;
	heights[count++] = height;
	heights[count++] = width / 2;

	heights[count++] = 0;
	heights[count++] = height;
	heights[count++] = -width / 2;

	//Z front normals
	for (var i = 0; i < 4; i++)
	{
		normals[3 * i] = 1;
		normals[3 * i + 1] = 0;
		normals[3 * i + 2] = 0;
	}

	//X axis front
	heights[count++] = -width / 2;
	heights[count++] = 0;
	heights[count++] = 0;

	heights[count++] = width / 2;
	heights[count++] = 0;
	heights[count++] = 0;

	heights[count++] = width / 2;
	heights[count++] = height;
	heights[count++] = 0;

	heights[count++] = -width / 2;
	heights[count++] = height;
	heights[count++] = 0;

	//X front normals
	for (var i = 0; i < 4; i++)
	{
		normals[3 * i + 12] = 0;
		normals[3 * i + 13] = 0;
		normals[3 * i + 14] = 1;
	}

	//Copy over for back side usage
	for (var i = 0; i < count; i++)
	{
		heights[count + i] = heights[i];
	}

	//Copy normals and flip them
	for (var i = 0; i < count; i++)
	{
		normals[count + i] = normals[i] * -1;
	}

//	for (var i = 0; i < normals.length; i += 3)
//	{
//		normals[i] = 0;
//		normals[i + 1] = 1;
//		normals[i + 2] = 0;
//	}


	var indices = Array();

	//Front Z
	indices[0] = 0;
	indices[1] = 1;
	indices[2] = 3;

	indices[3] = 3;
	indices[4] = 1;
	indices[5] = 2;

	//Front X
	indices[6] = 4;
	indices[7] = 5;
	indices[8] = 7;

	indices[9] = 7;
	indices[10] = 5;
	indices[11] = 6;

	//Z and X Back faces
	for (var i = 11; i >= 0; i--)
	{
		indices[indices.length] = indices[i];
	}

	//Set up texture coordinates
	var textureCoords = Array();
	
	textureCoords.push(0)
	textureCoords.push(1)

	textureCoords.push(1)
	textureCoords.push(1)

	textureCoords.push(1)
	textureCoords.push(0)

	textureCoords.push(0)
	textureCoords.push(0)

	//Copy coords over for the other faces
	for (var i = 0; i < 24; i++)
	{
		textureCoords.push(textureCoords[i % 8]);
	}

	//Create the vertex buffer
	this.vertexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(heights), gl.STATIC_DRAW);
	this.vertexBuffer[0].size = heights.length / 3;

	//Create the index buffer
	this.indexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer[0]);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer[0].size = indices.length;

	//Create the normal buffer
	this.normalBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.normalBuffer[0].size = normals.length / 3;

	//Create the texture coordinate buffer
	this.textureCoordsBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
	this.textureCoordsBuffer[0].size = textureCoords.length / 2;

	//Buffer count
	this.numberOfBuffers = 1;

	//Clean up
	heights = null;
	normals = null;
	indices = null;
	textureCoords = null;
}

//Model object
Model.prototype = new GameObject;
Model.prototype.constructor = Model;
function Model(fileLocation)
{
	GameObject.call(this);

	//Custom properties
	this.type = "model";
	this.drawType = gl.TRIANGLES;

	loadObj(this, fileLocation);
}

//Skybox object
Skybox.prototype = new GameObject;
Skybox.prototype.constructor = Skybox;
function Skybox()
{
	GameObject.call(this);

	//Custom properties
	this.type = "skybox";
	this.drawType = gl.TRIANGLES;

	var vertices = Array();
	
	for (var i = 0; i < 8; i++)
	{
		//X
		if (i & 1)
		{
			vertices[vertices.length] = 1;
		}
		else
		{
			vertices[vertices.length] = -1;
		}

		//Y
		if (i & 4)
		{
			vertices[vertices.length] = 1;
		}
		else
		{
			vertices[vertices.length] = -1;
		}

		//Z
		if (i & 2)
		{
			vertices[vertices.length] = 1;
		}
		else
		{
			vertices[vertices.length] = -1;
		}
	}

	var normals = Array();
	for (var i = 0; i < vertices.length; i++)
	{
		normals[i] = vertices[i];
	}


	var indices = Array();
	
	//Bottom
	indices[0] = 0;
	indices[1] = 2;
	indices[2] = 1;
	indices[3] = 1;
	indices[4] = 2;
	indices[5] = 3;

	//Top
	indices[6] = 5;
	indices[7] = 6;
	indices[8] = 4;
	indices[9] = 7;
	indices[10] = 6;
	indices[11] = 5;


	//Z Negative
	indices[12] = 5;
	indices[13] = 4;
	indices[14] = 0;
	indices[15] = 5;
	indices[16] = 0;
	indices[17] = 1;

	//Z Positive
	indices[18] = 6;
	indices[19] = 7;
	indices[20] = 3;
	indices[21] = 6;
	indices[22] = 3;
	indices[23] = 2;

	//X Negative
	indices[24] = 4;
	indices[25] = 6;
	indices[26] = 2;
	indices[27] = 4;
	indices[28] = 2;
	indices[29] = 0;

	//X Positive
	indices[30] = 7;
	indices[31] = 5;
	indices[32] = 1;
	indices[33] = 7;
	indices[34] = 1;
	indices[35] = 3;


	//Create the vertex buffer
	this.vertexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer[0].size = vertices.length / 3;

	//Create the index buffer
	this.indexBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer[0]);	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer[0].size = indices.length;

	//Create the normal buffer
	this.normalBuffer[0] = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer[0]);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.normalBuffer[0].size = normals.length / 3;

//	//Create the texture coordinate buffer
//	this.textureCoordsBuffer[0] = gl.createBuffer();
//	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer[0]);
//	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
//	this.textureCoordsBuffer[0].size = textureCoords.length / 2;

	//Buffer count
	this.numberOfBuffers = 1;
}

//This function takes a javascript image object and returns an array of pixel data from it in r,g,b,a format.
function getData(image, loc)
{

	image.loaded = false;
	image.onload = new function()
	{
		image.loaded = true;
	};

	image.src = loc;


	//Block until heightmap loads
	while (!image.loaded)
	{
	}

	var canvas = document.getElementById("imageCanvas");
	canvas.width  = image.width;
	canvas.height = image.height;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);

	var image_data;
	try {
	  image_data =  ctx.getImageData(0, 0, image.width, image.height);
	} catch (e) {
	  //netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
	  image_data = ctx.getImageData(0, 0, image.width, image.height);
	}
	return image_data;
}
