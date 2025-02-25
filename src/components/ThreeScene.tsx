import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AnimationConfig, defaultConfig } from '../config/animationConfig';

// Simplex noise implementation
const simplex = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
                 i.z + vec4(0.0, i1.z, i2.z, 1.0))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0))
               + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

interface ThreeSceneProps {
  config?: Partial<AnimationConfig>;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ config = {} }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    material: THREE.ShaderMaterial;
    frameId: number;
    audioContext?: AudioContext;
    analyser?: AnalyserNode;
  } | null>(null);

  // Merge provided config with defaults
  const finalConfig = { ...defaultConfig, ...config };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      finalConfig.camera.fov,
      window.innerWidth / window.innerHeight,
      finalConfig.camera.near,
      finalConfig.camera.far
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.enablePan = true;
    controls.panSpeed = 0.5;
    controls.enableZoom = true;
    controls.zoomSpeed = 0.5;
    controls.rotateSpeed = 0.5;

    // Create starry background
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0xffffff, 
      size: finalConfig.stars.size 
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    const starPositions = [];
    for (let i = 0; i < finalConfig.stars.count; i++) {
      starPositions.push((Math.random() - 0.5) * 2000);
      starPositions.push((Math.random() - 0.5) * 2000);
      starPositions.push((Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    scene.add(stars);

    // Sphere setup
    const geometry = new THREE.SphereGeometry(
      finalConfig.sphere.size,
      finalConfig.sphere.segments,
      finalConfig.sphere.segments
    );

    // Create shader material with corrected uniforms and types
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        audioLevel: { value: 0.0 },
        textInput: { value: 0.0 },
        gyroX: { value: 0.0 },
        gyroY: { value: 0.0 },
        swirlingSpeed: { value: finalConfig.timing.swirlingSpeed },
        energySpeed: { value: finalConfig.timing.energySpeed },
        tendrilsSpeed: { value: finalConfig.timing.tendrilsSpeed },
        primaryColor: { value: new THREE.Vector3().copy(finalConfig.colors.primary) },
        secondaryColor: { value: new THREE.Vector3().copy(finalConfig.colors.secondary) },
        noiseScale: { value: new THREE.Vector3(
          finalConfig.noise.swirling,
          finalConfig.noise.energy,
          finalConfig.noise.tendrils
        )},
        effectStrength: { value: new THREE.Vector3(
          finalConfig.effects.swirlingStrength,
          finalConfig.effects.energyThreshold,
          finalConfig.effects.tendrilsThreshold
        )},
        alpha: { value: finalConfig.effects.transparency },
        audioSensitivity: { value: finalConfig.input.audioSensitivity },
        textStrength: { value: finalConfig.input.textStrength },
        gyroStrength: { value: finalConfig.input.gyroStrength }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform float audioLevel;
        uniform float textInput;
        uniform float gyroX;
        uniform float gyroY;
        uniform float swirlingSpeed;
        uniform float energySpeed;
        uniform float tendrilsSpeed;
        uniform vec3 primaryColor;
        uniform vec3 secondaryColor;
        uniform vec3 noiseScale;
        uniform vec3 effectStrength;
        uniform float alpha;
        uniform float audioSensitivity;
        uniform float textStrength;
        uniform float gyroStrength;
        varying vec2 vUv;
        varying vec3 vPosition;

        ${simplex}

        void main() {
          vec2 p = vUv * 2.0 - 1.0;
          float r = length(p);
          float a = atan(p.y, p.x);

          // Base Gradient
          vec3 color = mix(primaryColor, secondaryColor, r);

          // Swirling Patterns with Noise
          float noise = snoise(vec3(p * noiseScale.x, time * swirlingSpeed));
          color += vec3(noise) * effectStrength.x;

          // Energy Bursts
          float energy = snoise(vec3(p * noiseScale.y, time * energySpeed));
          color += smoothstep(effectStrength.y, 1.0, energy) * secondaryColor;

          // Glowing Tendrils
          float tendrils = snoise(vec3(p * noiseScale.z, time * tendrilsSpeed));
          color += smoothstep(effectStrength.z, 0.7, tendrils) * primaryColor;

          // Real-Time Interactions
          color *= 1.0 + audioLevel * audioSensitivity;
          color += vec3(textInput * textStrength);
          float gyroEffect = sin(gyroX + gyroY + time);
          color += vec3(gyroEffect * gyroStrength);

          // Semi-Transparency
          float finalAlpha = smoothstep(0.0, 0.5, r) * alpha;

          gl_FragColor = vec4(color, finalAlpha);
        }
      `,
      transparent: true
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    camera.position.z = finalConfig.camera.distance;

    // Audio setup
    const setupAudio = async () => {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        sceneRef.current = {
          ...sceneRef.current!,
          audioContext,
          analyser
        };
      } catch (error) {
        console.error('Audio setup failed:', error);
      }
    };

    // Text input handler
    const handleKeyPress = () => {
      material.uniforms.textInput.value += 0.01;
    };

    // Gyroscope handler
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta && event.gamma) {
        material.uniforms.gyroX.value = event.beta / 180 * Math.PI;
        material.uniforms.gyroY.value = event.gamma / 180 * Math.PI;
      }
    };

    // Animation
    let time = 0;
    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      time += finalConfig.timing.baseSpeed;
      material.uniforms.time.value = time;

      // Update controls in animation loop
      controls.update();

      // Update audio level if analyzer is available
      if (sceneRef.current?.analyser) {
        const dataArray = new Uint8Array(sceneRef.current.analyser.frequencyBinCount);
        sceneRef.current.analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        material.uniforms.audioLevel.value = average / 255;
      }

      renderer.render(scene, camera);
      sceneRef.current = { 
        ...sceneRef.current!, 
        scene, 
        camera, 
        renderer, 
        controls, 
        material, 
        frameId 
      };
    };

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      material.uniforms.resolution.value.set(width, height);
    };

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('keypress', handleKeyPress);
    window.addEventListener('deviceorientation', handleOrientation);

    // Start everything
    setupAudio();
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keypress', handleKeyPress);
      window.removeEventListener('deviceorientation', handleOrientation);

      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.frameId);
        sceneRef.current.audioContext?.close();
        sceneRef.current.controls.dispose();
      }
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }

      geometry.dispose();
      material.dispose();
      renderer.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
    };
  }, [config]);

  return <div ref={mountRef} className="w-full h-screen" />;
};

export default ThreeScene;