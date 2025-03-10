import { Uniform } from "three";
import { BlendFunction, Effect } from "postprocessing";

export class MonoEffect extends Effect {

        // `
        // void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        //
        //     float gray = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
        //
        //     outputColor = vec4(vec3(gray), inputColor.a);
        // }
        // `


    constructor() {
        super("MonoEffect", 
        `
        void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

            float gray = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));
            gray = gray - mod(gray, 0.1);
            float opacity = min((1.0 - gray), inputColor.a);

            outputColor = vec4(vec3(0), opacity);
        }
        `, {
            blendFunction: BlendFunction.NORMAL,
            uniforms: new Map([
                ["opacity", new Uniform(1)]
            ])
        });
    }
}
