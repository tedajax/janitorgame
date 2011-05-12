#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexSampler;

varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vColor;

void main(void)
{
	vec4 texCol = texture2D(uTexSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	
	gl_FragColor = texCol;
	//gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}