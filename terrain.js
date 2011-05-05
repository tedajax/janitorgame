function loadHeightmap(image)
{
	var imgcanvas = document.createElement("canvas");
	var imgcontext = imgcanvas.getContext("2d");
	imgcontext.width = image.width;
	imgcontext.height = image.height;
	imgcontext.drawImage(image, 0, 0);	
	return imgcontext.getImageData(0, 0, imgcontext.width, imgcontext.height);
};

function terrain()
{
	var heightImage = new Image();
	
	terrain.maxHeight = 64.0;
	
	terrain.tileCountX = 16;
	terrain.tileCountZ = 16;

	terrain.scaleX = 2.0;
	terrain.scaleZ = 2.0;
	
	terrain.vertexBuffer;
	terrain.indexBuffer;
	terrain.normalBuffer;
	//terrain.colorBuffer;
	terrain.texCoordBuffer;
	
	terrain.width;
	terrain.height;
	
	terrain.loaded = false;	
	
	heightImage.onload = function()
	{
		terrainGenerate(heightImage);
	};
	
	heightImage.src = "mediumtest.png";
	
	terrain.vertices;
};

//returns height of terrain as given location
function getTerrainHeight(xPos, zPos)
{
	//check to see if location is within terrain space
	if (xPos < 0 || zPos < 0)
		return 0;
	
	var farX = terrain.width * terrain.scaleX;
	var farZ = terrain.height * terrain.scaleZ;
	
	if (xPos > farX ||
	    zPos > farZ)
		return 0;
	
	var vertX = Math.floor(xPos / terrain.scaleX);
	var vertZ = Math.floor(zPos / terrain.scaleZ);
	
	return terrain.vertices[((vertX * terrain.height + vertZ) * 3) + 1];
};

function terrainGenerate(hmImage)
{
	var heightdata = loadHeightmap(hmImage);
	var width = heightdata.width, height = heightdata.height;
	terrain.heightData = heightdata;
	
	terrain.width = width;
	terrain.height = height;
	
	//generate vertices from heightmap and store in vertex buffer
	terrain.vertexBuffer = gl.createBuffer();
	terrain.texCoordBuffer = gl.createBuffer();

	var currentPixel = 0;

	var vertices = new Array();
	var texCoords = new Array();
	
	terrain.vertexBuffer.itemSize = 3;
	terrain.vertexBuffer.numItems = 0;
	
	terrain.texCoordBuffer.itemSize = 2;
	terrain.texCoordBuffer.numItems = 0;
	
	for (var x = 0; x < width; x++)
	{
		for (var y = 0; y < height; y++)
		{
			var hd = 1.0 * heightdata.data[currentPixel];
			var h = hd / 255.0;
			
			//x coordinate
			vertices[y * 3 + (x * height * 3) + 0] = x * terrain.scaleX;
			//y coordinate
			vertices[y * 3 + (x * height * 3) + 1] = h * terrain.maxHeight;
			//z coordinate
			vertices[y * 3 + (x * height * 3) + 2] = y * terrain.scaleZ;
			
			texCoords.push(x * terrain.tileCountX / width);
			texCoords.push(y * terrain.tileCountZ / height);
			
			currentPixel += 4;
			
			terrain.vertexBuffer.numItems++;
			terrain.texCoordBuffer.numItems++;
		}
	}
	
	terrain.vertices = vertices;
	
	/*for (var i = 0; i < width * height; i++)
	{
		var hd = heightdata.data[i * 4] / 255.0;
		
		vertices[(i * 3)] = (i % width) * 4.0;
		vertices[(i * 3) + 1] = (hd) * terrain.maxHeight;
		vertices[(i * 3) + 2] = -(Math.floor(i / height)) * 4.0;
		terrain.vertexBuffer.numItems++;
	}*/
	
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

	//create index buffer setup for triangle strips
	terrain.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrain.indexBuffer);

	//generate indices for triangle strip rendering
	terrain.indexBuffer.itemSize = 1;
	terrain.indexBuffer.numItems = 0;
	var indices = new Array();
	for (var x = 0; x < width - 1; x++)
	{
		//down side of terrain one way
		for (var y = 0; y < height; y++)
		{
			indices.push(x * width + y);
			terrain.indexBuffer.numItems++;
			indices.push((x + 1) * width + y);
			terrain.indexBuffer.numItems++;
		}
		
		x++;
		
		//back the other
		if (x < width - 1)
		{
			for (var y = height - 1; y >= 0; y--)
			{
				indices.push(x * width + y);
				terrain.indexBuffer.numItems++;
				indices.push((x + 1) * width + y);
				terrain.indexBuffer.numItems++;
			}
		}
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
				  new Uint16Array(indices),
				  gl.STATIC_DRAW);

	//create normals
	
	terrain.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, terrain.normalBuffer);
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
	
	terrain.loaded = true;
};

