import * as THREE from 'three';

interface GeometryProps {
    scenes: THREE.Scene[],
    numOfPoints: number,
    numCircles: number,
    angles: number[]
}

export function createGeometry(props: GeometryProps) {
    const { scenes, numOfPoints, angles } = props;
    const radius = 1;
    const incrementT = .001;
    const twoPi = 2 * Math.PI;

    // Clear the scene
    scenes.forEach(scene => {
        scene.children = scene.children.filter(child => !(child instanceof THREE.Line || (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry)));
    });

    // Wireframe sphere
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), sphereMaterial);
    scenes[1].add(sphere);

    for (let i = 0; i < numOfPoints; i++) {
        // Get the angles in radians
        const alphaD = (angles[2] * Math.PI / 180);
        const phi = (angles[1] * Math.PI / 180) + i * 6 * Math.PI / 180;  // 6 degrees in radians
        const theta = (angles[0] * Math.PI / 180);

        // Calculate the coordinates of the point
        const a = radius * Math.sin(theta) * Math.cos(phi);
        const b = radius * Math.sin(theta) * Math.sin(phi);
        const c = radius * Math.cos(theta);

        // Calculate the color
        const color = new THREE.Color().setHSL(i / numOfPoints, 1, .5);

        // Add point
        const pointGeometry = new THREE.SphereGeometry(0.025, 32, 32);
        const pointMaterial = new THREE.LineBasicMaterial({ color });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(a, c, b);
        scenes[1].add(point);

        // Add line
        const positions = [];

        // calculate the angle between the point and the z-axis
        const alpha = Math.sqrt((1 + c) / 2);
        const beta = Math.sqrt((1 - c) / 2);

        // Calculate the coordinates of the point of the lines
        for (let t = 0; t < twoPi + incrementT; t += incrementT) {
            const theta = Math.atan2(b, -a) - t;
            // Calculate the 4D coordinates of the point
            const w = alpha * Math.cos(theta);
            const x = alpha * Math.sin(theta);
            const y = beta * Math.cos(t);
            const z = beta * Math.sin(t);
            // calculate the radius of the point
            const r = (Math.acos(w) / Math.PI) / Math.sqrt(1 - w ** 2);
            // Add the point to the line
            positions.push(r * x, r * z, r * y);
        }

        // Add the line to the scene
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color });
        scenes[0].add(new THREE.Line(lineGeometry, lineMaterial));

        // Release the geometry and material
        lineGeometry.dispose();
        lineMaterial.dispose();
        pointGeometry.dispose();
        pointMaterial.dispose();
    }
}