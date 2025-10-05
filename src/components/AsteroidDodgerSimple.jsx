import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './AsteroidDodger.css';

const AsteroidDodger = () => {
  const mountRef = useRef(null);
  const [gameState, setGameState] = useState('MENU');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      initGame();
    }
    
    return () => {
      cleanup();
    };
  }, [gameState]);

  const initGame = () => {
    if (!mountRef.current) return;

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
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 1);
      rendererRef.current = renderer;

      // Limpiar contenedor y agregar canvas
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);

      // Crear iluminación básica
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // Crear un cubo de prueba
      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.z = -5;
      scene.add(cube);

      // Iniciar animación
      animate();

    } catch (error) {
      console.error('Error al inicializar el juego:', error);
    }
  };

  const animate = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const cleanup = () => {
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current);
    }
    
    if (rendererRef.current && mountRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement);
      rendererRef.current.dispose();
    }
  };

  const startGame = () => {
    console.log('Iniciando juego...');
    setGameState('PLAYING');
  };

  const backToMenu = () => {
    cleanup();
    setGameState('MENU');
  };

  return (
    <div className="asteroid-dodger">
      <div ref={mountRef} className="game-container" />
      
      {/* Menú principal */}
      {gameState === 'MENU' && (
        <div className="menu">
          <h1>ASTEROID DODGER 3D</h1>
          <h2>🚀 ENTRENAMIENTO DE PILOTOS NASA</h2>
          <p>Versión de prueba - Cubo verde visible</p>
          <button onClick={startGame} className="start-button">
            INICIAR MISIÓN
          </button>
        </div>
      )}
      
      {/* HUD básico */}
      {gameState === 'PLAYING' && (
        <div className="hud">
          <div className="hud-top-left">
            <div className="score">SCORE: {score}</div>
            <div className="lives">VIDAS: {lives}</div>
          </div>
          <button onClick={backToMenu} style={{position: 'absolute', top: '20px', right: '20px', zIndex: 300}}>
            VOLVER AL MENÚ
          </button>
        </div>
      )}
    </div>
  );
};

export default AsteroidDodger;