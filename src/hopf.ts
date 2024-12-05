import * as THREE from 'three';

interface GeometryProps {
    scenes: THREE.Scene[],
    numOfPoints: number,
    angles: number[]
}

export function createGeometry(props: GeometryProps) {
    const { scenes, numOfPoints, angles } = props;
    const radius = 1;
    const incrementT = 0.001;
    const twoPi = 2 * Math.PI;

    // Clear the scene of previous lines and spheres
    scenes.forEach(scene => {
        scene.children = scene.children.filter(child => 
            !(child instanceof THREE.Line || (child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry))
        );
    });

    // Create and add a wireframe sphere to the second scene
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, transparent: true, opacity: 0.5 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), sphereMaterial);
    scenes[1].add(sphere);

    // Precompute angles in radians
    const alphaD = angles[2] * Math.PI / 180;
    const basePhi = angles[1] * Math.PI / 180;
    const baseTheta = angles[0] * Math.PI / 180;

    for (let i = 0; i < numOfPoints; i++) {
        // Calculate phi and theta for the current point
        const phi = basePhi + i * 6 * Math.PI / 180;  // 6 degrees in radians
        let theta = baseTheta;

        // Adjust theta based on the position in the arc
        if (i === 0) {
            theta += alphaD / 2;
        } else if (i === numOfPoints - 1) {
            theta -= alphaD / 2;
        } else {
            theta += alphaD / 2 - alphaD / (numOfPoints - 1) * i;
        }

        // Calculate the coordinates of the point
        const a = radius * Math.sin(theta) * Math.cos(phi);
        const b = radius * Math.sin(theta) * Math.sin(phi);
        const c = radius * Math.cos(theta);

        // Calculate the color for the point
        const color = new THREE.Color().setHSL(i / numOfPoints, 1, 0.5);

        // Create and add the point to the second scene
        const pointGeometry = new THREE.SphereGeometry(0.025, 32, 32);
        const pointMaterial = new THREE.MeshBasicMaterial({ color });
        const point = new THREE.Mesh(pointGeometry, pointMaterial);
        point.position.set(a, c, b);
        scenes[1].add(point);

        // Prepare to create the line
        const positions = [];
        const alpha = Math.sqrt((1 + c) / 2);
        const beta = Math.sqrt((1 - c) / 2);

        // Calculate the positions for the line
        for (let t = 0; t < twoPi + incrementT; t += incrementT) {
            const theta = Math.atan2(b, -a) - t;
            const w = alpha * Math.cos(theta);
            const x = alpha * Math.sin(theta);
            const y = beta * Math.cos(t);
            const z = beta * Math.sin(t);
            const r = (Math.acos(w) / Math.PI) / Math.sqrt(1 - w ** 2);
            positions.push(r * x, r * z, r * y);
        }

        // Create and add the line to the first scene
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color });
        scenes[0].add(new THREE.Line(lineGeometry, lineMaterial));

        // Dispose of the geometries and materials to free up memory
        lineGeometry.dispose();
        pointGeometry.dispose();
    }
}