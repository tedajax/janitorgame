/*
*	Terrain.js
*	Reads in the height map
*	Loads the textures
*	Draws the terrain
*/
var hmImage = new Image();
function Terrain() {
	//var hmImage = new Image();
	this.imageData = Object();
	this.height; this.width;
	this.isLoaded = false;
	this.textures = new Array();
	this.textures.isLoaded = false;
	this.vBuffer;	this.vRangeBuffer;	this.iBuffer;	this.nBuffer;
	this.maxY = -1000;	this.minY = 1000;
	this.urls = ["sand.png","grass.png","rock.png","snow.png"];
	hmImage.p = this;
	hmImage.onload = function() {
		hmImage.p.Initialize(hmImage);
	};
	hmImage.src = "mediumtest.png";
	
	this.loadTextures(this.urls);
	this.shader = new TerrainShader();
};

Terrain.prototype.Initialize = function(image) {
	//initTerrainShaders();
	this.imageData = aManager.getPixelData(image);
	this.height = image.height;
	this.width = image.width;
	//create array of vertices 
	var tiles = 10;
	var uv = new Array();
	var verts = new Array();
	var vRange = new Array();
	for(var i = 0; i < image.width * image.height; i++) {
		verts.push((i % image.width) / (image.width - 1));  //x
		verts.push(this.imageData.data[i*4] / 255);  //y
		verts.push(Math.floor(i / image.height) / (image.height - 1));  //z
		if(this.maxY < verts[verts.length - 2]) {
			this.maxY = verts[verts.length - 2];
		} 
		if(this.minY > verts[verts.length - 2]) {
			this.minY = verts[verts.length - 2];
		}
		uv.push(verts[verts.length - 3] * tiles);
		uv.push(verts[verts.length - 1] * tiles);
	}
	
	for(var i = 0; i < image.width * image.height; i++) {
		vRange.push((verts[i * 3 + 1] - this.minY) / (this.maxY - this.minY));
	}
	
	for(var j = 1; j < verts.length; j+=3) {
		verts[j] -= this.minY;
	}
	this.verts = verts;
	this.vRangeBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vRangeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vRange), gl.STATIC_DRAW);
	this.vRangeBuffer.itemSize = 1;
	this.vRangeBuffer.numItems = vRange.length;
	
	//create and fill vertex position buffer
	this.vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	this.vBuffer.itemSize = 3;
	this.vBuffer.numItems = verts.length / 3;
	
	//create and fill uv buffer
	this.uvBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
	this.uvBuffer.itemSize = 2;
	this.uvBuffer.numItems = uv.length / 2;
	
	//create and fill index buffer;
	this.iBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
	//------------
	var indices = new Array();
	var indicesIndex = 0;
	indices.push(0);
	indices.push(this.imageData.width);
	for(var i = 1; i < (this.imageData.width - 1) * this.imageData.height; i++) {
		if(i % this.imageData.width == 0) {
			indices.push(indices[indices.length - 1]);
			indices.push(i);
		}
		indices.push(i);
		indices.push(i + this.imageData.width);
	}
	
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.iBuffer.itemSize = 1;
	this.iBuffer.numItems = indices.length;
	
	//create and fill normal buffer
	this.nBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
	
	var normals = new Array();
	for(var k = 0; k < verts.length; k++) {
		normals[k] = 0;
	}
	for(var i = 0; i < indices.length; i++) {
	
		var index1 = indices[i] * 3;
		var index2 = indices[i + 1] * 3;
		var index3 = indices[i + 2] * 3;
		
		var v1 = Vector.create([verts[index1], verts[index1 + 1], verts[index1 + 2]]);
		var v2 = Vector.create([verts[index2], verts[index2 + 1], verts[index2 + 2]]);
		var v3 = Vector.create([verts[index3], verts[index3 + 1], verts[index3 + 2]]);
		
		var v1v2 = v1.subtract(v2);
		var v1v3 = v1.subtract(v3);
		
		var normalVec;
		if(i % 2 == 0) {
			normalVec = v1v2.cross(v1v3);
		} else {
			normalVec = v1v3.cross(v1v2);
		}
		
		normalVec = normalVec.toUnitVector();
		
		normals[index1] += normalVec.e(1);
		normals[index1 + 1] += normalVec.e(2);
		normals[index1 + 2] += normalVec.e(3);
		
		normals[index2] += normalVec.e(1);
		normals[index2 + 1] += normalVec.e(2);
		normals[index2 + 2] += normalVec.e(3);
		
		normals[index3] += normalVec.e(1);
		normals[index3 + 1] += normalVec.e(2);
		normals[index3 + 2] += normalVec.e(3);
	}
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.nBuffer.itemSize = 3;
	this.nBuffer.numItems = verts.length;	
		
	this.isLoaded = true;
};

Terrain.prototype.loadTextures = function (urls) {
	for(var i = 0; i < urls.length; i++) {
		this.textures.push(aManager.getTexture(urls[i]));
	}
};


//draws the terrain
Terrain.prototype.Draw = function() {
	if(this.isLoaded) {
		//set the shader for terrain
		gl.useProgram(this.shader.program);
		//binds the buffers
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
		
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[2]);
		
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, this.textures[3]);
		
		this.shader.pMatrix = pMatrix;
		this.shader.mvMatrix = mvMatrix;
		nMatrix = mvMatrix.inverse();
		nMatrix = nMatrix.transpose();
		this.shader.nMatrix = nMatrix;
		
		this.shader.maxHeight = this.maxY;
		
		this.shader.drawSetup();
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
		gl.vertexAttribPointer(this.shader.vertexPositionAttribute, this.vBuffer.itemSize, gl.FLOAT, false, 0, 0);
				
		gl.bindBuffer(gl.ARRAY_BUFFER, this.nBuffer);
		gl.vertexAttribPointer(this.shader.vertexNormalAttribute, this.nBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
		gl.vertexAttribPointer(this.shader.textCoordAttribute, this.uvBuffer.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
		//draws the terrain
		gl.drawElements(gl.TRIANGLE_STRIP, this.iBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
};

Terrain.prototype.getHeight = function(x, z) {
	var y = 0;
	if(this.isLoaded){
		var xInd = Math.ceil(x * (this.width-1));
		var zInd = Math.ceil(z * (this.height-1));
		var idx = zInd * this.width + xInd;
		y = (this.verts[idx*3+1]);
	}
	return y;
};