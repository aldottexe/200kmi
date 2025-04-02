export const monoShader = {

	name: 'monoShader',

	uniforms: {

		'tDiffuse': { value: null },
		'u_resolution': { value: null },

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	// fragmentShader: `
	// 	uniform sampler2D tDiffuse;
	// 	uniform vec2 u_resolution;
	// 	varying vec2 vUv;
	//
	// 	void main() {
	// 		// location in pixels
	// 		vec2 pvUv = vUv * u_resolution.xy;
	// 
	// 		// location pixelated
	// 		vec2 pvUvn = pvUv - mod(pvUv, vec2(8.0)) + 3.0;
	//
	// 		// location pixelated normalized
	// 		pvUvn = pvUvn / u_resolution.xy;
	//
	// 		// the color of the pixel
	// 		vec4 c = texture2D(tDiffuse, pvUvn);
	//
	// 		// create an rgb texture
	// 		vec3 rgb = vec3(step(6.0, mod(pvUv.x, 8.0)), step(6.0, mod(pvUv.x + 2.0, 8.0)), step(6.0, mod(pvUv.x + 4.0, 8.0)));
	//
	// 		// make areas of low opacity max brightness
	// 		rgb = rgb * c.rgb + (rgb * (1.0 - c.a));
	//
	// 		float a = dot(rgb, c.rgb);
	//
	// 		float gridMask = max(step(6.0, mod(pvUv.x + 6.0, 8.0)), step(6.0, mod(pvUv.y + 6.0, 8.0)));
	//
	// 		// gl_FragColor = vec4(, min(0.8, gridMask));
	// 		gl_FragColor = vec4(mix(rgb, c.rgb, gridMask + .5), max(1.0 - gridMask, c.a) );
	// 	}
	// 	`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 u_resolution;
		varying vec2 vUv;

		void main() {
				vec2 grid = step(vec2(0.0), sin((vUv.xy * u_resolution.xy * 3.141592) / 2.5 + 1.0) - 0.3);

				vec2 pvUv = vUv * u_resolution.xy;
				pvUv = pvUv - mod(pvUv, vec2(5.0)) + 2.0;
				pvUv = pvUv / u_resolution.xy;

		    vec4 texel = texture2D(tDiffuse, pvUv);

		    float gray = dot(texel.rgb, vec3(0.229, 0.587, 0.114));
		    gray = gray - mod(gray, 0.05);

		    // float o = min(1.0 - gray, texel.a + .1);
				// o = min(o, 1.0 - max(grid.x, grid.y));
		    // gl_FragColor = vec4(texel.rgb * 0.09, 1) * o;

		    float o = max(gray, .005);
				o = min(o, 1.0 - max(grid.x, grid.y));
				vec3 color = .7 * vec3(0, 1, .5) + .4 * texel.rgb;
				// vec3 color = texel.rgb;
		    gl_FragColor = vec4(color, 1) * o;
		}`,
};
