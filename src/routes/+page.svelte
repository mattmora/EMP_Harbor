<script>
	import { onMount, tick } from 'svelte';
	import { throttle } from 'throttle-debounce';
	import { pointsOnBezierCurves } from 'points-on-curve';
	import { curveToBezier } from 'points-on-curve/lib/curve-to-bezier.js';
	import DefaultPaths from '../lib/path-data';
	import { dist } from '../lib/utilities';

	const maps = [];
	const views = [];
	const ships = [];

	let hiResCanvas;
	let hiResContext;
	let backgroundCanvas;
	let backgroundContext;
	let pathCanvas;
	let pathContext;
	let shipCanvas;
	let shipContext;

	const input = {};
	const toggle = {};
	const zoomRate = 0.2;
	const moveSpeed = 400;
	const voyageDuration = 10;
	let alpha = 0.03;

	let focus = -1;

	const update = (delta) => {
		for (let i = 0; i < views.length; i++) {
			if (focus >= 0 && i != focus) continue;

			const view = views[i];
			const ship = ships[i];
			let { x, y, zoom } = view;

			const forward = input.e ?? 0;
			const back = input.q ?? 0;
			const z = forward - back;
			const zn = Math.pow(1 + z * zoomRate, delta);
			zoom *= zn;

			if (input.r) {
				ship.pathIndex = 0;
				ship.x = ship.path[0][0];
				ship.y = ship.path[0][1];
			}

			if (toggle.v && ship.pathIndex < ship.path.length - 1) {
				const speed = ship.pathLength / voyageDuration;
				let d = speed * delta;
				while (d > 0 && ship.pathIndex < ship.path.length - 1) {
					let p = ship.pathIndex;
					let nx = ship.path[p + 1][0];
					let ny = ship.path[p + 1][1];
					const dn = dist(ship.x, nx, ship.y, ny);
					if (dn > 0) ship.course = Math.atan2(ny - ship.y, nx - ship.x);
					if (dn == 0) {
						ship.pathIndex++;
						continue;
					}
					const move = Math.min(d, dn);
					const fx = Math.cos(ship.course);
					const fy = Math.sin(ship.course);
					ship.x += fx * move;
					ship.y += fy * move;
					d -= move;
				}
			}

			if (toggle.f) {
				const a = alpha;
				x = ship.x * a + x * (1 - a);
				y = ship.y * a + y * (1 - a);
			} else {
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
			}

			view.x = x;
			view.y = y;
			view.zoom = zoom;
		}

		// hueRotate += delta;
		input.r = false;
	};

	const render = () => {
		const hiResRatio = hiResCanvas.width / backgroundCanvas.width;

		shipContext.clearRect(0, 0, shipCanvas.width, shipCanvas.height);

		ships.forEach((ship) => {
			shipContext.beginPath();
			shipContext.fillStyle = ship.color;
			const fx = ship.x + Math.cos(ship.course) * 20;
			const fy = ship.y + Math.sin(ship.course) * 20;
			const rx = ship.x + Math.cos(ship.course + Math.PI / 1.5) * 20;
			const ry = ship.y + Math.sin(ship.course + Math.PI / 1.5) * 20;
			const lx = ship.x + Math.cos(ship.course - Math.PI / 1.5) * 20;
			const ly = ship.y + Math.sin(ship.course - Math.PI / 1.5) * 20;
			// console.log(`${fx} ${fy} ${rx} ${ry} ${lx} ${ly}`)
			shipContext.moveTo(fx, fy);
			shipContext.lineTo(rx, ry);
			shipContext.lineTo(ship.x, ship.y);
			shipContext.lineTo(lx, ly);
			shipContext.fill();
		});

		views.forEach(({ x, y, zoom, canvas, context, map }) => {
			const width = (map.canvas.width = canvas.width = canvas.offsetWidth);
			const height = (map.canvas.height = canvas.height = canvas.offsetHeight);

			zoom *= focus >= 0 ? Math.ceil(Math.sqrt(viewCount)) : 1;

			const useHiRes = zoom > 0.8;
			const sourceCanvas = useHiRes ? hiResCanvas : backgroundCanvas;
			const s = useHiRes ? hiResRatio : 1;
			const w = width / zoom;
			const h = height / zoom;

			const left = x - w * 0.5;
			const top = y - h * 0.5;

			if (showPaths) context.drawImage(pathCanvas, left, top, w, h, 0, 0, width, height);
			context.drawImage(shipCanvas, left, top, w, h, 0, 0, width, height);
			map.context.drawImage(sourceCanvas, left * s, top * s, w * s, h * s, 0, 0, width, height);
		});
	};

	let start, previous;
	const step = throttle(0, (timestamp) => {
		if (!start) start = timestamp;
		const delta = timestamp - previous;
		if (delta > 0) {
			update(delta / 1000);
			render();
		}
		previous = timestamp;
		requestAnimationFrame(step);
	});

	const onKeyDown = (e) => {
		input[e.key.toLowerCase()] = 1;
		toggle[e.key.toLowerCase()] = !toggle[e.key.toLowerCase()];
		let intKey = parseInt(e.key) - 1;
		if (intKey == focus || intKey >= viewCount) focus = -1;
		else focus = isNaN(intKey) ? focus : intKey;
		renderShipPaths();
	};

	const onKeyUp = (e) => {
		input[e.key.toLowerCase()] = 0;
	};

	let viewCount = 4;
	$: viewCountArray = [...Array(viewCount).keys()];
	$: div = focus >= 0 ? 1 : Math.ceil(Math.sqrt(viewCount));

	$: cellSize = 100 / div;
	$: sizeString = `${cellSize}% `;

	$: gridStyle = `
	grid-template-columns: ${sizeString.repeat(div)};
	grid-template-rows: ${sizeString.repeat(div)};`;

	let hueRotate = 180;
	let invert = 100;
	let saturation = 1;

	let mapStyles;
	$: {
		mapStyles = [];
		for (let i = 0; i < viewCount; i++) {
			mapStyles.push(
				`filter: hue-rotate(${
					hueRotate + i * (360 / viewCount) * 1
				}deg) invert(${invert}%) saturate(${saturation});`
			);
		}
	}

	onMount(async () => {
		const searchParams = {
			views: parseInt(new URLSearchParams(window.location.search).get('views')),
			follow: parseFloat(new URLSearchParams(window.location.search).get('follow'))
		};
		viewCount = isNaN(searchParams.views) ? viewCount : searchParams.views;
		viewCountArray = [...Array(viewCount).keys()];
		alpha = isNaN(searchParams.follow) ? alpha : searchParams.follow;

		await tick();

		// Offscreen canvases
		hiResCanvas = document.createElement('canvas');
		hiResContext = hiResCanvas.getContext('2d');

		backgroundCanvas = document.createElement('canvas');
		backgroundContext = backgroundCanvas.getContext('2d');

		pathCanvas = document.createElement('canvas');
		pathContext = pathCanvas.getContext('2d');

		shipCanvas = document.createElement('canvas');
		shipContext = shipCanvas.getContext('2d');

		// Rendering canvases
		for (let i = 0; i < viewCount; i++) {
			maps.push({});
			maps[i].canvas = document.getElementById(`map${i}`);
			maps[i].context = maps[i].canvas.getContext('2d');

			ships.push({
				points: DefaultPaths[i % DefaultPaths.length],
				path: [],
				pathIndex: 0,
				pathLength: 0,
				pathString: '',
				editing: -1,
				color: shipColors[i % shipColors.length]
			});
			updateShipPath(i, true);
			ships[i].x = ships[i].path[0] ? ships[i].path[0][0] : -1;
			ships[i].y = ships[i].path[0] ? ships[i].path[0][1] : -1;
			const nx = ships[i].path[1] ? ships[i].path[1][0] : ships[i].x;
			const ny = ships[i].path[1] ? ships[i].path[1][1] : ships[i].y;
			ships[i].course = Math.atan2(ny - ships[i].y, nx - ships[i].x);

			views.push({
				x: ships[i].x,
				y: ships[i].y,
				map: maps[i],
				ship: ships[i]
			});
			views[i].canvas = document.getElementById(`view${i}`);
			views[i].context = views[i].canvas.getContext('2d');
			views[i].zoom = (2 * shipCanvas.width) / views[i].canvas.width;

			views.forEach((view) => {
				const { canvas, map, zoom } = view;
				map.canvas.width = canvas.width = canvas.offsetWidth;
				map.canvas.height = canvas.height = canvas.offsetHeight;
				view.x = view.x < 0 ? (canvas.width / zoom) * 0.5 : view.x;
				view.y = view.y < 0 ? (canvas.height / zoom) * 0.5 : view.y;
			});
		}

		// On image load, set canvas sizes and render the background
		const image = new Image();
		image.src = '/harbor/chart-5000.png';
		image.onload = () => {
			backgroundCanvas.width = image.naturalWidth;
			backgroundCanvas.height = image.naturalHeight;

			pathCanvas.width = image.naturalWidth;
			pathCanvas.height = image.naturalHeight;

			shipCanvas.width = image.naturalWidth;
			shipCanvas.height = image.naturalHeight;

			backgroundContext.drawImage(image, 0, 0);

			maps.forEach(({ canvas, context }) => {
				const width = canvas.width;
				const height = canvas.height;
				context.drawImage(backgroundCanvas, 0, 0, width, height, 0, 0, width, height);
			});

			renderShipPaths();
		};

		const hiRes = new Image();
		hiRes.src = '/harbor/chart-10000.png';
		hiRes.onload = () => {
			hiResCanvas.width = hiRes.naturalWidth;
			hiResCanvas.height = hiRes.naturalHeight;

			hiResContext.drawImage(hiRes, 0, 0);
		};

		requestAnimationFrame(step);
	});

	const shipColors = ['#ff00d7', '#ff9900', '#c9ff00', '#0982ff'];
	const pointRange = 20;

	const renderShipPaths = () => {
		const canvas = pathCanvas;
		const context = pathContext;
		context.clearRect(0, 0, canvas.width, canvas.height);
		ships.forEach(({ points, path, color }) => {
			if (path.length > 0) {
				context.beginPath();
				context.lineWidth = 3;
				context.strokeStyle = color;
				context.setLineDash([12, 3]);
				let x = path[0][0];
				let y = path[0][1];
				context.moveTo(x, y);
				for (let i = 1; i < path.length; i++) {
					x = path[i][0];
					y = path[i][1];
					context.lineTo(x, y);
				}
				context.stroke();

				// Draw through points
				for (let i = 0; i < points.length; i++) {
					x = points[i][0];
					y = points[i][1];
					context.beginPath();
					if (!toggle.o || i == 0 || i == points.length - 1) {
						context.arc(x, y, pointRange, 0, 2 * Math.PI);
					}
					context.stroke();
				}
			}
		});
	};

	const updateShipPath = (i, updateString) => {
		const ship = ships[i];
		if (ship.points.length > 3) {
			const bezier = curveToBezier(ship.points);
			ship.path = pointsOnBezierCurves(bezier, 0.8, 1);
		} else {
			ship.path = ship.points;
		}
		ship.pathLength = 0;
		for (let p = 1; p < ship.path.length; p++) {
			ship.pathLength += dist(
				ship.path[p - 1][0],
				ship.path[p][0],
				ship.path[p - 1][1],
				ship.path[p][1]
			);
		}
		if (updateString) {
			ship.pathString = JSON.stringify(ship.points);
		}
	};

	const editPath = (e, i) => {
		if (!showPaths) return;
		const ship = ships[i];
		let { x, y, zoom, canvas } = views[i];
		zoom *= focus >= 0 ? Math.ceil(Math.sqrt(viewCount)) : 1;
		const px = x + (e.offsetX - canvas.width * 0.5) / zoom;
		const py = y + (e.offsetY - canvas.height * 0.5) / zoom;
		// console.log(`${e.offsetX} ${e.offsetY}`);
		// console.log(`${px} ${py}`);

		if (e.button == 0) {
			if (ship.editing >= 0) {
				let selectedAdjacent = -1;
				for (let p = 0; p < ship.points.length; p++) {
					if (Math.abs(p - ship.editing) != 1) continue;
					var d = dist(ship.points[p][0], px, ship.points[p][1], py);
					if (d < pointRange) {
						selectedAdjacent = p;
					}
				}
				if (selectedAdjacent < 0) {
					ship.points[ship.editing] = [px, py];
				} else {
					ship.points.splice(ship.editing, 1);
				}
				ship.editing = -1;
			} else {
				for (let p = 0; p < ship.points.length; p++) {
					var d = dist(ship.points[p][0], px, ship.points[p][1], py);
					if (d < pointRange) {
						ship.editing = p;
					}
				}
				if (ship.editing < 0) {
					ship.points.push([px, py]);
				}
			}
			updateShipPath(i, true);
			renderShipPaths();
		}
	};

	const editingPath = (e, i) => {
		if (!showPaths) return;
		const ship = ships[i];
		let { x, y, zoom, canvas } = views[i];
		zoom *= focus >= 0 ? Math.ceil(Math.sqrt(viewCount)) : 1;
		const px = x + (e.offsetX - canvas.width * 0.5) / zoom;
		const py = y + (e.offsetY - canvas.height * 0.5) / zoom;

		if (ship.editing >= 0) {
			ship.points[ship.editing] = [px, py];
			updateShipPath(i);
			renderShipPaths();
		}
	};

	$: showData = toggle.c;
	$: showPaths = !toggle.p;
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<div class="views" style={gridStyle}>
	{#each viewCountArray as _, i}
		<div id="viewport{i}" class="viewport" style={focus < 0 || focus == i ? '' : 'display: none'}>
			{#if showData}
				<pre>{ships[i].pathString}</pre>
			{/if}
			<canvas id="map{i}" class="map" style={mapStyles[i] + (showData ? 'height: 95%;' : '')} />
			<canvas
				id="view{i}"
				class="view"
				style={showData ? 'height: 95%;' : ''}
				on:mousedown={(e) => editPath(e, i)}
				on:mousemove={throttle(40, (e) => editingPath(e, i))}
			/>
		</div>
	{/each}
</div>

<style>
	.views {
		position: absolute;
		width: 100%;
		height: 100%;
		display: grid;
		cursor: crosshair;
	}

	.viewport {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	pre {
		background-color: white;
		padding: 20px;
		font-size: 20px;
		width: 100%;
		height: 5%;
		position: absolute;
		bottom: 0;
		z-index: 3;
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
