import * as THREE from 'three';
import { TRAIL_LENGTH, TRAIL_WIDTH } from './constants';

/**
 * Custom BufferGeometry class for creating and updating meteor trails
 * Maintains a circular buffer of positions and generates a ribbon mesh
 */
export class TrailGeometry extends THREE.BufferGeometry {
	private positions: THREE.Vector3[] = [];
	private maxLength: number;
	private width: number;

	constructor(maxLength: number = TRAIL_LENGTH, width: number = TRAIL_WIDTH) {
		super();
		this.maxLength = maxLength;
		this.width = width;

		// Initialize empty buffers
		const vertices = new Float32Array(maxLength * 6 * 3); // 2 triangles per segment, 3 vertices per triangle
		const uvs = new Float32Array(maxLength * 6 * 2);

		this.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
		this.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
	}

	/**
	 * Adds a new position to the trail
	 * @param position - The new position to add
	 */
	addPoint(position: THREE.Vector3) {
		// Add new position to the front
		this.positions.unshift(position.clone());

		// Limit trail length
		if (this.positions.length > this.maxLength) {
			this.positions.pop();
		}

		// Update the geometry
		this.updateGeometry();
	}

	/**
	 * Updates the BufferGeometry based on current positions
	 */
	private updateGeometry() {
		if (this.positions.length < 2) {
			return;
		}

		const vertices: number[] = [];
		const uvs: number[] = [];

		// Generate ribbon mesh from positions
		for (let i = 0; i < this.positions.length - 1; i++) {
			const current = this.positions[i];
			const next = this.positions[i + 1];

			// Calculate perpendicular vector for ribbon width
			const direction = new THREE.Vector3().subVectors(next, current).normalize();

			// Create a perpendicular vector (using camera up as reference)
			const up = new THREE.Vector3(0, 1, 0);
			const perpendicular = new THREE.Vector3().crossVectors(direction, up).normalize();

			// If perpendicular is too small, use alternative axis
			if (perpendicular.length() < 0.01) {
				perpendicular.set(0, 0, 1);
			}

			// Taper the width: full width at front (i=0), narrow at back
			const widthScale = 1.0 - (i / this.positions.length);
			perpendicular.multiplyScalar(this.width * 0.5 * widthScale);

			// Create quad vertices (two triangles)
			const p1 = current.clone().add(perpendicular);
			const p2 = current.clone().sub(perpendicular);
			const p3 = next.clone().add(perpendicular);
			const p4 = next.clone().sub(perpendicular);

			// Triangle 1
			vertices.push(p1.x, p1.y, p1.z);
			vertices.push(p2.x, p2.y, p2.z);
			vertices.push(p3.x, p3.y, p3.z);

			// Triangle 2
			vertices.push(p2.x, p2.y, p2.z);
			vertices.push(p4.x, p4.y, p4.z);
			vertices.push(p3.x, p3.y, p3.z);

			// UV coordinates for fading effect
			const u = i / (this.positions.length - 1);

			// Triangle 1 UVs
			uvs.push(u, 1);
			uvs.push(u, 0);
			uvs.push(u, 1);

			// Triangle 2 UVs
			uvs.push(u, 0);
			uvs.push(u, 0);
			uvs.push(u, 1);
		}

		// Update buffer attributes
		const positionAttribute = this.getAttribute('position') as THREE.BufferAttribute;
		const uvAttribute = this.getAttribute('uv') as THREE.BufferAttribute;

		for (let i = 0; i < vertices.length && i < positionAttribute.array.length; i++) {
			positionAttribute.array[i] = vertices[i];
		}

		for (let i = 0; i < uvs.length && i < uvAttribute.array.length; i++) {
			uvAttribute.array[i] = uvs[i];
		}

		positionAttribute.needsUpdate = true;
		uvAttribute.needsUpdate = true;

		// Update draw range to only render what we have
		this.setDrawRange(0, vertices.length / 3);
	}

	/**
	 * Clears all trail positions
	 */
	clear() {
		this.positions = [];
		this.updateGeometry();
	}
}
