import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');

const scene: THREE.Scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true 
});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 1 );
document.body.appendChild( renderer.domElement );

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.up.set( 1, 0, 0 );
camera.position.set( 0, 2, 2 );

const controls = new OrbitControls( camera, renderer.domElement );

window.addEventListener( 'resize', function() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
} );

class mCube {
    position: THREE.Vector3;
    size: THREE.Vector3;
    color: number;
    cube: THREE.LineSegments;

    constructor(position: THREE.Vector3, size: THREE.Vector3, color: number) {
        this.position = position;
        this.size = size;
        this.color = color;

        const vertices: THREE.Vector3[] = this.initVertices();
        const indices: number[] = this.initIndices();
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(vertices.length * 3);
        const colors = new Float32Array(vertices.length * 3);
        const indicesArray = new Uint16Array(indices);
        const c = new THREE.Color();

        for (let i = 0; i < vertices.length; i++) {
            const vertex = vertices[i].clone().multiply(this.size).add(this.position);
            vertex.toArray(positions, i * 3);
            c.setHex(color);
            c.toArray(colors, i * 3);
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setIndex(new THREE.BufferAttribute(indicesArray, 1));
        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        this.cube = new THREE.LineSegments(geometry, material);

        scene.add(this.cube);
    }

    initVertices() {
        const vertices = [
            new THREE.Vector3(-0.5, -0.5, 0.5),
            new THREE.Vector3(0.5, -0.5, 0.5),
            new THREE.Vector3(0.5, 0.5, 0.5),
            new THREE.Vector3(-0.5, 0.5, 0.5),
            new THREE.Vector3(-0.5, 0.5, -0.5),
            new THREE.Vector3(-0.5, -0.5, -0.5),
            new THREE.Vector3(0.5, -0.5, -0.5),
            new THREE.Vector3(0.5, 0.5, -0.5),
        ];
        return vertices;
    }

    initIndices() {
        const indices = [
            0, 1, 1, 2, 2, 3, 3, 0, // Front face
            4, 5, 5, 6, 6, 7, 7, 4, // Back face
            0, 5, 1, 6, 2, 7, 3, 4  // Side edges
        ];
        return indices;
    }

    rotateX(angle: number) {
        this.cube.rotateX(angle);
    }

    rotateY(angle: number) {
        this.cube.rotateY(angle);
    }

    rotateZ(angle: number) {
        this.cube.rotateZ(angle);
    }

    rotate(eulers: THREE.Euler) {
        this.cube.setRotationFromEuler(eulers);
    }

    translate(translation: THREE.Vector3) {
        this.cube.position.add(translation);
    }

    scale(scale: THREE.Vector3) {
        this.size.multiply(scale);
    }

}

function render() {
    requestAnimationFrame(render);
    const cube = new mCube(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1,1,1), 0x00ff00);
    cube.rotate(new THREE.Euler(0, Math.PI / 4, Math.PI / 4));

    // add axis helpers
    const axesHelper = new THREE.AxesHelper( 1 );
    scene.add( axesHelper );
    renderer.render(scene, camera);
}

render(); // Start the render loop