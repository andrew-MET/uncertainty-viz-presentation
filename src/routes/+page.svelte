<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import Reveal from 'reveal.js';
	import 'reveal.js/dist/reveal.css';
	import 'reveal.js/dist/theme/black.css';
	import Scene from '$lib/components/Scene.svelte';
	import MeteorBall from '$lib/components/MeteorBall.svelte';
	import { generateAllPaths } from '$lib/utils/pathGenerator';
	import {
		BALL_COUNT,
		BALL_SIZE_PERCENT,
		APPEARANCE_DURATION,
		TRAVEL_DURATION
	} from '$lib/utils/constants';
	import type * as THREE from 'three';

	// Generate paths for all balls
	let paths = $state<THREE.CubicBezierCurve3[]>([]);
	let ballRadius = $state(1);
	let animationKey = $state(0);
	let animationStarted = $state(false);
	let spawnDelays = $state<number[]>([]);
	let spinSpeeds = $state<number[]>([]);
	let deck: Reveal.Api;

	onMount(() => {
		// Generate all paths
		paths = generateAllPaths(BALL_COUNT);
		ballRadius = 0.7;

		// Generate spawn delays and spin speeds
		generateSpawnDelays();
		generateSpinSpeeds();

		// Initialize Reveal.js
		deck = new Reveal({
			embedded: false,
			width: '100%',
			height: '100%',
			margin: 0,
			minScale: 1,
			maxScale: 1,
			controls: true,
			progress: true,
			center: true,
			hash: true,
			transition: 'slide'
		});
		deck.initialize();

		// Auto-start animation when first slide is shown
		deck.on('slidechanged', (event: any) => {
			if (event.indexh === 0 && !animationStarted) {
				startAnimation();
			}
		});

		// Start animation on first slide load
		if (!animationStarted) {
			startAnimation();
		}
	});

	function generateSpinSpeeds() {
		spinSpeeds = [];
		for (let i = 0; i < BALL_COUNT; i++) {
			spinSpeeds.push(2 + Math.random() * 4);
		}
	}

	function generateSpawnDelays() {
		spawnDelays = [];
		let cumulativeDelay = 0;

		for (let i = 0; i < BALL_COUNT; i++) {
			spawnDelays.push(cumulativeDelay);
			const overlap = APPEARANCE_DURATION * 0.2;
			const delayToNext = APPEARANCE_DURATION - overlap;
			cumulativeDelay += delayToNext;
		}
	}

	function restartAnimation() {
		animationStarted = false;
		generateSpawnDelays();
		generateSpinSpeeds();
		setTimeout(() => {
			animationKey += 1;
			animationStarted = true;
		}, 50);
	}

	function startAnimation() {
		if (!animationStarted) {
			animationStarted = true;
		}
	}
</script>

<svelte:head>
	<title>Temperature Presentation</title>
</svelte:head>

<div class="reveal">
	<div class="slides">
		<!-- Slide 1: 3D Animation -->
		<section class="full-slide">
			<button
				class="restart-button"
				onclick={animationStarted ? restartAnimation : startAnimation}
			>
				{animationStarted ? 'Restart Animation' : 'Start Animation'}
			</button>

			{#if browser && paths.length > 0}
				<div class="scene-container">
					<Scene>
						{#if animationStarted}
							{#key animationKey}
								{#each paths as path, i}
									<MeteorBall
										{path}
										index={i}
										{ballRadius}
										spawnDelay={spawnDelays[i] || 0}
										spinSpeed={spinSpeeds[i] || 3}
									/>
								{/each}
							{/key}
						{/if}
					</Scene>
				</div>
			{/if}
		</section>

		<!-- Slide 2: Title -->
		<section>
			<h1>Temperature</h1>
			<p>A Visual Exploration</p>
		</section>

		<!-- Slide 3: Content -->
		<section>
			<h2>What is Temperature?</h2>
			<p>Temperature is a measure of the average kinetic energy of particles in a substance.</p>
		</section>

		<!-- Slide 4: More Content -->
		<section>
			<h2>Measuring Temperature</h2>
			<ul>
				<li>Celsius (°C)</li>
				<li>Fahrenheit (°F)</li>
				<li>Kelvin (K)</li>
			</ul>
		</section>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	.reveal {
		width: 100vw;
		height: 100vh;
	}

	.full-slide {
		height: 100vh;
		width: 100vw;
		padding: 0 !important;
	}

	.scene-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 1;
	}

	.restart-button {
		position: absolute;
		top: 20px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1000;
		padding: 12px 24px;
		font-size: 16px;
		font-weight: 600;
		color: white;
		background: rgba(70, 130, 180, 0.9);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 8px;
		cursor: pointer;
		backdrop-filter: blur(10px);
		transition: all 0.3s ease;
	}

	.restart-button:hover {
		background: rgba(70, 130, 180, 1);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateX(-50%) scale(1.05);
		box-shadow: 0 4px 12px rgba(70, 130, 180, 0.5);
	}

	.restart-button:active {
		transform: translateX(-50%) scale(0.98);
	}

	/* Reveal.js customization */
	:global(.reveal .slides section) {
		top: 0 !important;
	}

	:global(.reveal h1, .reveal h2, .reveal h3, .reveal p, .reveal ul) {
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
	}
</style>
