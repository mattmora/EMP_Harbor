<script>
	import { onMount } from 'svelte';
	// import * as JoyCon from 'ns-joycon';

	const maps = [];
	const views = [];

	let hiResCanvas;
	let hiResContext;
	let backgroundCanvas;
	let backgroundContext;
	let animationCanvas;
	let animationContext;

	const input = {};
	const zoomRate = 0.2;
	const moveSpeed = 50;

	const update = (delta) => {
		views.forEach((player) => {
			let { x, y, zoom } = player;

			const forward = input.e ?? 0;
			const back = input.q ?? 0;
			const z = forward - back;
			const zn = Math.pow(1 + z * zoomRate, delta);
			zoom *= zn;

			const left = input.a ?? 0;
			const right = input.d ?? 0;
			const down = input.s ?? 0;
			const up = input.w ?? 0;
			const h = right - left;
			const v = up - down;
			const mag = Math.sqrt(h * h + v * v);
			const n = mag > 0 ? 1 / mag : 0;
			x += n * h * moveSpeed * (1 / zoom) * delta;
			y -= n * v * moveSpeed * (1 / zoom) * delta;

			player.x = x;
			player.y = y;
			player.zoom = zoom;
		});
	};

	const render = () => {
		const hiResRatio = hiResCanvas.width / backgroundCanvas.width;

		views.forEach(({ x, y, zoom, canvas, context, map }) => {
			const width = (map.canvas.width = canvas.width = canvas.offsetWidth);
			const height = (map.canvas.height = canvas.height = canvas.offsetHeight);

			context.drawImage(animationCanvas, x, y, width / zoom, height / zoom, 0, 0, width, height);

			const useHiRes = zoom > 0.8;
			const scalar = useHiRes ? hiResRatio : 1;
			const sourceCanvas = useHiRes ? hiResCanvas : backgroundCanvas;
			const sx = x * scalar;
			const sy = y * scalar;
			const sw = (width * scalar) / zoom;
			const sh = (height * scalar) / zoom;

			map.context.drawImage(
				sourceCanvas,
				sx - sw * 0.5,
				sy - sh * 0.5,
				sw,
				sh,
				0,
				0,
				width,
				height
			);
		});
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
	const invert = 100;
	const saturation = 1;

	$: mapStyle = `
    filter: hue-rotate(${hueRotate}deg) invert(${invert}%) saturate(${saturation});`;

	const viewCount = 4;
	const div = Math.ceil(Math.sqrt(viewCount));

	const cellSize = 100 / div;
	const sizeString = `${cellSize}% `;

	$: gridStyle = `
	grid-template-columns: ${sizeString.repeat(div)};
	grid-template-rows: ${sizeString.repeat(div)};`;

	onMount(() => {
		// Offscreen canvases
		hiResCanvas = document.createElement('canvas');
		hiResContext = hiResCanvas.getContext('2d');

		backgroundCanvas = document.createElement('canvas');
		backgroundContext = backgroundCanvas.getContext('2d');

		animationCanvas = document.createElement('canvas');
		animationContext = animationCanvas.getContext('2d');

		// Rendering canvases
		for (let i = 0; i < viewCount; i++) {
			maps.push({});
			maps[i].canvas = document.getElementById(`map${i}`);
			maps[i].context = maps[i].canvas.getContext('2d');

			views.push({
				x: 0,
				y: 0,
				zoom: 1,
				map: maps[i]
			});
			views[i].canvas = document.getElementById(`player${i}`);
			views[i].context = views[i].canvas.getContext('2d');

			views.forEach(({ canvas, map }) => {
				map.canvas.width = canvas.width = canvas.offsetWidth;
				map.canvas.height = canvas.height = canvas.offsetHeight;
			});
		}

		// On image load, set canvas sizes and render the background
		const image = new Image();
		image.src = 'chart-5000.png';
		image.onload = () => {
			backgroundCanvas.width = image.naturalWidth;
			backgroundCanvas.height = image.naturalHeight;

			animationCanvas.width = image.naturalWidth;
			animationCanvas.height = image.naturalHeight;

			backgroundContext.drawImage(image, 0, 0);

			maps.forEach(({ canvas: c, context: ctx }) => {
				ctx.drawImage(backgroundCanvas, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
			});
		};

		const hiRes = new Image();
		hiRes.src = 'chart-10000.png';
		hiRes.onload = () => {
			hiResCanvas.width = hiRes.naturalWidth;
			hiResCanvas.height = hiRes.naturalHeight;

			hiResContext.drawImage(hiRes, 0, 0);
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

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup|preventDefault={onKeyUp} />

<div class="views" style={gridStyle}>
	{#each [...Array(viewCount).keys()] as _, i}
		<div id="viewport{i}" class="viewport">
			<canvas id="map{i}" class="map" style={mapStyle} />
			<canvas id="player{i}" class="player" />
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
		width: 100%;
		height: 100%;
		position: absolute;
		transform-origin: top left;
		z-index: 1;
	}

	.player {
		width: 100%;
		height: 100%;
		position: absolute;
		transform-origin: top left;
		z-index: 2;
	}
</style>
