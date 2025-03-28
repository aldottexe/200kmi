import * as THREE from 'three';

import { monoShader } from './monoPass';
import { RenderPass, RenderPixelatedPass, ShaderPass, OutputPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


let partsRootResolver: Function;
// the root of all the parts
let partsRoot: Promise<THREE.Mesh> = new Promise(resolve => partsRootResolver = resolve)

// the currently viewed part, resolves when partsRoot does.
let currentlyViewedPart: Promise<THREE.Mesh> = new Promise(async resolve => resolve(await partsRoot));

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let bw: ShaderPass;
let pixel: RenderPixelatedPass;
let orbit: OrbitControls;
let out: OutputPass;

// MATERIALS
const hover = new THREE.MeshBasicMaterial({ name: "hover", color: 0x00eeff })
const hidden = new THREE.MeshBasicMaterial({ name: "hidden", color: 0x00eeff, transparent: true, opacity: .1, })
const hiddenhover = new THREE.MeshBasicMaterial({ name: "hiddenHover", color: 0x00eeff, transparent: true, opacity: .6, })
const shown = new THREE.MeshStandardMaterial({ name: "shown", metalness: .8, roughness: .6 })

// MANIFEST
let manifestResolver: Function;
const manifest: Promise<Map<String, Array<THREE.Object3D>>> = new Promise(resolve => manifestResolver = resolve);

function createPartsManifest(root: THREE.Object3D) {
  const m = new Map()
  root.traverse((p: THREE.Object3D) => {
    const name = p.name.split('0')[0];
    if (m.has(name))
      m.get(name)?.push(p)
    else
      m.set(name, [p])
  })
  manifestResolver(m);
}

// BUTTON
export async function partButton(node: HTMLAnchorElement, p: { part: string, i: number | undefined }) {
  const boundPart = await queryPart(p.part, p.i);
  node.addEventListener("mouseenter", () => highlightPart(boundPart, true));
  node.addEventListener("mouseleave", () => highlightPart(boundPart, false));
}

export async function queryPart(name: String, i: number | undefined = undefined): Promise<THREE.Object3D> {
  name = name.replaceAll(/-| /g, '_');
  if (i && (await manifest).get(name)[i])
    return (await manifest).get(name)[i]

  const currentbb = traversedBoundingBoxCenter(await currentlyViewedPart).center;

  let closestInstance: THREE.Object3D = (await manifest).get(name)[0];
  let closestDistance = Number.MAX_VALUE;

  (await manifest).get(name)?.forEach(instance => {
    const box = traversedBoundingBoxCenter(instance).center;
    const distance = box.distanceTo(currentbb)
    if (distance < closestDistance) {
      closestInstance = instance;
      closestDistance = distance;
    }
  });
  return closestInstance;
}

export async function selectPart(boundPart: THREE.Object3D) {
  if (boundPart) {
    console.log("select part")
    highlightPart(boundPart, false);
    (await partsRoot).traverse((p: any) => { if (p.isMesh) p.material = hidden });
    boundPart.traverse((p: any) => { if (p.isMesh) p.material = shown })
    currentlyViewedPart = boundPart;
    positionCameraOnGeometry(await currentlyViewedPart);
  }
}

function highlightPart(boundPart: any, highlight: boolean) {
  boundPart.traverse((c: any) => {
    if (c.isMesh) {
      if (highlight) {
        if (c.material?.name === "shown")
          c.material = hover;
        else
          c.material = hiddenhover;
      } else {
        if (c.material?.name === "hover")
          c.material = shown;
        else
          c.material = hidden;
      }
    }
  });
}


async function positionCameraOnGeometry(m: THREE.Object3D) {
  let { center, size } = traversedBoundingBoxCenter(m);
  orbit.target.copy(center);
  console.log("new orbit", center, m);

  // Calculate the size of the bounding box
  const maxDim = Math.max(size.x, size.y, size.z);

  // Adjust camera distance based on bounding box size
  const fov = camera.fov * (Math.PI / 180);
  const distance = maxDim / (2 * Math.tan(fov / 2)) + .2;

  orbit.maxDistance = distance;
  orbit.minDistance = distance;

  camera.updateProjectionMatrix();
}

function traversedBoundingBoxCenter(m: THREE.Object3D): { center: THREE.Vector3, size: THREE.Vector3 } {
  const boundingBox = new THREE.Box3();
  const tempBox = new THREE.Box3();
  m.updateMatrixWorld(true);
  m.traverse((c: any) => {
    if (c.isMesh) {
      c.geometry.computeBoundingBox();
      tempBox.copy(c.geometry.boundingBox);
      tempBox.applyMatrix4(c.matrixWorld);
      boundingBox.union(tempBox);
    }
  });

  const center = new THREE.Vector3();
  boundingBox.getCenter(center)

  const size = new THREE.Vector3();
  boundingBox.getSize(size);

  return { center: center, size: size };
}


export function init(node: HTMLCanvasElement) {

  // RENDERER
  renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', depth: false, antialias: false, canvas: node, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // CAMERA
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

  // ORBIT
  orbit = new OrbitControls(camera, node)
  orbit.enableZoom = false;
  orbit.enablePan = false;
  orbit.autoRotate = true;

  // SCENE
  scene = new THREE.Scene();

  // HDRI
  // convert to gainmap using
  // https://gainmap-creator.monogrid.com/
  const loader = new UltraHDRLoader();
  loader.setDataType(THREE.FloatType);
  loader.load('/3.jpg', t => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.needsUpdate = true;

    scene.environment = t;
    scene.environmentRotation = new THREE.Euler(3.14 / 6, 0, 0)
    t.dispose();
  });

  // OBJECT
  new GLTFLoader().load('/piston.glb', async (root) => {
    const mesh = root.scene.children[0];

    mesh.scale.set(.4, .4, .4);
    mesh.rotation.z += 1;
    mesh.traverse((c: any) => { if (c.isMesh) c.material = shown; });

    scene.add(mesh);
    createPartsManifest(mesh);

    partsRootResolver(mesh)
  });

  // EFFECTS
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  pixel = new RenderPixelatedPass(5, scene, camera)
  pixel.normalEdgeStrength = .2
  composer.addPass(pixel)

  bw = new ShaderPass(monoShader);
  bw.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  composer.addPass(bw);

  out = new OutputPass()
  composer.addPass(out);

  window.addEventListener('resize', onWindowResize);

  renderer.setAnimationLoop(animate);
}

// RESIZE
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  bw.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);

  pixel.setSize(window.innerWidth, window.innerHeight);

  composer.setSize(window.innerWidth, window.innerHeight)
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// ANIMATE
function animate() {

  orbit.update();
  composer.render();
}
