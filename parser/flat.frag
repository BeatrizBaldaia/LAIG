#ifdef GL_ES
precision highp float;
#endif

varying vec4 vFinalColor;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform bool uUseTexture;

uniform float uTimeFactor;
//uniform vec4 uSelectColor;
uniform float colorScale;

vec3 getColor(float factor) {
    if(factor >= 0.0 && factor < 10.0) {
       return vec3(1.0, factor/10.0, 0.0);
    } else if(factor >= 10.0 && factor < 20.0) {
        return vec3(1.0-((factor - 10.0)/10.0), 1.0, 0.0);
    } else if(factor >= 20.0 && factor < 30.0) {
        return vec3(0.0 , 1.0, (factor - 20.0)/10.0);
    } else if(factor >= 30.0 && factor < 40.0) {
        return vec3(0.0 , 1.0-((factor - 30.0)/10.0), 1.0);
    } else if(factor >= 40.0 && factor < 50.0) {
        return vec3((factor - 40.0)/10.0 , 0, 1.0);
    } else if(factor >= 50.0 && factor <= 60.0) {
        return vec3(1.0 , 0, 1.0-((factor - 50.0)/10.0));
    }
}

vec4 mixer(vec4 colorBeforeChange, vec3 colorChange) {
	vec4 result = vec4(0.0, 0.0, 0.0, 1.0);
	result.rgb = colorBeforeChange.rgb * uTimeFactor;
	//result.rgb += uSelectColor.rgb * (1.0 - uTimeFactor);
	result.rgb += colorChange * (1.0 - uTimeFactor);
  	return result;
}

void main() {
    vec3 colorChange = getColor(colorScale);
	if (uUseTexture)
	{
		vec4 textureColor = texture2D(uSampler, vTextureCoord);
		gl_FragColor = mixer(textureColor * vFinalColor, colorChange);
	}
	else
		gl_FragColor = mixer(vFinalColor, colorChange);

}