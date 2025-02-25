import React from 'react';
import { AnimationConfig } from '../config/animationConfig';
import { Sliders as Sliders2 } from 'lucide-react';

interface ControlsProps {
  config: Partial<AnimationConfig>;
  onChange: (config: Partial<AnimationConfig>) => void;
}

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const updateConfig = (path: string[], value: number) => {
    const newConfig = { ...config };
    let current: any = newConfig;
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    onChange(newConfig);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/10 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white/20 transition-colors"
      >
        <Sliders2 className="w-6 h-6 text-white" />
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-4 w-72">
          <h3 className="text-white font-semibold mb-4">Animation Controls</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-white text-sm">Camera Distance</label>
              <input
                type="range"
                min="2"
                max="10"
                step="0.1"
                value={config.camera?.distance || 5}
                onChange={(e) => updateConfig(['camera', 'distance'], parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm">Animation Speed</label>
              <input
                type="range"
                min="0.001"
                max="0.05"
                step="0.001"
                value={config.timing?.baseSpeed || 0.01}
                onChange={(e) => updateConfig(['timing', 'baseSpeed'], parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm">Swirling Strength</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.effects?.swirlingStrength || 0.2}
                onChange={(e) => updateConfig(['effects', 'swirlingStrength'], parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm">Energy Threshold</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.effects?.energyThreshold || 0.7}
                onChange={(e) => updateConfig(['effects', 'energyThreshold'], parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-white text-sm">Transparency</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={config.effects?.transparency || 0.8}
                onChange={(e) => updateConfig(['effects', 'transparency'], parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Controls;