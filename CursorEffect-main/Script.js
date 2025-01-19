import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Lenis from '@studio-freight/lenis';

// GSAP and ScrollTrigger are now available globally
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    w/h,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer ({
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(w,h);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.5;
document.querySelector(".model").appendChild(renderer.domElement);


const ambientLight = new THREE.AmbientLight(0xfffffff, 0.75);
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 7.5);
mainLight.position.set(0.5, 7.5, 2.5);
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 2.5);
fillLight.position.set(-15, 0, -5);
scene.add(fillLight);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1.5);
hemiLight.position.set(0, 0, 0);
scene.add(hemiLight);
 
function basicAnimate() {
    renderer.render(scene, camera);
    requestAnimationFrame(basicAnimate);
}

basicAnimate();

let model;
const loader = new GLTFLoader();
loader.load("./assets/brigg-_joachim-_allwordt (1).glb", function (gltf) {
    model = gltf.scene;
    model.traverse((node) => {
        if(node.isMesh) {
            if(node.material) {
                node.material.metalness = 2;
                node.material.roughness = 3;
                node.material.envMapIntensity = 5;
            }
            node.castShadow = true;
            node.receiveshadow = true;
        }
    });

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    scene.add(model);

    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    camera.position.z = maxDim *1.75;
    
    model.rotation.set(0, 0.5, 0);
    playIntialRotation();

    cancelAnimationFrame(basicAnimate);
    animate();
});
