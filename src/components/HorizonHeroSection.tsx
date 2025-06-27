
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(1);
  const [isReady, setIsReady] = useState(false);
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
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
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
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
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
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
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
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
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

      // Update stars
      refs.stars.forEach((starField) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula) {
        const material = refs.nebula.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time * 0.5;
        }
      }

      // Smooth camera movement with easing
      if (refs.camera) {
        const smoothingFactor = 0.05;
        
        // Calculate smooth position with easing
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
        
        // Add subtle floating motion
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        // Apply final position
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains with subtle animation
      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
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
  }, []);

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;
    
    // Set initial states to prevent flash
    gsap.set([menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current], {
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

    // Animate title with split text
    if (titleRef.current) {
      const titleChars = titleRef.current.querySelectorAll('.title-char');
      tl.from(titleChars, {
        y: 200,
        opacity: 0,
        duration: 1.5,
        stagger: 0.05,
        ease: "power4.out"
      }, "-=0.5");
    }

    // Animate subtitle lines
    if (subtitleRef.current) {
      const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
      tl.from(subtitleLines, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }, "-=0.8");
    }

    // Animate scroll indicator
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");
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

  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));
  };

  const styles = {
    heroContainer: {
      position: 'relative' as const,
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', sans-serif",
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #000000 100%)'
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
      cursor: 'pointer'
    },
    menuIconSpan: {
      width: '20px',
      height: '2px',
      background: 'white',
      transition: 'all 0.3s ease'
    },
    verticalText: {
      writingMode: 'vertical-rl' as const,
      color: 'white',
      fontSize: '12px',
      letterSpacing: '3px',
      fontWeight: 300
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
    heroTitle: {
      fontSize: 'clamp(3rem, 8vw, 8rem)',
      fontWeight: 100,
      letterSpacing: '0.2em',
      marginBottom: '2rem',
      fontFamily: "'Playfair Display', serif"
    },
    titleChar: {
      display: 'inline-block',
      transition: 'all 0.3s ease'
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.5rem)',
      fontWeight: 300,
      lineHeight: 1.6,
      opacity: 0.8,
      maxWidth: '600px',
      margin: '0 auto'
    },
    subtitleLine: {
      margin: '0.5rem 0'
    },
    scrollProgress: {
      position: 'fixed' as const,
      bottom: '50px',
      right: '30px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '15px',
      color: 'white',
      visibility: 'hidden' as const
    },
    scrollText: {
      fontSize: '10px',
      letterSpacing: '2px',
      writingMode: 'vertical-rl' as const,
      opacity: 0.7
    },
    progressTrack: {
      width: '2px',
      height: '80px',
      background: 'rgba(255, 255, 255, 0.2)',
      position: 'relative' as const
    },
    progressFill: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      width: '100%',
      background: 'white',
      transition: 'height 0.3s ease'
    },
    sectionCounter: {
      fontSize: '12px',
      fontWeight: 300,
      opacity: 0.7
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
    }
  };

  return (
    <div ref={containerRef} style={styles.heroContainer}>
      <canvas ref={canvasRef} style={styles.heroCanvas} />
      
      {/* Side menu */}
      <div ref={menuRef} style={styles.sideMenu}>
        <div style={styles.menuIcon}>
          <span style={styles.menuIconSpan}></span>
          <span style={styles.menuIconSpan}></span>
          <span style={styles.menuIconSpan}></span>
        </div>
        <div style={styles.verticalText}>SPACE</div>
      </div>

      {/* Main content */}
      <div style={styles.heroContent}>
        <h1 ref={titleRef} style={styles.heroTitle}>
          {splitTitle("HORIZON")}
        </h1>
        
        <div ref={subtitleRef} style={styles.heroSubtitle}>
          <p style={styles.subtitleLine}>
            Where vision meets reality, 
          </p>
          <p style={styles.subtitleLine}>
            we shape the future of tomorrow
          </p>
        </div>
      </div>

      {/* Scroll progress indicator */}
      <div ref={scrollProgressRef} style={styles.scrollProgress}>
        <div style={styles.scrollText}>SCROLL</div>
        <div style={styles.progressTrack}>
          <div 
            style={{
              ...styles.progressFill,
              width: `${scrollProgress * 100}%`
            }}
          />
        </div>
        <div style={styles.sectionCounter}>
          {String(currentSection).padStart(2, '0')} / {String(totalSections).padStart(2, '0')}
        </div>
      </div>

      {/* Additional sections for scrolling */}
      <div style={styles.scrollSections}>
       {[...Array(2)].map((_, i) => {
          const titles: Record<number, string> = {
            0: 'HORIZON',
            1: 'COSMOS',
            2: 'INFINITY'
          };
          
          const subtitles: Record<number, { line1: string; line2: string }> = {
            0: {
              line1: 'Where vision meets reality,',
              line2: 'we shape the future of tomorrow'
            },
            1: {
              line1: 'Beyond the boundaries of imagination,',
              line2: 'lies the universe of possibilities'
            },
            2: {
              line1: 'In the space between thought and creation,',
              line2: 'we find the essence of true innovation'
            }
          };
          
          return (
            <section key={i} style={styles.contentSection}>
              <h1 style={styles.heroTitle}>
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
