/*
*	Model.js
*
*/

function Model(mUrl, tUrl) {
	this.ModelUrl = mUrl;
	this.textureUrl = tUrl;
	this.obj;
	this.texture;
	this.shader = new NonTerrainShader();
	this.Initialize();	
};
//init the model
Model.prototype.Initialize = function() {
	this.obj = aFactory.getModel(this.ModelUrl);
	this.texture = aFactory.getTexture(this.textureUrl);	
};
//Draws the model
Model.prototype.Draw = function() {
	if(this.obj.loaded) {
		//set shader program
		gl.useProgram(this.shader.shader);
		//bind buffers
		gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.vertexObject);
		gl.vertexAttribPointer(this.shader.shader.vertexPositionAttribute, this.obj.vertexObject.itemSize, gl.FLOAT, false, 0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.texCoordObject);
		gl.vertexAttribPointer(this.shader.shader.textureCoordAttribute,	this.obj.texCoordObject.itemSize, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.obj.normalObject);
		gl.vertexAttribPointer(this.shader.shader.vertexNormalAttribute, this.obj.normalObject.itemSize, gl.FLOAT, false, 0, 0);

		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(this.shader.shader.samplerUniform0, 0);
		
		this.shader.SetMatrixUniforms();
	
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.obj.indexObject);
		//draw
		gl.drawElements(gl.TRIANGLES, this.obj.indexObject.numItems, gl.UNSIGNED_SHORT, 0);
		mvMatrix = mvMatrix_bak;
	}
};

