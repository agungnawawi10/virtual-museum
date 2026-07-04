/**
 * Configuration file for Virtual Museum
 * Central place for all magic numbers and settings
 */

const CONFIG = {
  // Scene Configuration
  SCENE: {
    FOG_NEAR: 10,
    FOG_FAR: 30,
    BACKGROUND_COLOR: '#1a1208',
    FOG_COLOR: '#1a1208'
  },

  // Camera Configuration
  CAMERA: {
    HEIGHT: 1.7,
    NEAR: 0.1,
    FAR: 40,
    STARTING_POSITION: { x: 0, y: 1.2, z: 7 }
  },

  // Movement Configuration
  MOVEMENT: {
    SPEED: 2.0,
    BOUND_X_MIN: -7.9,
    BOUND_X_MAX: 7.9,
    BOUND_Y_MIN: 0.0,
    BOUND_Y_MAX: 3.9,
    BOUND_Z_MIN: -9.5,
    BOUND_Z_MAX: 9.5,
    BOUNDARY_PADDING: 0.25,
    FRAME_RATE: 40 // ms between boundary checks
  },

  // Audio Configuration
  AUDIO: {
    FOOTSTEP_INTERVAL: 0.42, // seconds
    FOOTSTEP_DURATION: 0.12, // seconds
    FOOTSTEP_VOLUME: 0.08,
    FOOTSTEP_FREQUENCY: 120, // Hz
    FOOTSTEP_FREQUENCY_END: 70, // Hz
    NOISE_FREQUENCY: 900 // Hz
  },

  // AR Viewer Configuration
  AR: {
    SCALE_MIN: 0.15,
    SCALE_MAX: 1.5,
    MARKER_PRESET: 'hiro',
    CAMERA_WIDTH: 1280,
    CAMERA_HEIGHT: 960,
    CAMERA_TIMEOUT: 8000, // ms
    ROTATION_SENSITIVITY: 0.5, // desktop
    ROTATION_SENSITIVITY_MOBILE: 0.4,
    PINCH_ZOOM_SENSITIVITY: 0.002
  },

  // UI Configuration
  UI: {
    INFO_PANEL_TRANSITION: 350, // ms
    TOOLTIP_FADE_IN: 200, // ms
    DPAD_BUTTON_SIZE: 44, // px
    DPAD_GRID_SIZE: 132 // px
  },

  // Color Palette
  COLORS: {
    PRIMARY_TEXT: '#f5e6c8',
    ACCENT_GOLD: '#e8c97a',
    DARK_BG: '#0a0602',
    BUTTON_BLUE: '#2e75b6',
    BUTTON_BLUE_LIGHT: '#7ec8f5',
    DETECTED_GREEN: '#4caf50',
    FRAME_BROWN: '#3d2b0e'
  },

  // Collections Data
  COLLECTIONS: {
    painting: [
      'painting-1',
      'painting-2',
      'painting-3',
      'painting-4',
      'painting-5',
      'painting-6'
    ],
    artifact: [
      'artifact-1',
      'artifact-2',
      'artifact-3'
    ]
  },

  // Feature Flags
  FEATURES: {
    ENABLE_AUDIO: true,
    ENABLE_FOOTSTEPS: true,
    ENABLE_SHADOWS: true,
    ENABLE_MOBILE_CONTROLS: true,
    DEBUG_MODE: false
  }
};

// Validate configuration on load
if (CONFIG.FEATURES.DEBUG_MODE) {
  console.log('Virtual Museum Configuration:', CONFIG);
}

export default CONFIG;
