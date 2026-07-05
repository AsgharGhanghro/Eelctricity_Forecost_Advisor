// 3D Energy Flow Visualization
class EnergyScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.house = null;
        this.energyParticles = [];
        this.currentData = null;
        
        this.init();
        this.animate();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.set(10, 8, 10);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        const container = document.getElementById('three-container');
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);
        
        // Add lights
        this.addLights();
        
        // Create house structure
        this.createHouse();
        
        // Create energy flow system
        this.createEnergyFlow();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 20, 5);
        this.scene.add(directionalLight);
        
        // Point light for energy glow
        const pointLight = new THREE.PointLight(0x4ecdc4, 1, 20);
        pointLight.position.set(0, 3, 0);
        this.scene.add(pointLight);
    }
    
    createHouse() {
        const houseGroup = new THREE.Group();
        
        // Base (foundation)
        const baseGeometry = new THREE.BoxGeometry(8, 0.5, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = -0.25;
        houseGroup.add(base);
        
        // Main house
        const houseGeometry = new THREE.BoxGeometry(7, 5, 7);
        const houseMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x87CEEB,
            transparent: true,
            opacity: 0.8
        });
        const house = new THREE.Mesh(houseGeometry, houseMaterial);
        house.position.y = 2.5;
        houseGroup.add(house);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(5, 2, 4);
        const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8B0000 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = 7;
        roof.rotation.y = Math.PI / 4;
        houseGroup.add(roof);
        
        // Rooms (represented as smaller cubes)
        this.createRoom(houseGroup, -2, 1, -2, 0x4ecdc4, 'Living Room'); // LR
        this.createRoom(houseGroup, 2, 1, -2, 0xff6b6b, 'Bedroom AC'); // AC_BR
        this.createRoom(houseGroup, -2, 1, 2, 0xfdcb6e, 'DR Room AC'); // AC_DR
        this.createRoom(houseGroup, 2, 1, 2, 0x45b7d1, 'Kitchen'); // Kitchen
        
        // UPS/Electrical Panel
        this.createRoom(houseGroup, 0, 1, 0, 0x95a5a6, 'UPS/Panel', 0.5);
        
        this.scene.add(houseGroup);
        this.house = houseGroup;
    }
    
    createRoom(parent, x, y, z, color, label, size = 1.5) {
        const roomGeometry = new THREE.BoxGeometry(size, size, size);
        const roomMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            transparent: true,
            opacity: 0.7
        });
        const room = new THREE.Mesh(roomGeometry, roomMaterial);
        room.position.set(x, y, z);
        parent.add(room);
        
        // Add label
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 128;
        
        context.fillStyle = 'rgba(255, 255, 255, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = '#000000';
        context.font = 'bold 24px Arial';
        context.textAlign = 'center';
        context.fillText(label, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(labelMaterial);
        sprite.position.set(x, y + size + 0.3, z);
        sprite.scale.set(3, 1.5, 1);
        parent.add(sprite);
        
        return room;
    }
    
    createEnergyFlow() {
        // Create particle systems for energy flow
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = Math.random() * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0x4ecdc4,
            size: 0.1,
            transparent: true,
            opacity: 0.6
        });
        
        this.energyParticles = new THREE.Points(geometry, material);
        this.scene.add(this.energyParticles);
    }
    
    updateEnergyFlow(data) {
        this.currentData = data;
        
        // Update particle colors based on consumption
        if (!this.energyParticles) return;
        
        const colors = [];
        const color = new THREE.Color();
        
        // Calculate intensity based on total usage
        const totalUsage = data.Usage_kW || 1.5;
        const intensity = Math.min(totalUsage / 3, 1); // Normalize to 0-1
        
        // Generate colors based on intensity
        for (let i = 0; i < this.energyParticles.geometry.attributes.position.count; i++) {
            if (intensity > 0.7) {
                color.setHex(0xff6b6b); // Red for high consumption
            } else if (intensity > 0.4) {
                color.setHex(0xfdcb6e); // Yellow for medium
            } else {
                color.setHex(0x4ecdc4); // Green for low
            }
            
            colors.push(color.r, color.g, color.b);
        }
        
        this.energyParticles.geometry.setAttribute(
            'color',
            new THREE.Float32BufferAttribute(colors, 3)
        );
        
        this.energyParticles.material.color.set(
            intensity > 0.7 ? 0xff6b6b :
            intensity > 0.4 ? 0xfdcb6e : 0x4ecdc4
        );
        
        // Animate particles based on consumption
        const positions = this.energyParticles.geometry.attributes.position.array;
        const speed = 0.05 * intensity; // Faster movement for higher consumption
        
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * speed;
            positions[i + 1] += (Math.random() - 0.5) * speed;
            positions[i + 2] += (Math.random() - 0.5) * speed;
            
            // Keep particles within bounds
            if (positions[i] > 5) positions[i] = -5;
            if (positions[i] < -5) positions[i] = 5;
            if (positions[i + 1] > 10) positions[i + 1] = 0;
            if (positions[i + 1] < 0) positions[i + 1] = 10;
            if (positions[i + 2] > 5) positions[i + 2] = -5;
            if (positions[i + 2] < -5) positions[i + 2] = 5;
        }
        
        this.energyParticles.geometry.attributes.position.needsUpdate = true;
        
        // Update room opacities based on component usage
        this.updateRoomIntensities(data);
    }
    
    updateRoomIntensities(data) {
        if (!this.house) return;
        
        const rooms = this.house.children.filter(child => 
            child.type === 'Mesh' && child.geometry.type === 'BoxGeometry'
        );
        
        // Map data to rooms (simplified mapping)
        rooms.forEach((room, index) => {
            let intensity = 0.5; // Default
            
            if (index === 0) intensity = (data.LR_kW || 0.2) / 1; // Living Room
            else if (index === 1) intensity = (data.AC_BR_kW || 1.0) / 2; // Bedroom AC
            else if (index === 2) intensity = (data.AC_DR_kW || 0.1) / 0.5; // DR Room AC
            else if (index === 3) intensity = (data.Kitchen_kW || 0.25) / 1; // Kitchen
            
            room.material.opacity = 0.3 + (intensity * 0.7);
            room.material.color.setHex(
                intensity > 0.7 ? 0xff6b6b :
                intensity > 0.4 ? 0xfdcb6e : 0x4ecdc4
            );
            room.material.needsUpdate = true;
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Rotate house slowly
        if (this.house) {
            this.house.rotation.y += 0.002;
        }
        
        // Animate energy particles
        if (this.energyParticles) {
            this.energyParticles.rotation.y += 0.001;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
    
    onWindowResize() {
        const container = document.getElementById('three-container');
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }
}

// Initialize 3D scene
let energyScene;

function initThreeScene() {
    if (document.getElementById('three-container')) {
        energyScene = new EnergyScene();
    }
}

// Global function to update energy flow from main.js
function updateEnergyFlow(data) {
    if (energyScene) {
        energyScene.updateEnergyFlow(data);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initThreeScene);