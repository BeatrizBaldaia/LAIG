#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform bool uUseTexture;

uniform float uTimeFactor;

uniform vec4 uSelectColor;

vec4 mixer(vec4 colorBeforeChange) {
	vec4 result = vec4(0.0, 0.0, 0.0, 1.0);
	result.rgb = colorBeforeChange.rgb * uTimeFactor;
	result.rgb += uSelectColor.rgb * (1.0 - uTimeFactor);
  	return result;
}

void main() {

	if (uUseTexture)
	{
		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = mixer(textureColor * vFinalColor);
	}
	else
		gl_FragColor = mixer(vFinalColor);

}