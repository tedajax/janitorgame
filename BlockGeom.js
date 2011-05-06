function BlockGeom()
{
	this.vertexBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();
	this.texCoordBuffer = gl.createBuffer();
	
	var vertices = [-1,  1, -1,
					-1, -1, -1,
					 1, -1, -1,
					 1,  1, -1,
					
  					 1,  1,  1,
					 1, -1,  1,
					-1, -1,  1,
					-1,  1,  1];
					
	var indices = [0, 1, 2,
				   2, 3, 0,
				   
				   3, 2, 5,
				   5, 4, 3,
				   
				   4, 5, 6,
				   6, 7, 4,
				   
				   7, 6, 1,
				   1, 0, 7,
				   
				   7, 0, 3,
				   3, 4, 7,
				   
				   1, 6, 5,
				   5, 2, 1];
				   
	var texCoords = [1, 0,
					 1, 1,
					 0, 1,
					 0, 0,
					 
					 1, 0,
					 1, 1,
					 0, 1,
					 0, 0];
					 
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.numItems = 8;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	this.texCoordBuffer.itemSize = 2;
	this.texCoordBuffer.numItems = 8;
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 36;
};