attribute vec3 vertexPosition;
attribute vec4 vertexColor;
 
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) 
{
	gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
	vColor = vertexColor;
}
