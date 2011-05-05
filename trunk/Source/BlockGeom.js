function BlockGeom()
{
	BlockGeom.vertexBuffer = gl.createBuffer();
	BlockGeom.indexBuffer = gl.createBuffer();
	BlockGeom.texCoordBuffer = gl.createBuffer();
	
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
					 
	gl.bindBuffer(gl.ARRAY_BUFFER, BlockGeom.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	BlockGeom.vertexBuffer.itemSize = 3;
	BlockGeom.numItems = 8;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, BlockGeom.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	BlockGeom.texCoordBuffer.itemSize = 2;
	BlockGeom.texCoordBuffer.numItems = 8;
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, BlockGeom.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	BlockGeom.indexBuffer.itemSize = 1;
	BlockGeom.indexBuffer.numItems = 36;
};