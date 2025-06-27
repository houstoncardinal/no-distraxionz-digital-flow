
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const interactiveElementsRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const totalSections = 2;
  
  const threeRefs = useRef({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    stars: [] as THREE.Points[],
    nebula: null as THREE.Mesh | null,
    mountains: [] as THREE.Mesh[],
    animationId: null as number | null,
    targetCameraX: 0,
    targetCameraY: 30,
    targetCameraZ: 100,
    locations: [] as number[]
  });

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      if (canvasRef.current) {
        refs.renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
          alpha: true
        });
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        refs.renderer.toneMappingExposure = 0.5;
        refs.renderer.setClearColor(0x000000, 0);
      }

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation
      animate();
      
      // Mark as ready after Three.js is initialized
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const starCount = 5000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation
          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i },
            mouse: { value: new THREE.Vector2(0, 0) }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            uniform vec2 mouse;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Interactive mouse effect
              float mouseInfluence = 1.0 - depth * 0.3;
              pos.x += mouse.x * mouseInfluence * 20.0 * sin(time + pos.y * 0.01);
              pos.y += mouse.y * mouseInfluence * 20.0 * cos(time + pos.x * 0.01);
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 },
          mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          uniform vec2 mouse;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            elevation += mouse.x * mouse.y * 50.0 * sin(time * 2.0);
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          uniform vec2 mouse;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            mixFactor += mouse.x * mouse.y * 0.5;
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const layers = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer, index) => {
        const points = [];
        const segments = 50;
        
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height + 
                   Math.sin(i * 0.05) * layer.height * 0.5 +
                   Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index, targetZ: layer.distance };
        refs.scene.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mouse: { value: new THREE.Vector2(0, 0) }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform vec2 mouse;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            
            vec3 pos = position;
            pos.x += mouse.x * 50.0;
            pos.y += mouse.y * 50.0;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          uniform vec2 mouse;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            float mouseEffect = length(mouse) * 0.5 + 0.5;
            atmosphere *= pulse * mouseEffect;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;

      // Update stars with mouse interaction
      refs.stars.forEach((starField) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time;
          material.uniforms.mouse.value.set(mousePosition.x * 0.1, mousePosition.y * 0.1);
        }
      });

      // Update nebula with mouse interaction
      if (refs.nebula) {
        const material = refs.nebula.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time * 0.5;
          material.uniforms.mouse.value.set(mousePosition.x * 0.2, mousePosition.y * 0.2);
        }
      }

      // Smooth camera movement with easing and mouse influence
      if (refs.camera) {
        const smoothingFactor = 0.05;
        
        // Add mouse influence to camera movement
        const mouseInfluenceX = mousePosition.x * 5;
        const mouseInfluenceY = mousePosition.y * 3;
        
        // Calculate smooth position with easing
        smoothCameraPos.current.x += (refs.targetCameraX + mouseInfluenceX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY + mouseInfluenceY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
        
        // Add subtle floating motion
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        // Apply final position
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(mousePosition.x * 10, 10 + mousePosition.y * 5, -600);
      }

      // Parallax mountains with subtle animation and mouse interaction
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        const mouseEffect = (mousePosition.x + mousePosition.y) * 0.1;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor + mouseEffect;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.renderer) {
        refs.renderer.render(refs.scene, refs.camera);
      }
    };

    const getLocation = () => {
      const { current: refs } = threeRefs;
      const locations: number[] = [];
      refs.mountains.forEach((mountain, i) => {
        locations[i] = mountain.position.z;
      });
      refs.locations = locations;
    };

    initThree();

    // Handle resize
    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Dispose Three.js resources
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        if (starField.material instanceof THREE.Material) {
          starField.material.dispose();
        }
      });

      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        if (mountain.material instanceof THREE.Material) {
          mountain.material.dispose();
        }
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        if (refs.nebula.material instanceof THREE.Material) {
          refs.nebula.material.dispose();
        }
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, [mousePosition]);

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;
    
    // Set initial states to prevent flash
    gsap.set([menuRef.current, logoRef.current, subtitleRef.current, interactiveElementsRef.current], {
      visibility: 'visible'
    });

    const tl = gsap.timeline();

    // Animate menu
    if (menuRef.current) {
      tl.from(menuRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    // Animate logo with more dramatic entrance
    if (logoRef.current) {
      tl.from(logoRef.current, {
        y: 150,
        opacity: 0,
        scale: 0.6,
        rotation: -5,
        duration: 2,
        ease: "power4.out"
      }, "-=0.5");
    }

    // Animate subtitle lines
    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      if (subtitleLines.length > 0) {
        tl.from(subtitleLines, {
          y: 80,
          opacity: 0,
          rotationX: 45,
          duration: 1.2,
          stagger: 0.3,
          ease: "power3.out"
        }, "-=1.2");
      }
    }

    // Animate interactive elements
    if (interactiveElementsRef.current) {
      tl.from(interactiveElementsRef.current.children, {
        scale: 0,
        opacity: 0,
        rotation: 180,
        duration: 1,
        stagger: 0.1,
        ease: "back.out(1.7)"
      }, "-=0.8");
    }

    return () => {
      tl.kill();
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      const newSection = Math.floor(progress * totalSections);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      
      // Calculate smooth progress through all sections
      const totalProgress = progress * totalSections;
      const sectionProgress = totalProgress % 1;
      
      // Define camera positions for each section
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },    // Section 0 - HORIZON
        { x: 0, y: 40, z: -50 },     // Section 1 - COSMOS
        { x: 0, y: 50, z: -700 }       // Section 2 - INFINITY
      ];
      
      // Get current and next positions
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      
      // Set target positions (actual smoothing happens in animate loop)
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;
      
      // Smooth parallax for mountains
      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        
        if (refs.nebula) {
          refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
        }
        
        // Use the same smoothing approach
        mountain.userData.targetZ = targetZ;
        if (progress > 0.7) {
          mountain.position.z = 600000;
        }
        if (progress < 0.7) {
          mountain.position.z = refs.locations[i];
        }
      });
      
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const styles = {
    heroContainer: {
      position: 'relative' as const,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      background: 'transparent'
    },
    heroCanvas: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 1
    },
    sideMenu: {
      position: 'fixed' as const,
      top: '50%',
      left: '30px',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '30px',
      visibility: 'hidden' as const
    },
    menuIcon: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '4px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    menuIconSpan: {
      width: '20px',
      height: '2px',
      background: 'white',
      transition: 'all 0.3s ease',
      borderRadius: '1px'
    },
    verticalText: {
      writingMode: 'vertical-rl' as const,
      color: 'white',
      fontSize: '12px',
      letterSpacing: '3px',
      fontWeight: 300,
      transition: 'all 0.3s ease'
    },
    heroContent: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center' as const,
      zIndex: 10,
      color: 'white'
    },
    heroLogo: {
      maxWidth: '80vw',
      maxHeight: '40vh',
      width: 'auto',
      height: 'auto',
      marginBottom: '2rem',
      filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))',
      visibility: 'hidden' as const,
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
      fontWeight: 300,
      lineHeight: 1.6,
      opacity: 0.9,
      maxWidth: '600px',
      margin: '0 auto'
    },
    subtitleLine: {
      margin: '0.5rem 0',
      transition: 'all 0.3s ease'
    },
    scrollSections: {
      position: 'relative' as const,
      zIndex: 5,
      marginTop: '100vh'
    },
    contentSection: {
      height: '100vh',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center' as const,
      color: 'white',
      padding: '0 2rem'
    },
    interactiveElements: {
      position: 'fixed' as const,
      bottom: '40px',
      right: '40px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '15px',
      visibility: 'hidden' as const
    },
    interactiveButton: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      color: 'white'
    }
  };

  return (
    <div ref={containerRef} style={styles.heroContainer}>
      <canvas ref={canvasRef} style={styles.heroCanvas} />
      
      {/* Enhanced side menu with hover effects */}
      <div ref={menuRef} style={styles.sideMenu}>
        <div 
          style={styles.menuIcon}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget.children, {
              width: '25px',
              background: '#00ff88',
              duration: 0.3
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget.children, {
              width: '20px',
              background: 'white',
              duration: 0.3
            });
          }}
        >
          <span style={styles.menuIconSpan}></span>
          <span style={styles.menuIconSpan}></span>
          <span style={styles.menuIconSpan}></span>
        </div>
        <div 
          style={styles.verticalText}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              color: '#00ff88',
              letterSpacing: '5px',
              duration: 0.3
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              color: 'white',
              letterSpacing: '3px',
              duration: 0.3
            });
          }}
        >
          STYLE
        </div>
      </div>

      {/* Interactive floating elements */}
      <div ref={interactiveElementsRef} style={styles.interactiveElements}>
        <div 
          style={styles.interactiveButton}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.2,
              background: 'rgba(0, 255, 136, 0.2)',
              borderColor: 'rgba(0, 255, 136, 0.5)',
              duration: 0.3
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              duration: 0.3
            });
          }}
        >
          ⚡
        </div>
        <div 
          style={styles.interactiveButton}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.2,
              background: 'rgba(255, 0, 136, 0.2)',
              borderColor: 'rgba(255, 0, 136, 0.5)',
              duration: 0.3
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              duration: 0.3
            });
          }}
        >
          ✨
        </div>
        <div 
          style={styles.interactiveButton}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.2,
              background: 'rgba(0, 136, 255, 0.2)',
              borderColor: 'rgba(0, 136, 255, 0.5)',
              duration: 0.3
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              duration: 0.3
            });
          }}
        >
          🚀
        </div>
      </div>

      {/* Main content with enhanced interactivity */}
      <div style={styles.heroContent}>
        <img 
          ref={logoRef}
          src="/lovable-uploads/809945ef-fe18-461e-963e-17ee3add2941.png" 
          alt="NO DISTRAXIONZ Logo" 
          style={styles.heroLogo}
          onMouseEnter={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1.05,
              filter: 'drop-shadow(0 30px 60px rgba(0, 255, 136, 0.3))',
              duration: 0.5,
              ease: "power2.out"
            });
          }}
          onMouseLeave={(e) => {
            gsap.to(e.currentTarget, {
              scale: 1,
              filter: 'drop-shadow(0 20px 40px rgba(0, 0, 0, 0.6))',
              duration: 0.5,
              ease: "power2.out"
            });
          }}
        />
        
        <div ref={subtitleRef} style={styles.heroSubtitle}>
          <p 
            className="subtitle-line" 
            style={styles.subtitleLine}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                color: '#00ff88',
                y: -5,
                duration: 0.3
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                color: 'white',
                y: 0,
                duration: 0.3
              });
            }}
          >
            Premium streetwear that commands attention,
          </p>
          <p 
            className="subtitle-line" 
            style={styles.subtitleLine}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                color: '#ff0088',
                y: -5,
                duration: 0.3
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                color: 'white',
                y: 0,
                duration: 0.3
              });
            }}
          >
            crafted for those who refuse to blend in
          </p>
        </div>
      </div>

      {/* Additional sections for scrolling */}
      <div style={styles.scrollSections}>
       {[...Array(2)].map((_, i) => {
          const titles: Record<number, string> = {
            0: 'NO DISTRAXIONZ',
            1: 'STREET CULTURE',
            2: 'PURE FOCUS'
          };
          
          const subtitles: Record<number, { line1: string; line2: string }> = {
            0: {
              line1: 'Premium streetwear that commands attention,',
              line2: 'crafted for those who refuse to blend in'
            },
            1: {
              line1: 'Born from the streets, elevated by design,',
              line2: 'every piece tells a story of rebellion'
            },
            2: {
              line1: 'Cut through the noise with clarity of purpose,',
              line2: 'where style becomes your strongest statement'
            }
          };
          
          return (
            <section key={i} style={styles.contentSection}>
              <h1 style={{
                fontSize: 'clamp(3rem, 8vw, 8rem)',
                fontWeight: 100,
                letterSpacing: '0.2em',
                marginBottom: '2rem',
                fontFamily: "'Playfair Display', serif"
              }}>
                {titles[i+1] || 'DEFAULT'}
              </h1>
          
              <div style={styles.heroSubtitle}>
                <p style={styles.subtitleLine}>
                  {subtitles[i+1]?.line1}
                </p>
                <p style={styles.subtitleLine}>
                  {subtitles[i+1]?.line2}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HorizonHeroSection;
