# 🚀 Asteroid Dodger 3D

A thrilling 3D space survival game powered by real NASA data. Navigate through a field of Near-Earth Objects (NEOs) using official NASA asteroid data while experiencing cutting-edge 3D graphics.

![Asteroid Dodger 3D](https://img.shields.io/badge/Game-Asteroid%20Dodger%203D-blue?style=for-the-badge&logo=rocket)
![NASA API](https://img.shields.io/badge/NASA-API%20Powered-red?style=for-the-badge&logo=nasa)
![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)

## 🎮 Game Overview

Asteroid Dodger 3D is an immersive space survival game that combines real-world NASA asteroid data with stunning 3D graphics. Players must navigate their spacecraft through a dangerous field of Near-Earth Objects (NEOs), using skill and strategy to survive as long as possible while learning about real asteroids that pass close to Earth.

### 🌟 Key Features

- **🛰️ Real NASA Data**: Powered by NASA's Near Earth Object Web Service (NeoWs) API
- **🎯 3D Graphics**: Stunning WebGL-powered visuals using Three.js
- **📊 Persistent Information Panel**: Real-time data on the closest asteroids
- **🔔 Smart Notifications**: Temporary alerts for incoming dangerous asteroids
- **⚡ Dynamic Difficulty**: Speed increases as you survive longer
- **🎨 Realistic Visuals**: Authentic asteroid textures and physics
- **📱 Responsive Design**: Optimized for both desktop and mobile devices

## 🚀 Live Demo

🎮 **[Play the Game](https://your-deployment-url.com)** (Replace with actual deployment URL)

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **3D Graphics**: Three.js
- **Build Tool**: Vite
- **Styling**: CSS3 with advanced animations
- **Data Source**: NASA NeoWs API
- **Deployment**: (Add your deployment platform)

## 🎯 Gameplay Features

### 🕹️ Controls
- **Movement**: `W` `A` `S` `D` or Arrow Keys
- **Boost**: `SPACE` (Limited use)
- **Pause**: `P`

### 📊 HUD Elements
- **Score**: Points earned for dodging asteroids
- **Lives**: Health indicator (3 lives total)
- **Speed**: Current game speed multiplier
- **Dodged**: Total asteroids successfully avoided
- **Radar**: Mini-map showing nearby asteroids

### 🎯 Information Systems

#### 📋 Persistent Panel (Right Side)
- Shows the **nearest asteroid** within 150km
- Real-time distance updates
- Complete asteroid information including:
  - NASA designation
  - Diameter and velocity
  - Hazard classification
  - Real distance from Earth

#### 🔔 Temporary Notifications
- Triggered when asteroids come within 50km
- Stack up to 4 notifications
- 8-second duration with smooth animations
- FIFO (First In, First Out) dismissal system

### 🌌 Asteroid Types

#### 🛰️ Real NASA Asteroids
- **C-type**: Carbonaceous asteroids
- **S-type**: Silicaceous asteroids  
- **M-type**: Metallic asteroids
- **X-type**: Potentially hazardous objects

#### ⚠️ Hazard Levels
- **Safe**: Standard asteroids (green indicators)
- **Potentially Hazardous**: Objects classified as PHAs by NASA (red indicators with glow effects)

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser with WebGL support

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Locura-de-Meteoritos/Game-Asteroid-Dodge.git
   cd Game-Asteroid-Dodge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### 🔑 NASA API Configuration

The game uses NASA's NeoWs API. The current API key is included, but for production use, you should:

1. Get your free API key from [NASA API Portal](https://api.nasa.gov)
2. Replace the API key in `src/components/AsteroidDodger.jsx`:
   ```javascript
   const NASA_API_KEY = "YOUR_API_KEY_HERE";
   ```

## 📁 Project Structure

```
src/
├── components/
│   ├── AsteroidDodger.jsx    # Main game component
│   └── AsteroidDodger.css    # Game styling
├── assets/
│   └── nave.jpg              # Spacecraft texture
├── App.jsx                   # Application entry point
└── main.jsx                  # React DOM mounting
```

## 🎨 Visual Features

### 🌟 3D Elements
- **Realistic Asteroids**: Procedurally textured with authentic materials
- **Particle Systems**: Collision effects and space debris
- **Dynamic Lighting**: Responsive to asteroid proximity and danger levels
- **Starfield**: Multi-layered parallax background

### 🎭 UI/UX Design
- **Glassmorphism**: Modern transparent panels with blur effects
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: High contrast and readable typography

## 📊 Game Mechanics

### 🎯 Scoring System
- **Base Points**: 100 points per safe asteroid dodged
- **Danger Bonus**: 250 points for hazardous asteroids
- **Speed Multiplier**: Points increase with game speed
- **Survival Time**: Additional points for extended gameplay

### ⚡ Difficulty Progression
- **Speed Increase**: Gradual acceleration every 10 asteroids
- **Spawn Rate**: More frequent asteroid generation
- **Density**: Increased asteroid field complexity
- **Size Variety**: Larger, more challenging obstacles

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment Options
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Use `gh-pages` branch
- **Custom Server**: Serve `dist` folder

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### 🐛 Bug Reports
Please use the [GitHub Issues](https://github.com/Locura-de-Meteoritos/Game-Asteroid-Dodge/issues) page to report bugs.

### 💡 Feature Requests
Have an idea? Open an issue with the `enhancement` label!

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA**: For providing the incredible NeoWs API and asteroid data
- **Three.js Team**: For the amazing 3D graphics library
- **React Team**: For the robust frontend framework
- **Vite Team**: For the lightning-fast build tool

## 📞 Support

- **Documentation**: [Wiki](https://github.com/Locura-de-Meteoritos/Game-Asteroid-Dodge/wiki)
- **Issues**: [GitHub Issues](https://github.com/Locura-de-Meteoritos/Game-Asteroid-Dodge/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Locura-de-Meteoritos/Game-Asteroid-Dodge/discussions)

---

🌌 **"Navigate the cosmos, dodge the asteroids, survive the void!"** 🌌

Made with ❤️ by [Locura-de-Meteoritos](https://github.com/Locura-de-Meteoritos)
