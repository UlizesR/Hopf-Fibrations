import * as THREE from 'three';

interface geometryProps {
    scenes: THREE.Scene[],
    numOfPoints: number,
    angles: number[]
}

export function createGeometry(props: geometryProps)
{
    // Clear the scene
    props.scenes[0].children = props.scenes[0].children.filter(child => !(child instanceof THREE.Line));
    props.scenes[1].children = props.scenes[1].children.filter(child => !(child instanceof THREE.Mesh && child.geometry instanceof THREE.SphereGeometry));

    const radius = 1;

    // wireframe sphere
    let smaterial = new THREE.MeshBasicMaterial({ 
        color: 0x808080,
        transparent: true,
        opacity: 0.5
    });

    let sphere = new THREE.Mesh( new THREE.SphereGeometry( radius, 32, 32 ), smaterial );
    props.scenes[1].add( sphere );

    // let points = [];
    
    for (let i = 0; i < props.numOfPoints; i++) 
    {
        let alphaD = (props.angles[2] * Math.PI / 180) ;
        let phi = (props.angles[1] * Math.PI / 180) + i * 6 * Math.PI / 180;  // 6 degrees in radians
        let theta = (props.angles[0] * Math.PI / 180)

        // if (i != 0 && i != Math.floor(props.numOfPoints / 2))
        // {
        //     if (i === Math.floor(props.numOfPoints / 4)) theta += alphaD;
        //     // else if (i === Math.floor(3 * props.numOfPoints / 4)) theta -= alphaD;

        //     // if (i < Math.floor(props.numOfPoints / 4)) theta += i * (4 / props.numOfPoints) * alphaD;
        //     // else if (i > props.numOfPoints / 4 && i < Math.floor( props.numOfPoints / 2)) theta += (i - (i % Math.floor(props.numOfPoints))) * alphaD;
        //     // else if (i > props.numOfPoints / 2 && i < 3 * props.numOfPoints / 4) theta -= (i - 1 - Math.floor(props.numOfPoints / 2)) * alphaD;
        //     // else if (i > Math.floor(3 * props.numOfPoints / 4)) theta -= i * (4 / props.numOfPoints) * alphaD;
        // }
        const a = radius * Math.sin(theta) * Math.cos(phi);
        const b = radius * Math.sin(theta) * Math.sin(phi);
        const c = radius * Math.cos(theta);
        let pgeometry = new THREE.SphereGeometry( 0.025, 32, 32 );
        let pmaterial =  new THREE.LineBasicMaterial( { color: new THREE.Color().setHSL( i / props.numOfPoints , 1, .5 ) } );
        let sphere = new THREE.Mesh( pgeometry, pmaterial );
        sphere.position.set(a, c, b);
        props.scenes[1].add( sphere );
    
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const incrementT = .001;
        const twoPi = 2 * Math.PI;
        const alpha = Math.sqrt( (1+c)/2 );
        const beta = Math.sqrt( (1-c)/2 );
    
        for ( let t = 0 ; t < twoPi + incrementT; t += incrementT ) {
    
            let theta:number = Math.atan2(b, -a) - t;
    
            const w = alpha * Math.cos(theta);
            const x = alpha * Math.sin(theta);
            const y = beta * Math.cos(t);
            const z = beta * Math.sin(t);
    
            let r = (Math.acos(w) / Math.PI) / Math.sqrt( 1 - w**2 );
    
            positions.push( r*x, r*z, r*y );
        }
    
        const float32Array = new Float32Array(positions);
        geometry.setAttribute('position', new THREE.BufferAttribute(float32Array, 3));
    
        const material = new THREE.LineBasicMaterial( { color: new THREE.Color().setHSL( i / props.numOfPoints, 1, .5 ) } );
        
        props.scenes[0].add( new THREE.Line( geometry, material ) );
    
        // release the geometry and material
        geometry.dispose();
        material.dispose();
    }
}