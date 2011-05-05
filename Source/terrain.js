function Terrain()
{
	var heightImage = new Image();
	this.shader = new TerrainShader();
	
	this.maxHeight = 64.0;
	
	this.tileCountX = 16;
	this.tileCountZ = 16;
	
	this.urls = ["./Assets/Textures/sand.png","./Assets/Textures/grass.png","./Assets/Textures/rock.png","./Assets/Textures/snow.png"];
	this.textures = new Array();

	this.scaleX = 2.0;
	this.scaleZ = 2.0;
	
	this.vertexBuffer;
	this.indexBuffer;
	this.normalBuffer;
	//terrain.colorBuffer;
	this.texCoordBuffer;
	
	this.width;
	this.height;
	
	this.loaded = false;	
	heightImage.p = this;
	heightImage.onload = function()
	{
		heightImage.p.terrainGenerate(heightImage);
	};
	
	heightImage.src = "./Assets/Textures/mediumtest.png";
	this.loadTextures(this.urls);
	this.vertices;
};

Terrain.prototype.loadTextures = function (urls) {
	for(var i = 0; i < urls.length; i++) {
		this.textures.push(aManager.getTexture(urls[i]));
	}
};

//returns height of terrain as given location
Terrain.prototype.getHeight = function(xPos, zPos)
{
	//check to see if location is within terrain space
	if (xPos < 0 || zPos < 0)
		return 0;
	
	var farX = this.width * this.scaleX;
	var farZ = this.height * this.scaleZ;
	
	if (xPos > farX ||
	    zPos > farZ)
		return 0;
	
	var vertX = Math.floor(xPos / this.scaleX);
	var vertZ = Math.floor(zPos / this.scaleZ);
	
	return this.vertices[((vertX * this.height + vertZ) * 3) + 1];
};

Terrain.prototype.terrainGenerate = function(hmImage)
{
	var heightdata = this.loadHeightmap(hmImage);
	var width = heightdata.width, height = heightdata.height;
	this.heightData = heightdata;
	
	this.width = width;
	this.height = height;
	
	//generate vertices from heightmap and store in vertex buffer
	this.vertexBuffer = gl.createBuffer();
	this.texCoordBuffer = gl.createBuffer();

	var currentPixel = 0;

	var vertices = new Array();
	var texCoords = new Array();
	
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = 0;
	
	this.texCoordBuffer.itemSize = 2;
	this.texCoordBuffer.numItems = 0;
	
	for (var x = 0; x < width; x++)
	{
		for (var y = 0; y < height; y++)
		{
			var hd = 1.0 * heightdata.data[currentPixel];
			var h = hd / 255.0;
			
			//x coordinate
			vertices[y * 3 + (x * height * 3) + 0] = x * this.scaleX;
			//y coordinate
			vertices[y * 3 + (x * height * 3) + 1] = h * this.maxHeight;
			//z coordinate
			vertices[y * 3 + (x * height * 3) + 2] = y * this.scaleZ;
			
			texCoords.push(x * this.tileCountX / width);
			texCoords.push(y * this.tileCountZ / height);
			
			currentPixel += 4;
			
			this.vertexBuffer.numItems++;
			this.texCoordBuffer.numItems++;
		}
	}
	
	this.vertices = vertices;
	
	/*for (var i = 0; i < width * height; i++)
	{
		var hd = heightdata.data[i * 4] / 255.0;
		
		vertices[(i * 3)] = (i % width) * 4.0;
		vertices[(i * 3) + 1] = (hd) * this.maxHeight;
		vertices[(i * 3) + 2] = -(Math.floor(i / height)) * 4.0;
		this.vertexBuffer.numItems++;
	}*/
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

	//create index buffer setup for triangle strips
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

	//generate indices for triangle strip rendering
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 0;
	var indices = new Array();
	for (var x = 0; x < width - 1; x++)
	{
		//down side of terrain one way
		for (var y = 0; y < height; y++)
		{
			indices.push(x * width + y);
			this.indexBuffer.numItems++;
			indices.push((x + 1) * width + y);
			this.indexBuffer.numItems++;
		}
		
		x++;
		
		//back the other
		if (x < width - 1)
		{
			for (var y = height - 1; y >= 0; y--)
			{
				indices.push(x * width + y);
				this.indexBuffer.numItems++;
				indices.push((x + 1) * width + y);
				this.indexBuffer.numItems++;
			}
		}
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				  new Uint16Array(indices),
				  gl.STATIC_DRAW);

	//create normals
	
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	var normals = new Array();
	
	//add number of normals equals to number of vertices and set to 0, 0, 0
	for (var i = 0; i < vertices.length; i++)
	{
		normals[i] = 0;
	}
	
	for (var j = 0; j < indices.length - 2; j++)
	{
		var vert1 = indices[j] * 3;
		var vert2 = indices[j+1] * 3;
		var vert3 = indices[j+2] * 3;
		
		//create side from vert 1 and 3
		var sideA = Vector.create([vertices[vert1] - vertices[vert3], 
								   vertices[vert1 + 1] - vertices[vert3 + 1], 
								   vertices[vert1 + 2] - vertices[vert3 + 2]]);
		//create side from vert 1 and 2
		var sideB = Vector.create([vertices[vert1] - vertices[vert2], 
								   vertices[vert1 + 1] - vertices[vert2 + 1], 
								   vertices[vert1 + 2] - vertices[vert2 + 2]]);
		
		//normal is cross product of sides
		var n = sideA.cross(sideB);
		//normalize
		n = n.toUnitVector();
		
		if(n.e(2)>0)
		{
			normals[vert1] += n.e(0);
			normals[vert1+1] += n.e(1);
			normals[vert1+2] += n.e(2);
	
			normals[vert2] += n.e(0);
			normals[vert2+1] += n.e(1);
			normals[vert2+2] += n.e(2);
			
			normals[vert3] += n.e(0);
			normals[vert3+1] += n.e(1);
			normals[vert3+2] += n.e(2);
		}
		else
		{
			normals[vert1]-=n.e(0);
			normals[vert1+1]-=n.e(1);
			normals[vert1+2]-=n.e(2);
	
			normals[vert2]-=n.e(0);
			normals[vert2+1]-=n.e(1);
			normals[vert2+2]-=n.e(2);
			
			normals[vert3]-=n.e(0);
			normals[vert3+1]-=n.e(1);
		}			
	}
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	
	this.loaded = true;
};

Terrain.prototype.loadHeightmap = function(image)
{
	var imgcanvas = document.createElement("canvas");
	var imgcontext = imgcanvas.getContext("2d");
	imgcontext.width = image.width;
	imgcontext.height = image.height;
	imgcontext.drawImage(image, 0, 0);	
	return imgcontext.getImageData(0, 0, imgcontext.width, imgcontext.height);
};

Terrain.prototype.draw = function()
{
	if (this.loaded)
	{		
		gl.useProgram(this.shader.program);
	
		this.shader.cameraPosition = Vector.create([eyeX, eyeY, eyeZ]);
	
		//set textures
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
				
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
			
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
				
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
		
		this.shader.pMatrix = pMatrix;
		this.shader.mvMatrix = mvMatrix;
		nMatrix = mvMatrix.inverse();
		nMatrix = nMatrix.transpose();
		this.shader.nMatrix = nMatrix;
		
		this.shader.maxHeight = this.maxHeight;
		
		this.shader.drawSetup();
		
		//bind vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
		gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//bind normals
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
		gl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//bind texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
		gl.vertexAttribPointer(this.shader.program.textureCoordAttribute, this.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

		//lightingAndNormals();
		
		//bind indices and draw with them
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
		gl.drawElements(gl.TRIANGLE_STRIP, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
};

