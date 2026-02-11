<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import * as THREE from 'three';
	import gsap from 'gsap';
	import { onMount, onDestroy } from 'svelte';
	import MeteorTrail from './MeteorTrail.svelte';
	import {
		SPAWN_INTERVAL,
		APPEARANCE_DURATION,
		TRAVEL_DURATION,
		BALL_COLOR,
		BALL_METALNESS,
		BALL_ROUGHNESS
	} from '$lib/utils/constants';

	// Create a procedural roughness map texture
	function createRoughnessMap(): THREE.Texture {
		const size = 512;
		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d')!;

		// Create noise pattern
		const imageData = ctx.createImageData(size, size);
		for (let i = 0; i < imageData.data.length; i += 4) {
			// Random grayscale value for roughness variation
			const value = Math.random() * 100 + 100; // 100-200 range
			imageData.data[i] = value; // R
			imageData.data[i + 1] = value; // G
			imageData.data[i + 2] = value; // B
			imageData.data[i + 3] = 255; // A
		}
		ctx.putImageData(imageData, 0, 0);

		const texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		return texture;
	}

	// Create text texture for wrapping around the ball
	function createTextTexture(): THREE.Texture {
		const canvas = document.createElement('canvas');
		canvas.width = 2048;
		canvas.height = 256;
		const ctx = canvas.getContext('2d')!;

		// Clear background (transparent)
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Set up text style
		ctx.fillStyle = '#ffffff';
		ctx.font = 'bold 120px Arial';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		// Repeat TEMPERATURE text multiple times to wrap around
		const text = 'TEMPERATURE  ';
		const textWidth = ctx.measureText(text).width;
		const repetitions = Math.ceil(canvas.width / textWidth) + 1;

		for (let i = 0; i < repetitions; i++) {
			ctx.fillText(text, i * textWidth, canvas.height / 2);
		}

		const texture = new THREE.CanvasTexture(canvas);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.ClampToEdgeWrapping;
		return texture;
	}

	// Props
	let { path, index, ballRadius, spawnDelay, spinSpeed }: {
		path: THREE.CubicBezierCurve3;
		index: number;
		ballRadius: number;
		spawnDelay: number;
		spinSpeed: number;
	} = $props();

	// State
	let scale = $state(0);
	let position = $state(new THREE.Vector3());
	let trailPosition = $state<THREE.Vector3 | null>(null);
	let rotation = $state(new THREE.Euler(0, 0, 0));
	let rotationAngle = $state(0); // Single angle for consistent axis rotation

	// Animation control
	let animationProgress = $state(0);
	let timeline: gsap.core.Timeline;

	// Fixed diagonal rotation axis (normalized)
	const rotationAxis = new THREE.Vector3(1, 1, 1).normalize();

	// Roughness map for surface variation
	let roughnessMap = $state<THREE.Texture | undefined>(undefined);
	let textTexture = $state<THREE.Texture | undefined>(undefined);

	onMount(() => {
		// Create roughness map for surface variation
		roughnessMap = createRoughnessMap();

		// Create text texture
		textTexture = createTextTexture();

		// Create GSAP timeline with provided spawn delay
		timeline = gsap.timeline({ delay: spawnDelay });

		// Appearance animation (scale from 0 to 1)
		timeline.to(
			{ scale: 0 },
			{
				scale: 1,
				duration: APPEARANCE_DURATION,
				ease: 'power2.out',
				onUpdate: function () {
					scale = this.targets()[0].scale;
				}
			}
		);

		// Travel animation (progress along path)
		timeline.to(
			{ progress: 0 },
			{
				progress: 1,
				duration: TRAVEL_DURATION,
				ease: 'power2.inOut', // Easing at start and end
				onUpdate: function () {
					animationProgress = this.targets()[0].progress;
				}
			},
			`-=${APPEARANCE_DURATION * 0.2}` // Slight overlap
		);
	});

	// Update position and rotation based on animation progress
	useTask((delta) => {
		// Get position along the bezier curve (even at progress 0)
		const point = path.getPoint(animationProgress);
		position = point.clone();

		// Update trail position only if ball has appeared
		if (scale > 0.1 && animationProgress > 0) {
			trailPosition = point.clone();
		}

		// Spin the ball on a fixed diagonal axis using axis-angle rotation
		rotationAngle += spinSpeed * delta;
		const quaternion = new THREE.Quaternion();
		quaternion.setFromAxisAngle(rotationAxis, rotationAngle);
		const newRotation = new THREE.Euler();
		newRotation.setFromQuaternion(quaternion);
		rotation = newRotation;
	});

	onDestroy(() => {
		if (timeline) {
			timeline.kill();
		}
	});
</script>

<!-- Meteor Trail -->
<MeteorTrail position={trailPosition} />

<!-- Meteor Ball -->
{#if roughnessMap && textTexture}
	<T.Group position={[position.x, position.y, position.z]} scale={scale} rotation={[rotation.x, rotation.y, rotation.z]}>
		<!-- Ball mesh -->
		<T.Mesh>
			<T.SphereGeometry args={[ballRadius, 64, 64]} />
			<T.MeshStandardMaterial
				color={BALL_COLOR}
				metalness={BALL_METALNESS}
				roughness={BALL_ROUGHNESS}
				roughnessMap={roughnessMap}
			/>
		</T.Mesh>

		<!-- Text cylinder wrapping around equator -->
		<T.Mesh rotation={[0, 0, 0]}>
			<T.CylinderGeometry args={[ballRadius * 1.01, ballRadius * 1.01, ballRadius * 0.3, 64, 1, true]} />
			<T.MeshBasicMaterial
				map={textTexture}
				transparent={true}
				side={THREE.DoubleSide}
				depthWrite={false}
			/>
		</T.Mesh>
	</T.Group>
{/if}
