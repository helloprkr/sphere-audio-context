import React, { useState } from 'react';
import ThreeScene from './components/ThreeScene';
import Controls from './components/Controls';
import { AnimationConfig, defaultConfig } from './config/animationConfig';

function App() {
  const [config, setConfig] = useState<Partial<AnimationConfig>>(defaultConfig);

  return (
    <div className="w-full h-screen">
      <ThreeScene config={config} />
      <Controls config={config} onChange={setConfig} />
    </div>
  );
}

export default App;