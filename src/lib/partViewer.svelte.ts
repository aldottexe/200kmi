import * as THREE from 'three';

import { monoShader } from './monoPass';
import { RenderPass, RenderPixelatedPass, ShaderPass, OutputPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { Tween } from 'svelte/motion';

let partsRootResolver: Function;
// the root of all the parts
let partsRoot: Promise<THREE.Mesh> = new Promise(resolve => partsRootResolver = resolve)
let targetPosition = new Tween({ x: 0, y: 0, z: 0 }, { duration: 200 })
let targetScale = new Tween({ s: 0 }, { duration: 200 })

// the currently viewed part, resolves when partsRoot does.
let currentlyViewedPart: Promise<THREE.Mesh> | THREE.Object3D = new Promise(async resolve => resolve(await partsRoot));

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let bw: ShaderPass;
let pixel: RenderPixelatedPass;
let out: OutputPass;

let orbit: THREE.Mesh;

let clock = new THREE.Clock();

// MATERIALS
const hover = new THREE.MeshBasicMaterial({ name: "hover", color: 0x00eeff })
const hidden = new THREE.MeshBasicMaterial({ name: "hidden", color: 0x00eeff, transparent: true, opacity: .1, })
const hiddenhover = new THREE.MeshBasicMaterial({ name: "hiddenHover", color: 0x00eeff, transparent: true, opacity: .6, })
const shown = new THREE.MeshStandardMaterial({ name: "shown", metalness: .8, roughness: .6 })

// MANIFEST
let manifestResolver: Function;
export const manifest: Promise<Map<String, Array<THREE.Object3D>>> = new Promise(resolve => manifestResolver = resolve);

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
export async function navigate(url: String) {
  if (!url)
    return;
  let r = url.split("/").pop()
  const p = await queryPart(r || "");
  if (r === "p" || r === "") {
    (await partsRoot).visible = true;
    selectPart(await partsRoot);
    return;
  }
  if (p) {
    (await partsRoot).visible = true;
    await selectPart(p);
    return;
  }
  (await partsRoot).visible = false;
}

// BUTTON
export function partButton(node: HTMLAnchorElement, p: { part: string, i: number | undefined }) {
  queryPart(p.part, p.i).then((boundPart) => {
    if (boundPart) {
      node.addEventListener("mouseenter", () => highlightPart(boundPart, true));
      node.addEventListener("mouseleave", () => highlightPart(boundPart, false));
    }
  });
}

export async function queryPart(name: String, i: number | undefined = undefined): Promise<THREE.Object3D | undefined> {
  name = name.replaceAll(/-| /g, '_');

  if (!(await manifest).has(name))
    return undefined;

  //@ts-expect-error
  if (i && (await manifest).get(name)[i])
    //@ts-expect-error
    return (await manifest).get(name)[i]

  const currentbb = traversedBoundingBoxCenter(await currentlyViewedPart).center;

  //@ts-expect-error
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
    highlightPart(boundPart, false);
    (await partsRoot).traverse((p: any) => { if (p.isMesh) p.material = hidden });
    boundPart.traverse((p: any) => { if (p.isMesh) p.material = shown })
    currentlyViewedPart = boundPart;
    positionModelAtPart(await currentlyViewedPart);
  }
}

function highlightPart(boundPart: THREE.Object3D, highlight: boolean) {
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


async function positionModelAtPartOld(m: THREE.Object3D) {

  const rootPosition = (await partsRoot).position.setScalar(0);
  (await partsRoot).updateMatrixWorld();

  let { center, size, box }: { center: THREE.Vector3, size: THREE.Vector3, box: THREE.Box3 } = traversedBoundingBoxCenter(m);

  // // Calculate the size of the bounding box
  const maxDim = Math.max(size.x, size.y, size.z);

  (await partsRoot).position.sub(center.multiplyScalar(1 / maxDim));
  (await partsRoot).scale.multiplyScalar(1 / maxDim);

  (await partsRoot).updateMatrixWorld();

  (() => {
    let { center, size, box }: { center: THREE.Vector3, size: THREE.Vector3, box: THREE.Box3 } = traversedBoundingBoxCenter(m);
    const helper = new THREE.Box3Helper(box)
    scene.add(helper);
    const maxDim = Math.max(size.x, size.y, size.z);
    console.log("post translation center(", center, ")post translation scale(", maxDim, ")")
    setTimeout(() => { helper.removeFromParent(); helper.dispose() }, 1000);
  })();

  function bh() {
    const helper = new THREE.Box3Helper(box)
    scene.add(helper);
    setTimeout(() => { helper.removeFromParent(); helper.dispose() }, 1000);
  }
}

async function positionModelAtPart(m: THREE.Object3D) {

  const scale = 2;
  let { center, size, box }: { center: THREE.Vector3, size: THREE.Vector3, box: THREE.Box3 } = traversedBoundingBoxCenter(m);

  const root = await partsRoot;

  // draw first box
  bh(box.clone());

  // Calculate the size of the bounding box
  const maxDim = Math.max(size.x, size.y, size.z);

  // the current location of the root
  const rootCenter = root.position.clone();

  // rootPos B
  // center A
  // B + (A - B) * s
  const targetOrigin = center.clone()
  //rotate it back to normal
  targetOrigin.applyQuaternion(new THREE.Quaternion().setFromEuler(orbit.rotation.clone()).invert());
  targetOrigin.sub(rootCenter);
  targetOrigin.multiplyScalar(scale / maxDim);
  targetOrigin.add(rootCenter);


  // update the position
  const newPos = rootCenter.sub(targetOrigin);
  targetPosition.set({ x: newPos.x, y: newPos.y, z: newPos.z });

  // scale it
  const newScale = root.clone().scale.multiplyScalar(scale / maxDim);
  targetScale.set({ s: newScale.x });

  // update matrix world
  root.updateMatrixWorld();


  setTimeout(()=>bh(traversedBoundingBoxCenter(m).box), 200)

  function ln(p1: THREE.Vector3, p2: THREE.Vector3) {
    const geometry = new THREE.BufferGeometry().setFromPoints([p1, p2]);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    scene.add(line);
    setTimeout(() => { line.removeFromParent(); }, 500);
  }

  function bh(b: THREE.Box3, delay: number = 0) {
    setTimeout(() => {
      const helper = new THREE.Box3Helper(b, 0xff0000)
      scene.add(helper);
      setTimeout(() => { helper.removeFromParent(); helper.dispose() }, 500);
    }, delay);
  }

  function circle(c: THREE.Vector3, delay: number = 0) {
    setTimeout(() => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(.05));
      sphere.position.copy(c);
      scene.add(sphere);
      setTimeout(() => { sphere.removeFromParent(); }, 500);
    }, delay);
  }
}

function traversedBoundingBoxCenter(m: THREE.Object3D): { center: THREE.Vector3, size: THREE.Vector3, box: THREE.Box3 } {
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

  return { center: center, size: size, box: boundingBox };
}

///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////

export function init(node: HTMLCanvasElement) {

  // RENDERER
  renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', depth: false, antialias: false, canvas: node, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // CAMERA
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 2;

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


  //orbit
  orbit = new THREE.Mesh();
  scene.add(orbit);

  // OBJECT
  new GLTFLoader().load('/piston.glb', async (root) => {
    const mesh = root.scene.children[0];

    mesh.scale.set(.4, .4, .4);
    mesh.rotation.z += .5;
    mesh.traverse((c: any) => { if (c.isMesh) c.material = shown; });

    orbit.add(mesh);
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
  document.addEventListener('scroll', onScroll);

  onScroll();
  animate();
}

function onScroll() {
  const bounds = {min: new THREE.Vector2, max: new THREE.Vector2()};
  camera.getViewBounds(2, bounds.min, bounds.max)
  // multiply by 2 for perfect match, anything else is a paralax effect
  camera.position.y = (window.pageYOffset / window.innerHeight) * (bounds.max.y, bounds.min.y) * 2;
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
async function animate() {
  const p = await partsRoot
  renderer.setAnimationLoop(a);
  function a() {
    composer.render();
    p.position.set(targetPosition.current.x, targetPosition.current.y, targetPosition.current.z);
    p.scale.setScalar(targetScale.current.s);
    orbit.rotateY(.4 * clock.getDelta());
  }
}
