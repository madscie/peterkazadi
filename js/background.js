import * as THREE from 'https://unpkg.com/three@0.150.1/build/three.module.js';

const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create 3D Particles
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.PointsMaterial({ size: 0.05, color: 0x2563eb });
const particles = new THREE.Points(geometry, material);
scene.add(particles);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotation logic
    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;

    renderer.render(scene, camera);
}

// React to Scroll
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    camera.position.z = t * -0.01 + 30;
    camera.position.y = t * -0.002;
    particles.rotation.y += 0.01;
}

document.body.onscroll = moveCamera;
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();