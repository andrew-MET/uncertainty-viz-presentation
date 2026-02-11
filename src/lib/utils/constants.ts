// Animation timing constants
export const BALL_COUNT = 25;
export const APPEARANCE_DURATION = 0.8; // seconds for ball to scale from 0 to full size
export const TRAVEL_DURATION = 1; // seconds for ball to travel across screen
export const SPAWN_INTERVAL = APPEARANCE_DURATION + TRAVEL_DURATION; // wait for previous ball to finish
export const BALL_SIZE_PERCENT = 0.1; // 10% of screen height
export const TRAIL_LENGTH = 80; // number of position points in trail
export const TRAIL_WIDTH = 2.0; // trail ribbon width at widest (near ball)

// Path generation bounds
export const START_X = -10;
export const END_X = 10;
export const START_Y = 0;
export const END_Y_MIN = -3;
export const END_Y_MAX = 3;
export const START_Z = 0;
export const END_Z_MIN = -5;
export const END_Z_MAX = 5;

// Visual constants
export const BACKGROUND_COLOR = '#2a2a2a';
export const BALL_COLOR = '#4682B4'; // blue steel
export const BALL_METALNESS = 0.3;
export const BALL_ROUGHNESS = 0.6;
