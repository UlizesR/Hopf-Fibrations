import * as THREE from 'three';

// Import our custom functions
import { setupUI } from './Input';
import { setupRenderer, setupCamera } from './Graphics';
import { createGeometry } from './hopf';

// Set up the canvas and the scenes
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const scene1: THREE.Scene = new THREE.Scene();
const scene2: THREE.Scene = new THREE.Scene();
const scenes: THREE.Scene[] = [scene1, scene2];

// Set up the UI, renderer, and camera
const { sliderElements, labelElements } = setupUI();
const renderer = setupRenderer(canvas);
const { camera, camera2 } = setupCamera(renderer);

// Set up the window resize event listener
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

// Set up the sliders and labels
const { sliderP, sliderT, sliderPh, sliderD } = sliderElements;
const { inputLabelP, inputLabelT, inputLabelPh, inputLabelD } = labelElements;

// Set up the initial values
const angles = [Number(sliderT.value), Number(sliderPh.value), Number(sliderD.value)];
let numOfPoints = Number(sliderP.value);

// Function to handle slider input events
const handleSliderInput = (slider: HTMLInputElement, label: HTMLElement, angleIndex: number) => {
    const value = Number(slider.value);
    label.innerHTML = `${slider.name}: ${value}`;
    angles[angleIndex] = value;
    createGeometry({ scenes, numOfPoints, angles });
};

// Set up the input event listeners
sliderP.oninput = () => {
    numOfPoints = Number(sliderP.value);
    inputLabelP!.innerHTML = `Points: ${numOfPoints}`;
    createGeometry({ scenes, numOfPoints, angles });
};

// Add the event listeners for the angle sliders
sliderT.oninput = () => handleSliderInput(sliderT, inputLabelT!, 0);
sliderPh.oninput = () => handleSliderInput(sliderPh, inputLabelPh!, 1);
sliderD.oninput = () => handleSliderInput(sliderD, inputLabelD!, 2);

// Render function to render both scenes
function render() {
    requestAnimationFrame(render);

    // Render scene1
    renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
    renderer.setScissorTest(true);
    renderer.render(scene1, camera);

    // Render scene2 in a small rectangle at the bottom left of the window
    const width = window.innerWidth / 4;                // Adjust as needed
    const height = window.innerHeight / 3;              // Adjust as needed
    camera2.aspect = width / height;                    // Set the aspect ratio of camera2 to match the viewport
    camera2.updateProjectionMatrix();                   // Update the projection matrix after changing the aspect ratio
    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.setScissorTest(true);
    renderer.render(scene2, camera2);
}

// Create the geometry initially and start the render loop
createGeometry({ scenes, numOfPoints, angles });
render();