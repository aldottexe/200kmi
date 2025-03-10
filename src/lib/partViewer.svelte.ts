import * as THREE from 'three';

import { BloomEffect, NoiseEffect, KawaseBlurPass, EffectComposer, EffectPass, RenderPass, LuminancePass, PixelationEffect } from "postprocessing";
import { MonoEffect } from './monoEffect';
import { RenderPixelatedPass } from 'three/examples/jsm/Addons.js';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let piston: any;

export function init(node: HTMLCanvasElement) {

	// RENDERER
	renderer = new THREE.WebGLRenderer({powerPreference:'high-performance', depth: false, antialias: false, canvas: node, alpha: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// CAMERA
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.z = 2;

	const orbit = new OrbitControls(camera, node)

	// SCENE
	scene = new THREE.Scene();
	// scene.background = new THREE.Color("#eee")

	// HDRI
	// convert to gainmap using
	// https://gainmap-creator.monogrid.com/
	const loader = new UltraHDRLoader();
	loader.setDataType(THREE.FloatType);
	loader.load('3.jpg', t => {
		console.log(t);
		t.mapping = THREE.EquirectangularReflectionMapping;
		t.needsUpdate = true;

		// scene.background = t;
		scene.environment = t;
	});

	// LIGHTS
	// const light = new THREE.PointLight(0xc0b3ed, 20);
	// const light2 = new THREE.PointLight(0x7587a1, 20);
	// const light3 = new THREE.AmbientLight(0xffffff, 1);
	//
	// light.position.set(4, 0, 2);
	// light2.position.set(-2, 0, -2);
	//
	// scene.add(light);
	// scene.add(light2);
	// scene.add(light3);
	//
	// scene.add(new THREE.PointLightHelper(light));
	// scene.add(new THREE.PointLightHelper(light2));

	// OBJECT
	const objLoader = new OBJLoader();
	objLoader.load('piston.obj', (root) => {
		piston = root
		piston.scale.set(.4, .4, .4);
		scene.add(piston);
		piston.rotation.z += 1;

		const mat = new THREE.MeshStandardMaterial({ metalness: .8, roughness: .6 })
		piston.children.forEach((c: THREE.Mesh) => c.material = mat);
	});

	renderer.setAnimationLoop(animate);

	// EFFECTS
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	// composer.addPass(new RenderPixelatedPass(6, scene, camera))

	const bw = new MonoEffect();
	composer.addPass(new EffectPass(camera, bw));

	const pixel = new PixelationEffect(7);
	composer.addPass(new EffectPass(camera, pixel));


	// const blur = new KawaseBlurPass();
	// blur.scale = .5;
	// composer.addPass(blur);
	//
	// const noise = new NoiseEffect()
	// noise.blendMode.opacity = new THREE.Uniform(.2);
	//
	// const bloomPass = new EffectPass(camera, new BloomEffect(), noise);
	// composer.addPass(bloomPass);

	window.addEventListener('resize', onWindowResize);
}

// RESIZE
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

// ANIMATE
function animate() {

	if (piston) {
		piston.rotation.y += 0.005;
	}

	composer.render();

}
