import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function setupRenderer(canvas: HTMLCanvasElement) {
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
    });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0x000000, 1 );

    return renderer;
}

export function setupCamera(renderer: THREE.WebGLRenderer) {
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.up.set( 1, 0, 0 );
    camera.position.set( 0, 2, 0 );

    const camera2 = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera2.position.set(3, 0, 0 );
    camera2.lookAt( 0, 0, 0 );
    camera2.near = 0.1;

    const controls1 = new OrbitControls( camera, renderer.domElement );
    const controls2 = new OrbitControls( camera2, renderer.domElement );

    return { camera, camera2, controls1, controls2 };
}