// 3D Earth Globe with Flight Paths
class GlobeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.earth = null;
        this.flightPaths = [];
        this.airplanes = [];
        this.controls = null;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        document.getElementById('globe-container').appendChild(this.renderer.domElement);
        
        // Orbit Controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
        
        // Create Earth
        this.createEarth();
        
        // Create Flight Paths
        this.createFlightPaths();
        
        // Create Airplanes
        this.createAirplanes();
        
        // Add Stars
        this.addStars();
        
        // Handle resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // GSAP animations on scroll
        this.setupScrollAnimations();
    }
    
    createEarth() {
        const geometry = new THREE.SphereGeometry(2, 64, 64);
        
        // Earth texture
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg');
        const earthBump = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_normal_2048.jpg');
        const earthSpec = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_specular_2048.jpg');
        
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            bumpMap: earthBump,
            bumpScale: 0.05,
            specularMap: earthSpec,
            specular: new THREE.Color(0x333333),
            shininess: 5
        });
        
        this.earth = new THREE.Mesh(geometry, material);
        this.scene.add(this.earth);
        
        // Atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(2.05, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
            color: 0x0099ff,
            transparent: true,
            opacity: 0.1
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphere);
    }
    
    createFlightPaths() {
        // Major international routes
        const routes = [
            { from: [0, 51], to: [73, 40] }, // London to New York
            { from: [139, 35], to: [116, 40] }, // Tokyo to Beijing
            { from: [37, 55], to: [2, 48] }, // Moscow to Paris
            { from: [72, 18], to: [77, 28] }, // Mumbai to Delhi
            { from: [151, -33], to: [144, -37] }, // Sydney to Melbourne
            { from: [103, 1], to: [100, 13] }, // Singapore to Bangkok
            { from: [-99, 19], to: [-58, -34] }, // Mexico City to Buenos Aires
            { from: [31, 30], to: [46, 24] }, // Cairo to Riyadh
            { from: [-3, 40], to: [13, 52] }, // Madrid to Berlin
            { from: [28, 41], to: [32, 39] } // Istanbul to Ankara
        ];
        
        routes.forEach(route => {
            const path = this.createCurvedPath(route.from, route.to);
            this.flightPaths.push(path);
            this.scene.add(path);
        });
    }
    
    createCurvedPath(fromCoord, toCoord) {
        const fromLat = fromCoord[1] * Math.PI / 180;
        const fromLon = fromCoord[0] * Math.PI / 180;
        const toLat = toCoord[1] * Math.PI / 180;
        const toLon = toCoord[0] * Math.PI / 180;
        
        const radius = 2.1;
        
        const fromPos = new THREE.Vector3(
            radius * Math.cos(fromLat) * Math.cos(fromLon),
            radius * Math.sin(fromLat),
            radius * Math.cos(fromLat) * Math.sin(fromLon)
        );
        
        const toPos = new THREE.Vector3(
            radius * Math.cos(toLat) * Math.cos(toLon),
            radius * Math.sin(toLat),
            radius * Math.cos(toLat) * Math.sin(toLon)
        );
        
        // Create curved line
        const curve = new THREE.QuadraticBezierCurve3(
            fromPos,
            new THREE.Vector3(0, 0, 0),
            toPos
        );
        
        const points = curve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0xff6b6b,
            transparent: true,
            opacity: 0.5
        });
        
        return new THREE.Line(geometry, material);
    }
    
    createAirplanes() {
        const airplaneGeometry = new THREE.ConeGeometry(0.02, 0.1, 3);
        const airplaneMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // Create multiple airplanes
        for (let i = 0; i < 10; i++) {
            const airplane = new THREE.Mesh(airplaneGeometry, airplaneMaterial);
            
            // Position on a flight path
            const pathIndex = i % this.flightPaths.length;
            const path = this.flightPaths[pathIndex];
            const position = path.geometry.attributes.position;
            
            if (position && position.count > 0) {
                const pointIndex = Math.floor(position.count * Math.random());
                const x = position.getX(pointIndex);
                const y = position.getY(pointIndex);
                const z = position.getZ(pointIndex);
                
                airplane.position.set(x, y, z);
                airplane.lookAt(new THREE.Vector3(0, 0, 0));
            }
            
            this.airplanes.push({
                mesh: airplane,
                path: path,
                progress: Math.random(),
                speed: 0.001 + Math.random() * 0.002
            });
            
            this.scene.add(airplane);
        }
    }
    
    addStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 1000;
        const positions = new Float32Array(starCount * 3);
        
        for (let i = 0; i < starCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 100;
            positions[i + 1] = (Math.random() - 0.5) * 100;
            positions[i + 2] = (Math.random() - 0.5) * 100;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true
        });
        
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
    }
    
    setupScrollAnimations() {
        // Animate camera on scroll
        ScrollTrigger.create({
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
                this.camera.position.z = 5 + self.progress * 2;
                this.earth.rotation.y += 0.001;
            }
        });
        
        // Rotate earth continuously
        gsap.to(this.earth.rotation, {
            y: Math.PI * 2,
            duration: 60,
            repeat: -1,
            ease: "none"
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Update airplane positions
        this.airplanes.forEach(airplane => {
            airplane.progress += airplane.speed;
            if (airplane.progress > 1) airplane.progress = 0;
            
            const path = airplane.path;
            const position = path.geometry.attributes.position;
            
            if (position && position.count > 0) {
                const pointIndex = Math.floor(airplane.progress * (position.count - 1));
                const x = position.getX(pointIndex);
                const y = position.getY(pointIndex);
                const z = position.getZ(pointIndex);
                
                airplane.mesh.position.set(x, y, z);
                airplane.mesh.lookAt(new THREE.Vector3(0, 0, 0));
            }
        });
        
        // Update controls
        this.controls.update();
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

// Initialize 3D scene when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const globe = new GlobeScene();
        
        // Hide loader after 2 seconds
        setTimeout(() => {
            document.getElementById('loader').style.display = 'none';
        }, 2000);
    }, 100);
});