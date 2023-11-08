import * as THREE from 'three';

export default class Scene {
    constructor() {}

    async start(rawData) {
        if (!this.renderer) {
            this.scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
            camera.position.set( 0 , 400, 400 );
            camera.lookAt( 0, 0, 0 );
    
            this.camera = camera;
            const renderer = new THREE.WebGLRenderer({
            });
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.body.appendChild( renderer.domElement );
            this.renderer = renderer;
        }

        const latitude = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
        const longitude = [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];

        rawData.forEach((data) => {
            latitude[0] = Math.min(latitude[0], data.latitude)
            latitude[1] = Math.max(latitude[1], data.latitude)
            longitude[0] = Math.min(longitude[0], data.longitude)
            longitude[1] = Math.max(longitude[1], data.longitude)
        });


        const points = rawData.map((data) => {
            const latitudeValue = latitude[1] === latitude[0] ? 300 : (data.latitude - latitude[0]) / (latitude[1] - latitude[0]) * 300;
            const longitudeValue = longitude[1] === longitude[0] ? 300 : (data.longitude - longitude[0]) / (longitude[1] - longitude[0]) * 300;
            return new THREE.Vector3( longitudeValue, latitudeValue, data.altitude ) 
        });

        this.rawData = rawData;


        const geometry = new THREE.BufferGeometry().setFromPoints( points );
        const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
        const line = new THREE.Line( geometry, material );
        this.scene.add( line );

        this.line = line;
        
        this.line.geometry.center();

        const dotGeometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3( 0, 0, 0)]);
        const dotMaterial = new THREE.PointsMaterial( { size: 5, sizeAttenuation: false, color: 0x888888 } );
        this.dot = new THREE.Points( dotGeometry, dotMaterial );
        this.scene.add( this.dot );

        this.count = 0;
        this.dotIndex = 0;
        this.animate();
    }

    animate = () => {
        const frames = 300;
        this.line.rotateOnAxis(new THREE.Vector3(0, 0, 1), 1 * Math.PI * 2 / frames)

        this.dotIndex++;

        const length = this.line.geometry.attributes.position.array.length / 3;
        this.dotIndex = this.dotIndex % length;
    

        const vector = this.line.geometry.attributes.position.array.slice(this.dotIndex * 3, this.dotIndex * 3 + 3)

        this.dot.position.set(vector[0], vector[1], vector[2]);

        this.dot.position.applyQuaternion( this.line.quaternion );


        const rawData = this.rawData[this.dotIndex]
        document.querySelector('.altitude .value').textContent = `${rawData.altitude.toFixed(2)} m`;

        this.renderer.render( this.scene, this.camera );
        this.rafId = requestAnimationFrame( this.animate );
    }

    dispose() {
        cancelAnimationFrame(this.rafId);
        this.line.removeFromParent();
        this.dot.removeFromParent();
    }
}