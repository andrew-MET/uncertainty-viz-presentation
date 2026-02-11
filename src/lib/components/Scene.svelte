<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { BACKGROUND_COLOR } from '$lib/utils/constants';
	import { OrbitControls } from '@threlte/extras';

	// Convert hex color to Three.js color format
	const bgColor = BACKGROUND_COLOR;
</script>

<div class="scene-container">
	<Canvas>
		<!-- Set scene background color -->
		<T.Color attach="background" args={[bgColor]} />

		<T.PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50}>
			<OrbitControls enableZoom={true} enablePan={true} />
		</T.PerspectiveCamera>

		<!-- Lighting -->
		<T.AmbientLight intensity={0.6} />
		<T.DirectionalLight position={[2, 4, 10]} intensity={1.2} />

		<!-- Scene content slot -->
		<slot />
	</Canvas>
</div>

<style>
	.scene-container {
		width: 100vw;
		height: 100vh;
		background-color: #2a2a2a;
	}

	:global(canvas) {
		display: block;
	}
</style>
