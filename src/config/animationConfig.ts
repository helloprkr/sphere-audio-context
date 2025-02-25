import { Vector2, Vector3 } from 'three';

export interface AnimationConfig {
  sphere: {
    size: number;
    segments: number;
  };
  noise: {
    swirling: number;
    energy: number;
    tendrils: number;
  };
  colors: {
    primary: Vector3;
    secondary: Vector3;
  };
  timing: {
    baseSpeed: number;
    swirlingSpeed: number;
    energySpeed: number;
    tendrilsSpeed: number;
  };
  effects: {
    swirlingStrength: number;
    energyThreshold: number;
    tendrilsThreshold: number;
    transparency: number;
  };
  camera: {
    fov: number;
    distance: number;
    near: number;
    far: number;
  };
  stars: {
    count: number;
    size: number;
  };
  input: {
    audioSensitivity: number;
    textStrength: number;
    gyroStrength: number;
  };
}

export const defaultConfig: AnimationConfig = {
  sphere: {
    size: 1.0,
    segments: 64
  },
  noise: {
    swirling: 5.0,
    energy: 10.0,
    tendrils: 3.0
  },
  colors: {
    primary: new Vector3(0.0, 0.5, 0.5),
    secondary: new Vector3(1.0, 0.8, 0.0)
  },
  timing: {
    baseSpeed: 0.01,
    swirlingSpeed: 0.5,
    energySpeed: 2.0,
    tendrilsSpeed: 0.3
  },
  effects: {
    swirlingStrength: 0.2,
    energyThreshold: 0.7,
    tendrilsThreshold: 0.5,
    transparency: 0.8
  },
  camera: {
    fov: 75,
    distance: 5,
    near: 0.1,
    far: 1000
  },
  stars: {
    count: 10000,
    size: 0.1
  },
  input: {
    audioSensitivity: 0.5,
    textStrength: 0.1,
    gyroStrength: 0.2
  }
};