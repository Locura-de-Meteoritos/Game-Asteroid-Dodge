import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './AsteroidDodger.css';

const AsteroidDodger = () => {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING, PAUSED, GAMEOVER
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [speed, setSpeed] = useState(1);
  const [asteroidsDodged, setAsteroidsDodged] = useState(0);
  const [asteroidInfo, setAsteroidInfo] = useState(null);
  const [dangerWarning, setDangerWarning] = useState(false);
  
  // Referencias del juego
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const asteroidsRef = useRef([]);
  const starsRef = useRef([]);
  const keysRef = useRef({});
  const playerVelocityRef = useRef({ x: 0, y: 0 });
  const gameActiveRef = useRef(false);
  const animationIdRef = useRef(null);
  
  // Configuración del juego
  const gameConfig = {
    acceleration: 0.5,
    friction: 0.92,
    maxVelocity: 2,
    cameraLimits: { x: 50, y: 30 },
    spawnRate: 1000,
    maxAsteroids: 20,
    asteroidSpeed: { min: 2, max: 5 },
    collisionRadius: 8
  };

  useEffect(() => {
    if (gameState === 'PLAYING') {
      try {
        initGame();
      } catch (error) {
        console.error('Error al inicializar el juego:', error);
        setGameState('MENU');
      }
    }
    
    // Manejar redimensionamiento de ventana
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cleanup();
    };
  }, [gameState]);

  const initGame = () => {
    if (!mountRef.current) {
      console.error('mountRef no está disponible');
      return;
    }

    try {
      // Crear escena
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Crear cámara
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      camera.position.set(0, 0, 0);
      cameraRef.current = camera;

      // Crear renderizador
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1);
      rendererRef.current = renderer;

      // Limpiar el contenedor y agregar el canvas
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Configurar iluminación
      setupLighting(scene);
      
      // Crear campo de estrellas
      createStarField(scene);
      
      // Configurar controles
      setupControls();
      
      // Inicializar estado del juego
      gameActiveRef.current = true;
      asteroidsRef.current = [];
      
      // Establecer tiempo de inicio
      if (!gameRef.current) gameRef.current = {};
      gameRef.current.startTime = Date.now();
      
      // Iniciar loop de animación
      animate();
      
      // Iniciar spawn de asteroides
      startAsteroidSpawning();
      
      console.log('Juego inicializado correctamente');
    } catch (error) {
      console.error('Error en initGame:', error);
      setGameState('MENU');
    }
  };

  const setupLighting = (scene) => {
    // Luz ambiente
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Luz direccional
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 100, 100);
    scene.add(directionalLight);

    // Niebla espacial
    scene.fog = new THREE.Fog(0x000011, 1, 1500);
  };

  const createStarField = (scene) => {
    const starLayers = [];
    
    // Crear 3 capas de estrellas para efecto parallax
    for (let layer = 0; layer < 3; layer++) {
      const starCount = 1500;
      const positions = new Float32Array(starCount * 3);
      
      for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1000; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000; // y
        positions[i * 3 + 2] = -2000 + layer * 600 + Math.random() * 600; // z
      }
      
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      
      const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 2 + layer,
        transparent: true,
        opacity: 0.8 - layer * 0.2
      });
      
      const stars = new THREE.Points(geometry, material);
      scene.add(stars);
      
      starLayers.push({
        stars,
        speed: 0.5 + layer * 0.5,
        positions
      });
    }
    
    starsRef.current = starLayers;
  };

  const setupControls = () => {
    const handleKeyDown = (event) => {
      keysRef.current[event.key] = true;
      if (event.key === 'Escape') {
        togglePause();
      }
    };

    const handleKeyUp = (event) => {
      keysRef.current[event.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    gameRef.current = { handleKeyDown, handleKeyUp };
  };

  const createAsteroid = () => {
    if (asteroidsRef.current.length >= gameConfig.maxAsteroids) return;

    // Tipos de asteroides basados en datos reales de NASA
    const asteroidTypes = [
      { 
        color: 0x666666, 
        size: [5, 15], 
        name: 'C-type', 
        dangerous: false,
        composition: 'Carbonáceo',
        density: 1.38
      },
      { 
        color: 0x8B7355, 
        size: [10, 20], 
        name: 'S-type', 
        dangerous: false,
        composition: 'Silicato',
        density: 2.71
      },
      { 
        color: 0x999999, 
        size: [8, 18], 
        name: 'M-type', 
        dangerous: false,
        composition: 'Metálico',
        density: 5.32
      },
      { 
        color: 0xFF4444, 
        size: [12, 25], 
        name: 'X-type', 
        dangerous: true,
        composition: 'Híbrido',
        density: 3.14
      }
    ];

    const type = asteroidTypes[Math.floor(Math.random() * asteroidTypes.length)];
    const size = type.size[0] + Math.random() * (type.size[1] - type.size[0]);

    // Geometría irregular para realismo
    const geometry = new THREE.DodecahedronGeometry(size, Math.random() > 0.5 ? 0 : 1);
    
    // Deformar vértices para irregularidad
    const vertices = geometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const z = vertices.getZ(i);
      
      const noise = 0.3;
      vertices.setXYZ(
        i,
        x + (Math.random() - 0.5) * noise * size,
        y + (Math.random() - 0.5) * noise * size,
        z + (Math.random() - 0.5) * noise * size
      );
    }

    const material = new THREE.MeshStandardMaterial({
      color: type.color,
      roughness: type.name === 'M-type' ? 0.3 : 0.9,
      metalness: type.name === 'M-type' ? 0.8 : 0.1,
      flatShading: true
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Posición y velocidad inicial con más variación
    mesh.position.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 80,
      -500 - Math.random() * 200
    );

    const baseSpeed = gameConfig.asteroidSpeed.min + Math.random() * (gameConfig.asteroidSpeed.max - gameConfig.asteroidSpeed.min);
    
    const asteroid = {
      mesh,
      size,
      type: type.name,
      dangerous: type.dangerous,
      composition: type.composition,
      density: type.density,
      velocity: {
        x: (Math.random() - 0.5) * 1.5,
        y: (Math.random() - 0.5) * 1.5,
        z: baseSpeed + (speed - 1) * 0.5
      },
      rotation: {
        x: (Math.random() - 0.5) * 0.08,
        y: (Math.random() - 0.5) * 0.08,
        z: (Math.random() - 0.5) * 0.08
      },
      name: `NEO-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
      discoveryYear: 1995 + Math.floor(Math.random() * 30),
      relativeVelocity: (baseSpeed * 10 + Math.random() * 15).toFixed(1)
    };

    // Glow para asteroides peligrosos con animación
    if (type.dangerous) {
      const glowGeometry = new THREE.DodecahedronGeometry(size * 1.3, 0);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0xFF0000,
        transparent: true,
        opacity: 0.4
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      
      // Animación del glow
      glowMesh.userData.glowPhase = Math.random() * Math.PI * 2;
      
      mesh.add(glowMesh);
      asteroid.glowMesh = glowMesh;
    }

    sceneRef.current.add(mesh);
    asteroidsRef.current.push(asteroid);
  };

  const startAsteroidSpawning = () => {
    const spawnAsteroid = () => {
      if (gameActiveRef.current) {
        createAsteroid();
        setTimeout(spawnAsteroid, Math.max(500, gameConfig.spawnRate - score * 2));
      }
    };
    setTimeout(spawnAsteroid, 1000);
  };

  const updatePlayerMovement = () => {
    const keys = keysRef.current;
    const velocity = playerVelocityRef.current;
    const camera = cameraRef.current;

    // Aplicar aceleración basada en input
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      velocity.x -= gameConfig.acceleration;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      velocity.x += gameConfig.acceleration;
    }
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
      velocity.y += gameConfig.acceleration;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
      velocity.y -= gameConfig.acceleration;
    }

    // Aplicar fricción
    velocity.x *= gameConfig.friction;
    velocity.y *= gameConfig.friction;

    // Limitar velocidad máxima
    velocity.x = Math.max(-gameConfig.maxVelocity, Math.min(gameConfig.maxVelocity, velocity.x));
    velocity.y = Math.max(-gameConfig.maxVelocity, Math.min(gameConfig.maxVelocity, velocity.y));

    // Mover cámara
    camera.position.x += velocity.x;
    camera.position.y += velocity.y;

    // Limitar posición de cámara
    camera.position.x = Math.max(-gameConfig.cameraLimits.x, Math.min(gameConfig.cameraLimits.x, camera.position.x));
    camera.position.y = Math.max(-gameConfig.cameraLimits.y, Math.min(gameConfig.cameraLimits.y, camera.position.y));

    // Efecto de inclinación al moverse
    camera.rotation.z = velocity.x * 0.05;
  };

  const updateAsteroids = () => {
    const camera = cameraRef.current;
    let nearestAsteroid = null;
    let minDistance = Infinity;
    let hasDanger = false;

    for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
      const asteroid = asteroidsRef.current[i];
      
      // Mover asteroide
      asteroid.mesh.position.x += asteroid.velocity.x;
      asteroid.mesh.position.y += asteroid.velocity.y;
      asteroid.mesh.position.z += asteroid.velocity.z * speed;

      // Rotar asteroide
      asteroid.mesh.rotation.x += asteroid.rotation.x;
      asteroid.mesh.rotation.y += asteroid.rotation.y;
      asteroid.mesh.rotation.z += asteroid.rotation.z;

      // Animar glow para asteroides peligrosos
      if (asteroid.glowMesh) {
        asteroid.glowMesh.userData.glowPhase += 0.1;
        const glowIntensity = 0.3 + Math.sin(asteroid.glowMesh.userData.glowPhase) * 0.2;
        asteroid.glowMesh.material.opacity = glowIntensity;
      }

      // Calcular distancia para información y advertencias
      const dx = asteroid.mesh.position.x - camera.position.x;
      const dy = asteroid.mesh.position.y - camera.position.y;
      const dz = asteroid.mesh.position.z - camera.position.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      // Encontrar asteroide más cercano para mostrar información
      if (distance < 100 && distance < minDistance) {
        minDistance = distance;
        nearestAsteroid = {
          ...asteroid,
          distance: distance.toFixed(1)
        };
      }

      // Verificar si hay peligro cercano
      if (asteroid.dangerous && distance < 80 && asteroid.mesh.position.z > -100) {
        hasDanger = true;
      }

      // Verificar si pasó de largo
      if (asteroid.mesh.position.z > 10) {
        sceneRef.current.remove(asteroid.mesh);
        asteroidsRef.current.splice(i, 1);
        
        // Bonificación por esquivar asteroides peligrosos
        const points = asteroid.dangerous ? 250 : 100;
        setScore(prev => prev + points);
        setAsteroidsDodged(prev => prev + 1);
      }
    }

    // Actualizar información del asteroide cercano
    setAsteroidInfo(nearestAsteroid);
    setDangerWarning(hasDanger);
  };

  const updateStars = () => {
    starsRef.current.forEach(layer => {
      const positions = layer.positions;
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] += layer.speed * speed;
        
        if (positions[i + 2] > 10) {
          positions[i + 2] = -2000;
        }
      }
      
      layer.stars.geometry.attributes.position.needsUpdate = true;
    });
  };

  const checkCollisions = () => {
    const camera = cameraRef.current;
    
    for (let i = asteroidsRef.current.length - 1; i >= 0; i--) {
      const asteroid = asteroidsRef.current[i];
      
      const dx = asteroid.mesh.position.x - camera.position.x;
      const dy = asteroid.mesh.position.y - camera.position.y;
      const dz = asteroid.mesh.position.z - camera.position.z;
      
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      
      if (distance < (asteroid.size + gameConfig.collisionRadius)) {
        // Colisión detectada
        sceneRef.current.remove(asteroid.mesh);
        asteroidsRef.current.splice(i, 1);
        
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            gameOver();
          }
          return newLives;
        });
        
        // Efecto visual de impacto
        createCollisionEffect(asteroid.mesh.position);
      }
    }
  };

  const createCollisionEffect = (position) => {
    const particleCount = 50;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;
      
      velocities.push({
        x: (Math.random() - 0.5) * 20,
        y: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20
      });
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0xFF4400,
      size: 3,
      transparent: true,
      opacity: 1
    });
    
    const particles = new THREE.Points(geometry, material);
    sceneRef.current.add(particles);
    
    // Animar partículas
    let opacity = 1;
    const animateParticles = () => {
      opacity -= 0.02;
      material.opacity = opacity;
      
      const pos = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pos.setX(i, pos.getX(i) + velocities[i].x * 0.1);
        pos.setY(i, pos.getY(i) + velocities[i].y * 0.1);
        pos.setZ(i, pos.getZ(i) + velocities[i].z * 0.1);
      }
      pos.needsUpdate = true;
      
      if (opacity > 0) {
        requestAnimationFrame(animateParticles);
      } else {
        sceneRef.current.remove(particles);
      }
    };
    
    animateParticles();
  };

  const animate = () => {
    if (!gameActiveRef.current) return;

    // Actualizar componentes del juego
    updatePlayerMovement();
    updateAsteroids();
    updateStars();
    checkCollisions();

    // Sistema de dificultad progresiva más sofisticado
    const currentTime = Date.now();
    const gameTime = (currentTime - (gameRef.current?.startTime || currentTime)) / 1000;
    
    // Aumentar velocidad gradualmente
    const newSpeed = 1 + (gameTime / 30) + (asteroidsDodged * 0.02);
    setSpeed(newSpeed);

    // Actualizar configuración de spawn basada en tiempo y puntuación
    if (gameTime > 30) {
      gameConfig.maxAsteroids = Math.min(30, 20 + Math.floor(gameTime / 20));
      gameConfig.spawnRate = Math.max(300, 1000 - (gameTime * 10) - (score / 100));
    }

    // Renderizar
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    animationIdRef.current = requestAnimationFrame(animate);
  };

  const gameOver = () => {
    gameActiveRef.current = false;
    setGameState('GAMEOVER');
  };

  const startGame = () => {
    console.log('startGame llamado');
    setScore(0);
    setLives(3);
    setSpeed(1);
    setAsteroidsDodged(0);
    setAsteroidInfo(null);
    setDangerWarning(false);
    
    // Reiniciar configuración del juego
    gameConfig.maxAsteroids = 20;
    gameConfig.spawnRate = 1000;
    
    console.log('Cambiando estado a PLAYING');
    setGameState('PLAYING');
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') {
      gameActiveRef.current = false;
      setGameState('PAUSED');
    } else if (gameState === 'PAUSED') {
      gameActiveRef.current = true;
      setGameState('PLAYING');
      animate();
    }
  };

  const cleanup = () => {
    gameActiveRef.current = false;
    
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    if (gameRef.current) {
      window.removeEventListener('keydown', gameRef.current.handleKeyDown);
      window.removeEventListener('keyup', gameRef.current.handleKeyUp);
    }
    
    if (rendererRef.current && mountRef.current) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  const backToMenu = () => {
    cleanup();
    setGameState('MENU');
  };

  return (
    <div className="asteroid-dodger">
      <div ref={mountRef} className="game-container" />
      
      {/* HUD */}
      {gameState === 'PLAYING' && (
        <>
          {/* Frame de la nave */}
          <div className="ship-frame">
            <div className="frame-left"></div>
            <div className="frame-right"></div>
          </div>
          
          <div className="hud">
            <div className="hud-top-left">
              <div className="score">SCORE: {score.toLocaleString()}</div>
              <div className="dodged">ESQUIVADOS: {asteroidsDodged}</div>
            </div>
            
            <div className="hud-top-right">
              <div className="lives">
                VIDAS: {Array.from({ length: lives }, (_, i) => (
                  <span key={i} className="life">❤️</span>
                ))}
              </div>
            </div>
            
            <div className="hud-center">
              <div className="crosshair">
                <div className="crosshair-h"></div>
                <div className="crosshair-v"></div>
              </div>
            </div>
            
            <div className="hud-bottom">
              <div className="speed">VELOCIDAD: {speed.toFixed(1)}x</div>
              
              {/* Radar de proximidad */}
              <div className="proximity-radar">
                <div className="radar-circle">
                  <div className="radar-center"></div>
                  {asteroidsRef.current.map((asteroid, index) => {
                    const distance = Math.sqrt(
                      Math.pow(asteroid.mesh.position.x - cameraRef.current?.position.x || 0, 2) +
                      Math.pow(asteroid.mesh.position.y - cameraRef.current?.position.y || 0, 2)
                    );
                    
                    if (distance > 150) return null;
                    
                    const radarX = (asteroid.mesh.position.x - (cameraRef.current?.position.x || 0)) / 150 * 40;
                    const radarY = (asteroid.mesh.position.y - (cameraRef.current?.position.y || 0)) / 150 * 40;
                    
                    return (
                      <div
                        key={index}
                        className={`radar-dot ${asteroid.dangerous ? 'dangerous' : ''}`}
                        style={{
                          left: `calc(50% + ${radarX}px)`,
                          top: `calc(50% + ${radarY}px)`
                        }}
                      />
                    );
                  })}
                </div>
                <div className="radar-label">RADAR</div>
              </div>
            </div>
            
            {/* Información del asteroide cercano */}
            {asteroidInfo && (
              <div className="asteroid-info">
                <h4>🪨 {asteroidInfo.name}</h4>
                <p>Tipo: {asteroidInfo.type} ({asteroidInfo.composition})</p>
                <p>Diámetro: {asteroidInfo.size.toFixed(1)}m</p>
                <p>Distancia: {asteroidInfo.distance}km</p>
                <p>Velocidad: {asteroidInfo.relativeVelocity} km/s</p>
                <p>Densidad: {asteroidInfo.density} g/cm³</p>
                {asteroidInfo.dangerous && <p className="danger-text">⚠️ PELIGROSO</p>}
              </div>
            )}
            
            {/* Advertencia de peligro */}
            {dangerWarning && (
              <div className="danger-warning">
                ⚠️ ASTEROIDE PELIGROSO DETECTADO ⚠️
              </div>
            )}
          </div>
        </>
      )}
      
      {/* Menú principal */}
      {gameState === 'MENU' && (
        <div className="menu">
          <h1>ASTEROID DODGER 3D</h1>
          <h2>🚀 ENTRENAMIENTO DE PILOTOS NASA</h2>
          <p>Esquiva asteroides NEO en tiempo real</p>
          <button onClick={() => {
            console.log('Botón clickeado');
            startGame();
          }} className="start-button">
            INICIAR MISIÓN
          </button>
          <div className="controls">
            <h3>CONTROLES:</h3>
            <p>⬅️➡️⬆️⬇️ o WASD: Mover nave</p>
            <p>ESC: Pausar</p>
          </div>
        </div>
      )}
      
      {/* Pantalla de pausa */}
      {gameState === 'PAUSED' && (
        <div className="pause-screen">
          <h2>⏸️ MISIÓN PAUSADA</h2>
          <button onClick={togglePause} className="resume-button">
            REANUDAR
          </button>
          <button onClick={backToMenu} className="menu-button">
            VOLVER AL MENÚ
          </button>
        </div>
      )}
      
      {/* Pantalla de game over */}
      {gameState === 'GAMEOVER' && (
        <div className="gameover-screen">
          <h2>💥 MISIÓN FALLIDA</h2>
          <div className="final-stats">
            <p>Puntuación Final: {score.toLocaleString()}</p>
            <p>Asteroides Esquivados: {asteroidsDodged}</p>
            <p>Velocidad Máxima: {speed.toFixed(1)}x</p>
          </div>
          <button onClick={startGame} className="retry-button">
            REINTENTAR MISIÓN
          </button>
          <button onClick={backToMenu} className="menu-button">
            VOLVER AL MENÚ
          </button>
        </div>
      )}
    </div>
  );
};

export default AsteroidDodger;