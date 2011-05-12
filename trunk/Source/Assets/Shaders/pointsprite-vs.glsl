attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec3 uCameraPos;
uniform vec4 uColor;

varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vColor;

void main(void)
{
	vTextureCoord = aTextureCoord;
	vVertexPosition = aVertexPosition;
	vColor = uColor;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}