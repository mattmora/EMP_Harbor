<script>
	import { onMount } from 'svelte';
	// import * as JoyCon from 'ns-joycon';

	const maps = [];
	const mapContexts = [];
	const players = [];
	const playerContexts = [];

	const viewports = [];

	let backgroundCanvas;
	let animationCanvas;
	let backgroundContext;
	let animationContext;

	let innerWidth = 0;
	let innerHeight = 0;

	let x = 0;
	let y = 0;
	let xFollow = x;
	let yFollow = y;

	const input = {};
	let zoom = 2;
	const zoomRate = 0.2;
	const moveSpeed = 1000;

	const update = (delta) => {
		const forward = input.e ?? 0;
		const back = input.q ?? 0;
		const z = forward - back;
		const zd = Math.pow(1 + z * zoomRate, delta);
		zoom *= zd;
		const zx = (-x + innerWidth * 0.5) * zd * (zd - 1);
		const zy = (-y + innerHeight * 0.5) * zd * (zd - 1);
		const left = input.a ?? 0;
		const right = input.d ?? 0;
		const down = input.s ?? 0;
		const up = input.w ?? 0;
		const h = right - left;
		const v = up - down;
		const mag = Math.sqrt(h * h + v * v);
		const n = mag > 0 ? 1 / mag : 0;
		x -= n * h * moveSpeed * (1 / zoom) * delta + zx;
		y += n * v * moveSpeed * (1 / zoom) * delta - zy;
	};

	const render = () => {
		mapContexts.forEach((c) => c.drawImage(backgroundCanvas, 0, 0));
		playerContexts.forEach((c) => c.drawImage(animationCanvas, 0, 0));
	};

	let start, previous;
	const step = (timestamp) => {
		if (!start) start = timestamp;
		const delta = timestamp - previous;
		if (delta > 0) {
			update(delta / 1000);
			render();
		}
		previous = timestamp;
		requestAnimationFrame(step);
	};

	const onKeyDown = (e) => {
		input[e.key.toLowerCase()] = 1;
	};

	const onKeyUp = (e) => {
		input[e.key.toLowerCase()] = 0;
	};

	const hueRotate = 180;
	const invert = 180;

	const viewCount = 4;
	const div = Math.ceil(Math.sqrt(viewCount));

	$: mapStyle = `
	top: ${y}px;
	left: ${x}px;
	transform: scale(${zoom});
    filter: hue-rotate(${hueRotate}deg) invert(${invert}%);`;

	const cellSize = 100 / div;
	const sizeString = `${cellSize}% `;

	$: gridStyle = `
	grid-template-columns: ${sizeString.repeat(div)};
	grid-template-rows: ${sizeString.repeat(div)};`;

	onMount(() => {
		// Offscreen canvases
		backgroundCanvas = document.createElement('canvas');
		animationCanvas = document.createElement('canvas');
		backgroundContext = backgroundCanvas.getContext('2d');
		animationContext = backgroundCanvas.getContext('2d');

		// Rendering canvases
		for (let i = 0; i < viewCount; i++) {
			viewports.push(document.getElementById(`viewport${i}`));
			maps.push(document.getElementById(`map${i}`));
			mapContexts.push(maps[i].getContext('2d'));
			players.push(document.getElementById(`player${i}`));
			playerContexts.push(players[i].getContext('2d'));
		}

		// On image load, set canvas sizes and render the background
		const image = new Image();
		image.src = 'chart-5000.png';
		image.onload = () => {
			backgroundCanvas.width = image.naturalWidth;
			backgroundCanvas.height = image.naturalHeight;

			animationCanvas.width = image.naturalWidth;
			animationCanvas.height = image.naturalHeight;

			maps.forEach((c) => {
				c.width = image.naturalWidth;
				c.height = image.naturalHeight;
			});

			players.forEach((c) => {
				c.width = image.naturalWidth;
				c.height = image.naturalHeight;
			});

			backgroundContext.drawImage(image, 0, 0);
			mapContexts.forEach((c) => c.drawImage(backgroundCanvas, 0, 0));
		};

		requestAnimationFrame(step);

		// JoyCon.findControllers((devices) => {
		// 	// When found any device.
		// 	devices.forEach(async (device) => {
		// 		console.log(`Found a device (${device.meta.serialNumber})`);
		// 		// Add a handler for new device.
		// 		device.manageHandler('add', (packet) => {
		// 			console.log(device.meta.product, packet);
		// 		});
		// 		await device.enableIMU();
		// 	});
		// });a
	});
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	on:keydown|preventDefault={onKeyDown}
	on:keyup|preventDefault={onKeyUp}
/>

<div class="views" style={gridStyle}>
	{#each [...Array(viewCount).keys()] as _, i}
		<div id="viewport{i}" class="viewport">
			<canvas id="map{i}" class="map" style={mapStyle} />
			<canvas id="player{i}" class="player" style={mapStyle} />
		</div>
	{/each}
</div>

<style>
	.views {
		position: absolute;
		width: 100%;
		height: 100%;
		display: grid;
	}

	.viewport {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.map {
		position: relative;
		transform-origin: top left;
		z-index: 1;
	}

	.player {
		position: relative;
		transform-origin: top left;
		z-index: 2;
	}
</style>
