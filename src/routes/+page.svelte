<script>
	import { onMount } from 'svelte';
	// import * as JoyCon from 'ns-joycon';

	let innerWidth = 0;
	let innerHeight = 0;

	let x = 0;
	let y = 0;

	const input = {};
	let zoom = 1000;
	const zoomRate = 0.2;
	const moveSpeed = 500;

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
		x -= n * h * moveSpeed * (1000 / zoom) * delta + zx;
		y += n * v * moveSpeed * (1000 / zoom) * delta - zy;
	};

	let start, previous;
	const step = (timestamp) => {
		if (!start) start = timestamp;
		const delta = timestamp - previous;
		if (delta > 0) update(delta / 1000);
		previous = timestamp;
		requestAnimationFrame(step);
	};
	onMount(() => {
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
		// });
	});

	const onKeyDown = (e) => {
		input[e.key.toLowerCase()] = 1;
	};

	const onKeyUp = (e) => {
		input[e.key.toLowerCase()] = 0;
	};

    const hueRotate = 0;
    const invert = 0;

	$: mapStyle = `width: ${zoom}%;
    height: ${zoom}%;
    background-position: ${x}px ${y}px; 
    filter: hue-rotate(${hueRotate}deg) invert(${invert}%);`;
</script>

<svelte:window
	bind:innerWidth
	bind:innerHeight
	on:keydown|preventDefault={onKeyDown}
	on:keyup|preventDefault={onKeyUp}
/>

<div class="viewport">
	<div class="map" style={mapStyle} />
	<div class="ship">0</div>
</div>

<style>
	.viewport {
		position: absolute;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.map {
		background: white url(./chart.png) no-repeat;
		background-size: cover;
	}

	.ship {
		color: magenta;
		position: absolute;
		width: fit-content;
		margin: 0;
		top: 50%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
</style>
