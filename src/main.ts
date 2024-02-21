import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { createGeometry } from './geometry';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

const scene1: THREE.Scene = new THREE.Scene();
const scene2: THREE.Scene = new THREE.Scene();

const scenes: THREE.Scene[] = [scene1, scene2];

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true  // Add this line
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 1 );  // Set clear color alpha to 0 for transparency
// document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.up.set( 1, 0, 0 );
camera.position.set( 0, 2, 0 );

const camera2 = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
// camera2.up.set( 0, 1, 0 );
camera2.position.set(3, 0, 0 );
camera2.lookAt( 0, 0, 0 );
camera2.near = 0.1;

const controls1 = new OrbitControls( camera, renderer.domElement );
const controls2 = new OrbitControls( camera2, renderer.domElement );

window.addEventListener( 'resize', function() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
} );

const sliderElements = {
    sliderP: document.getElementById("sliderP") as HTMLInputElement,
    sliderT: document.getElementById("sliderT") as HTMLInputElement,
    sliderPh: document.getElementById("sliderPh") as HTMLInputElement,
    sliderAp: document.getElementById("sliderAp") as HTMLInputElement,
};

const labelElements = {
    inputLabelP: document.getElementById("inputLabelP"),
    inputLabelT: document.getElementById("inputLabelT"),
    inputLabelPh: document.getElementById("inputLabelPh"),
    inputLabelAp: document.getElementById("inputLabelAp"),
};

const { sliderP, sliderT, sliderPh, sliderAp } = sliderElements;
const { inputLabelP, inputLabelT, inputLabelPh, inputLabelAp } = labelElements;

const angles = [Number(sliderT.value), Number(sliderPh.value), Number(sliderAp.value)];
let numOfPoints = Number(sliderP.value);

const handleSliderInput = (slider: HTMLInputElement, label: HTMLElement, angleIndex: number) => {
    const value = Number(slider.value);
    label.innerHTML = `${slider.name}: ${value}`;
    // MathJax.typeset([label]);  // Typeset the new LaTeX code
    angles[angleIndex] = value;
    createGeometry({ scenes, numOfPoints, angles });
};

sliderP.oninput = () => {
    numOfPoints = Number(sliderP.value);
    inputLabelP!.innerHTML = `Points: ${numOfPoints}`;
    // MathJax.typeset([inputLabelP]);  // Typeset the new LaTeX code
    createGeometry({ scenes, numOfPoints, angles });
};

sliderT.oninput = () => handleSliderInput(sliderT, inputLabelT!, 0);
sliderPh.oninput = () => handleSliderInput(sliderPh, inputLabelPh!, 1);
sliderAp.oninput = () => handleSliderInput(sliderAp, inputLabelAp!, 2);

function render() {
    requestAnimationFrame(render);

    // Render scene1
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.render(scene1, camera);

    // Render scene2 in a small rectangle at the bottom left of the window
    const width = window.innerWidth / 4;  // Adjust as needed
    const height = window.innerHeight / 3;  // Adjust as needed
    camera2.aspect = width / height;  // Set the aspect ratio of camera2 to match the viewport
    camera2.updateProjectionMatrix();  // Update the projection matrix after changing the aspect ratio
    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.setScissorTest(true);
    // Don't set a background color for scene2
    // scene2.background = new THREE.Color(0x8080f0);
    renderer.render(scene2, camera2);
}

createGeometry({scenes, numOfPoints, angles}); // Create the geometry initially
render(); // Start the render loop