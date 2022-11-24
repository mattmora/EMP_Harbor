<script>
	import { onMount } from 'svelte';
	import { pointsOnBezierCurves } from 'points-on-curve';
	import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js';

	const maps = [];
	const views = [];
	const ships = [];

	let hiResCanvas;
	let hiResContext;
	let backgroundCanvas;
	let backgroundContext;
	let animationCanvas;
	let animationContext;

	const input = {};
	const zoomRate = 0.2;
	const moveSpeed = 200;

	const update = (delta) => {
		views.forEach((view) => {
			let { x, y, zoom } = view;

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
			x += n * h * moveSpeed * delta; //* (1 / zoom) ;
			y -= n * v * moveSpeed * delta; //* (1 / zoom) ;

			view.x = x;
			view.y = y;
			view.zoom = zoom;

			hueRotate += delta;
		});
	};

	const render = () => {
		const hiResRatio = hiResCanvas.width / backgroundCanvas.width;

		views.forEach(({ x, y, zoom, canvas, context, map }) => {
			const width = (map.canvas.width = canvas.width = canvas.offsetWidth);
			const height = (map.canvas.height = canvas.height = canvas.offsetHeight);

			const useHiRes = zoom > 0.8;
			const sourceCanvas = useHiRes ? hiResCanvas : backgroundCanvas;
			const s = useHiRes ? hiResRatio : 1;
			const w = width / zoom;
			const h = height / zoom;

			const left = x - w * 0.5;
			const top = y - h * 0.5;

			context.drawImage(animationCanvas, left, top, w, h, 0, 0, width, height);
			map.context.drawImage(sourceCanvas, left * s, top * s, w * s, h * s, 0, 0, width, height);
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

	const viewCount = 4;
	const div = Math.ceil(Math.sqrt(viewCount));

	const cellSize = 100 / div;
	const sizeString = `${cellSize}% `;

	$: gridStyle = `
	grid-template-columns: ${sizeString.repeat(div)};
	grid-template-rows: ${sizeString.repeat(div)};`;

	let hueRotate = 180;
	let invert = 100;
	let saturation = 1;

	const mapStyles = [];
	for (let i = 0; i < viewCount; i++) {
		mapStyles.push(
			`filter: hue-rotate(${hueRotate}deg) invert(${invert}%) saturate(${saturation});`
		);
	}
	$: {
		for (let i = 0; i < viewCount; i++) {
			mapStyles[
				i
			] = `filter: hue-rotate(${hueRotate}deg) invert(${invert}%) saturate(${saturation});`;
		}
	}

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

			ships.push({
				points: [],
				path: [],
				color: shipColors[i]
			});

			views.push({
				x: 0,
				y: 0,
				zoom: 1,
				map: maps[i],
				ship: ships[i]
			});
			views[i].canvas = document.getElementById(`view${i}`);
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
	});

	const shipColors = ['#ff00d7', '#c9ff00', '#ff9900', '#0982ff'];

	const updateShipPaths = () => {
		const canvas = animationCanvas;
		const context = animationContext;
		context.clearRect(0, 0, canvas.width, canvas.height);
		ships.forEach(({ path, color }) => {
			if (path.length > 0) {
				context.beginPath();
				context.lineWidth = 3;
				context.strokeStyle = color;
				context.setLineDash([10, 2]);
				context.moveTo(path[0][0], path[0][1]);
				for (let i = 1; i < path.length; i++) {
					context.lineTo(path[i][0], path[i][1]);
				}
				context.stroke();
			}
		});
	};

	const addPointToCurve = (e, i) => {
		const { x, y, zoom, canvas } = views[i];
		const px = x + (e.offsetX - canvas.width * 0.5) / zoom;
		const py = y + (e.offsetY - canvas.height * 0.5) / zoom;

		console.log(`${e.offsetX} ${e.offsetY}`);
		console.log(`${px} ${py}`);

		const ship = ships[i];
		ship.points.push([px, py]);
		if (ship.points.length > 2) {
			const bezier = curveToBezier(ship.points);
			ship.path = pointsOnBezierCurves(bezier, 0.8);
		}

		updateShipPaths();
	};
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup|preventDefault={onKeyUp} />

<div class="views" style={gridStyle}>
	{#each [...Array(viewCount).keys()] as _, i}
		<div id="viewport{i}" class="viewport" on:mousedown={(e) => addPointToCurve(e, i)}>
			<canvas id="map{i}" class="map" style={mapStyles[i]} />
			<canvas id="view{i}" class="view" />
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

	.view {
		width: 100%;
		height: 100%;
		position: absolute;
		transform-origin: top left;
		z-index: 2;
	}
</style>
