<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import * as THREE from 'three';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let { delay = 0 }: { delay?: number } = $props();

	// State
	let positionZ = $state(-100);
	let scale = $state(0.1);
	let opacity = $state(0);

	onMount(() => {
		// Animate title coming from distance
		const timeline = gsap.timeline({ delay });

		// Fade in and scale up while moving forward
		timeline.to(
			{ z: -100, s: 0.1, o: 0 },
			{
				z: 0,
				s: 1,
				o: 1,
				duration: 2.5,
				ease: 'power2.out',
				onUpdate: function () {
					const target = this.targets()[0];
					positionZ = target.z;
					scale = target.s;
					opacity = target.o;
				}
			}
		);
	});
</script>

<T.Group position={[0, 0, positionZ]} {scale} rotation={[0, Math.PI / 6, 0]}>
	<!-- Glow lights for ambient purple/pink atmosphere -->
	<T.PointLight position={[0, 0, -2]} intensity={2 * opacity} color="#ff00ff" distance={10} />
	<T.PointLight position={[0, 0, 2]} intensity={1.5 * opacity} color="#8800ff" distance={8} />

	<!-- "UNCERTAINTY" - Chrome style with thick outline -->
	{#if opacity > 0}
		<!-- Outer glow layer -->
		<Text
			text="UNCERTAINTY"
			fontSize={1.8}
			color="#ff00ff"
			anchorX="center"
			anchorY="middle"
			position={[0, 0.9, -0.05]}
			outlineWidth={0.25}
			outlineColor="#ff00ff"
			outlineOpacity={0.3}
		/>
		<!-- Main chrome text -->
		<Text
			text="UNCERTAINTY"
			fontSize={1.8}
			color="#e0e0e0"
			anchorX="center"
			anchorY="middle"
			position={[0, 0.9, 0]}
			outlineWidth={0.15}
			outlineColor="#ffffff"
		/>
	{/if}

	<!-- "VISUALIZATION" - Chrome style with thick outline -->
	{#if opacity > 0}
		<!-- Outer glow layer -->
		<Text
			text="VISUALIZATION"
			fontSize={1.8}
			color="#4400ff"
			anchorX="center"
			anchorY="middle"
			position={[0, -0.9, -0.05]}
			outlineWidth={0.25}
			outlineColor="#4400ff"
			outlineOpacity={0.3}
		/>
		<!-- Main chrome text -->
		<Text
			text="VISUALIZATION"
			fontSize={1.8}
			color="#e0e0e0"
			anchorX="center"
			anchorY="middle"
			position={[0, -0.9, 0]}
			outlineWidth={0.15}
			outlineColor="#ffffff"
		/>
	{/if}

	<!-- Lens flare elements -->
	{#if opacity > 0}
		<!-- Bright core lights for lens flare -->
		<T.Mesh position={[-3, 0.5, 0.2]}>
			<T.SphereGeometry args={[0.1, 16, 16]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity} />
		</T.Mesh>
		<T.PointLight position={[-3, 0.5, 0.2]} intensity={5 * opacity} color="#ffffff" distance={3} />

		<T.Mesh position={[3.5, -0.3, 0.2]}>
			<T.SphereGeometry args={[0.12, 16, 16]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity} />
		</T.Mesh>
		<T.PointLight position={[3.5, -0.3, 0.2]} intensity={6 * opacity} color="#ffffff" distance={3} />

		<!-- Lens flare crosses (using thin boxes) -->
		<!-- Horizontal beam 1 -->
		<T.Mesh position={[-3, 0.5, 0.3]} rotation={[0, 0, 0]}>
			<T.BoxGeometry args={[2, 0.01, 0.01]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity * 0.7} />
		</T.Mesh>
		<!-- Vertical beam 1 -->
		<T.Mesh position={[-3, 0.5, 0.3]} rotation={[0, 0, 0]}>
			<T.BoxGeometry args={[0.01, 2, 0.01]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity * 0.7} />
		</T.Mesh>

		<!-- Horizontal beam 2 -->
		<T.Mesh position={[3.5, -0.3, 0.3]} rotation={[0, 0, Math.PI / 4]}>
			<T.BoxGeometry args={[2.5, 0.01, 0.01]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity * 0.6} />
		</T.Mesh>
		<!-- Vertical beam 2 -->
		<T.Mesh position={[3.5, -0.3, 0.3]} rotation={[0, 0, Math.PI / 4]}>
			<T.BoxGeometry args={[0.01, 2.5, 0.01]} />
			<T.MeshBasicMaterial color="#ffffff" transparent={true} opacity={opacity * 0.6} />
		</T.Mesh>
	{/if}
</T.Group>
