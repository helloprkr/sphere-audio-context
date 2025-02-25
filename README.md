# sphere-audio-context

# 🎵 Three.js Audio Visualization Framework

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-0.162.0-green.svg)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.2-purple.svg)](https://vitejs.dev/)
<img width="899" alt="Screenshot 2025-02-25 at 3 33 00 PM" src="https://github.com/user-attachments/assets/4648d3bb-df7b-43f0-b722-9d4257476c7b" />

A robust boilerplate for building audio-reactive 3D visualizations with Three.js, Web Audio API, and React.

Created by [@HelloPrkr](https://github.com/helloprkr).

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🎯 Core Features

- **WebGL Rendering**: Three.js with custom GLSL shaders
- **Audio Processing**: Real-time FFT analysis (20Hz-20kHz)
- **React Integration**: Type-safe components with hot reload
- **Performance**: Optimized for 60+ FPS

## 🛠️ Technical Stack

- **Frontend**: React 18.3 + TypeScript 5.5
- **3D Graphics**: Three.js 0.162
- **Build System**: Vite 5.4
- **Audio**: Web Audio API
- **Styling**: Tailwind CSS

## 📦 Installation

```bash
git clone https://github.com/yourusername/threejs-audio-viz.git
cd threejs-audio-viz
npm install
```

## 💻 Usage

```typescript
import { ThreeScene } from './components/ThreeScene';
import { AnimationConfig } from './config/animationConfig';

const config: Partial<AnimationConfig> = {
  sphere: { size: 1.0, segments: 64 },
  audio: { sensitivity: 1.0, attackSpeed: 0.5 }
};

function App() {
  return <ThreeScene config={config} />;
}
```

## ⚙️ Configuration

### Visual Settings
```typescript
interface VisualConfig {
  gradient: {
    type: 'linear' | 'radial' | 'angular';
    points: GradientPoint[];
    direction: number;
  };
  effects: {
    swirlingStrength: number;
    energyThreshold: number;
    transparency: number;
  };
}
```

### Audio Settings
```typescript
interface AudioConfig {
  sensitivity: number;
  minFrequency: number;
  maxFrequency: number;
  attackSpeed: number;
  decaySpeed: number;
  effectType: 'scale' | 'color' | 'displacement' | 'particles' | 'deformation';
}
```

## 🏗️ Architecture

```
src/
├── components/
│   ├── ThreeScene.tsx    # WebGL renderer
│   ├── Controls.tsx      # UI controls
│   └── AudioEffects.tsx  # Audio processing
├── config/
│   ├── animationConfig.ts
│   └── audioEffects.ts
└── App.tsx
```

## 🔧 Development

```bash
# Development
npm run dev

# Type checking
npm run typecheck

# Production build
npm run build
```

## 🎨 Features

### Visualization
- 6-point gradient system
- 10k particle starfield
- Orbital camera controls
- Real-time shader effects

### Audio
- Microphone input handling
- FFT frequency analysis
- Attack/decay controls
- Multiple effect modes

</div>


[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/helloprkr/sphere-audio-context)
