<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { TrailGeometry } from '$lib/utils/trailGeometry';
	import { onMount } from 'svelte';

	// Import shaders as strings
	import vertexShader from '$lib/shaders/trail.vert.glsl?raw';
	import fragmentShader from '$lib/shaders/trail.frag.glsl?raw';

	// Props
	let { position = null }: {
		position?: THREE.Vector3 | null;
	} = $props();

	// Trail geometry and material
	let trailGeometry = $state<TrailGeometry | undefined>(undefined);
	let trailMaterial = $state<THREE.ShaderMaterial | undefined>(undefined);

	onMount(() => {
		// Create trail geometry
		trailGeometry = new TrailGeometry();

		// Create shader material
		trailMaterial = new THREE.ShaderMaterial({
			vertexShader,
			fragmentShader,
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthWrite: false,
			side: THREE.DoubleSide
		});
	});

	// Update trail when position changes
	$effect(() => {
		if (trailGeometry && position) {
			trailGeometry.addPoint(position);
		}
	});
</script>

{#if trailGeometry && trailMaterial}
	<T.Mesh geometry={trailGeometry} material={trailMaterial} />
{/if}
