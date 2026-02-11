import * as THREE from 'three';
import {
	START_X,
	END_X,
	START_Y,
	END_Y_MIN,
	END_Y_MAX,
	START_Z,
	END_Z_MIN,
	END_Z_MAX
} from './constants';

/**
 * Generates a unique cubic bezier curve path for each meteor ball
 * @param seed - Used to generate deterministic random values for this path
 * @returns CubicBezierCurve3 defining the path
 */
export function generateMeteorPath(seed: number): THREE.CubicBezierCurve3 {
	// Simple seeded random function
	const seededRandom = (s: number) => {
		const x = Math.sin(s) * 10000;
		return x - Math.floor(x);
	};

	// Generate end position with variation
	const endY = END_Y_MIN + seededRandom(seed * 1.1) * (END_Y_MAX - END_Y_MIN);
	const endZ = END_Z_MIN + seededRandom(seed * 1.2) * (END_Z_MAX - END_Z_MIN);

	// Generate control points for smooth curves with dramatic movement
	// Control point 1: about 1/3 of the way across
	const cp1X = START_X + (END_X - START_X) * 0.33;
	const cp1Y = START_Y + seededRandom(seed * 1.3) * 12 - 6; // -6 to 6 (dramatic movement)
	const cp1Z = START_Z + seededRandom(seed * 1.4) * 10 - 5; // -5 to 5 (more depth)

	// Control point 2: about 2/3 of the way across
	const cp2X = START_X + (END_X - START_X) * 0.67;
	const cp2Y = endY + seededRandom(seed * 1.5) * 10 - 5; // dramatic variation
	const cp2Z = endZ + seededRandom(seed * 1.6) * 8 - 4; // more depth variation

	// Define the four points of the cubic bezier curve
	const startPoint = new THREE.Vector3(START_X, START_Y, START_Z);
	const controlPoint1 = new THREE.Vector3(cp1X, cp1Y, cp1Z);
	const controlPoint2 = new THREE.Vector3(cp2X, cp2Y, cp2Z);
	const endPoint = new THREE.Vector3(END_X, endY, endZ);

	return new THREE.CubicBezierCurve3(startPoint, controlPoint1, controlPoint2, endPoint);
}

/**
 * Generates all paths for the meteor balls
 * @param count - Number of paths to generate
 * @returns Array of CubicBezierCurve3 paths
 */
export function generateAllPaths(count: number): THREE.CubicBezierCurve3[] {
	const paths: THREE.CubicBezierCurve3[] = [];
	for (let i = 0; i < count; i++) {
		paths.push(generateMeteorPath(i + 1));
	}
	return paths;
}
