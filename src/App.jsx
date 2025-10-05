import { useState } from 'react'
import AsteroidDodger from './components/AsteroidDodger'
import './App.css'

function App() {
  const [showGame, setShowGame] = useState(false)

  if (showGame) {
    return <AsteroidDodger />
  }

  return (
    <div className="app-main">
      <div className="header">
        <h1>🚀 NASA - SISTEMA DE ENTRENAMIENTO</h1>
        <h2>Centro de Comando Espacial</h2>
      </div>
      
      <div className="mission-control">
        <div className="mission-card">
          <div className="mission-icon">🛰️</div>
          <h3>ASTEROID DODGER 3D</h3>
          <p>Simulador de esquive de asteroides NEO (Near Earth Objects)</p>
          <p>Entrena tus reflejos para misiones espaciales reales</p>
          <button 
            onClick={() => setShowGame(true)}
            className="launch-button"
          >
            🎮 INICIAR ENTRENAMIENTO
          </button>
        </div>
        
        <div className="info-panel">
          <h4>📊 ESPECIFICACIONES DE LA MISIÓN:</h4>
          <ul>
            <li>🎯 Motor gráfico: Three.js WebGL</li>
            <li>🌌 Entorno: Espacio profundo 3D</li>
            <li>⚡ Física: Inercia y fricción realistas</li>
            <li>🪨 Asteroides: Basados en datos NASA</li>
            <li>🎮 Controles: WASD / Flechas</li>
          </ul>
        </div>
      </div>
      
      <div className="nasa-footer">
        <p>Powered by NASA Open Data & Three.js</p>
      </div>
    </div>
  )
}

export default App
