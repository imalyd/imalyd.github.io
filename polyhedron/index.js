const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const canvasSize = 300;

var angle = 0;
var sinAngle;
var cosAngle;
const rotateAngle = 0.01;
const fullAngle = 2 * Math.PI;
const rotateInterval = 100;

const icosahedronVertexCount = 12;
const icosahedronEdgePointCount = 20;
//const icosahedronEdgePointCount = 2;
const icosahedronM = Math.sqrt(0.5 - Math.sqrt(0.05));
const icosahedronN = Math.sqrt(0.5 + Math.sqrt(0.05));
const icosahedronLen = 2 * icosahedronM + 0.00000001;

var vertexArray = [];
var edgeArray = [];

function sqr(a) {
	return a * a;
}

function dist(a, b) {
	return Math.sqrt(sqr(a[0] - b[0]) + sqr(a[1] - b[1]) + sqr(a[2] - b[2]));
}

function normalize(a) {
	let mul = 1.0 / Math.sqrt(sqr(a[0]) + sqr(a[1]) + sqr(a[2]));
	return [a[0] * mul, a[1] * mul, a[2] * mul];
}

function interpolation(a, b, r) {
	return a + r * (b - a);
}

function interpolationVector(a, b, c) {
	let r = c / icosahedronEdgePointCount;
	return [interpolation(a[0], b[0], r), interpolation(a[1], b[1], r), interpolation(a[2], b[2], r)];
}

function fourthVector(a, b, c) {
	return [b[0] + c[0] - a[0], b[1] + c[1] - a[1], b[2] + c[2] - a[2]];
}

function build() {
	let vertexCount = icosahedronVertexCount;
	let icosahedronVertex = [
		[icosahedronM, 0, icosahedronN],
		[icosahedronM, 0, -icosahedronN],
		[-icosahedronM, 0, icosahedronN],
		[-icosahedronM, 0, -icosahedronN],
		[0, icosahedronN, icosahedronM],
		[0, icosahedronN, -icosahedronM],
		[0, -icosahedronN, icosahedronM],
		[0, -icosahedronN, -icosahedronM],
		[icosahedronN, icosahedronM, 0],
		[icosahedronN, -icosahedronM, 0],
		[-icosahedronN, icosahedronM, 0],
		[-icosahedronN, -icosahedronM, 0]
	];
	for (let i = 0; i < icosahedronVertexCount; ++i)
		vertexArray.push(icosahedronVertex[i]);

	let icosahedronEdge = new Array(icosahedronVertexCount);
	for (let i = 0; i < icosahedronVertexCount; ++i)
		icosahedronEdge[i] = new Array(icosahedronVertexCount);

	let icosahedronEdgePoints = new Array(icosahedronVertexCount);
	for (let i = 0; i < icosahedronVertexCount; ++i) {
		icosahedronEdgePoints[i] = new Array(icosahedronVertexCount);
		for (let j = i + 1; j < icosahedronVertexCount; ++j)
			icosahedronEdgePoints[i][j] = new Array(icosahedronEdgePointCount);
	}

	for (let i = 0; i < icosahedronVertexCount; ++i) {
		let vi = icosahedronVertex[i];
		for (let j = i + 1; j < icosahedronVertexCount; ++j) {
			let vj = icosahedronVertex[j];
			if (dist(vi, vj) < icosahedronLen) {
				icosahedronEdge[i][j] = 1;
				let last = i;
				for (let c = 1; c < icosahedronEdgePointCount; ++c) {
					let pnt = interpolationVector(vi, vj, c);
					icosahedronEdgePoints[i][j][c] = {
						point: pnt,
						id: vertexCount
					};
					vertexArray.push(pnt);
					edgeArray.push([last, vertexCount]);
					last = vertexCount;
					++vertexCount;
				}
				edgeArray.push([last, j]);
			}
		}
	}

	for (let i = 0; i < icosahedronVertexCount; ++i) {
		let vi = icosahedronVertex[i];
		for (let j = i + 1; j < icosahedronVertexCount; ++j)if (icosahedronEdge[i][j]) {
			let vj = icosahedronVertex[j];
			for (let k = j + 1; k < icosahedronVertexCount; ++k)if (icosahedronEdge[i][k] && icosahedronEdge[j][k]) {
				let vk = icosahedronVertex[k];

				let e1 = icosahedronEdgePoints[i][j];
				let e2 = icosahedronEdgePoints[i][k];
				let e3 = icosahedronEdgePoints[j][k];

				let icosahedronFacePoints = new Array(icosahedronEdgePointCount + 1);
				for (let c = 0; c <= icosahedronEdgePointCount; ++c)
					icosahedronFacePoints[c] = new Array(icosahedronEdgePointCount + 1);

				for (let c = 1; c < icosahedronEdgePointCount; ++c)
					icosahedronFacePoints[c][0] = e1[c].id;
				for (let c = 1; c < icosahedronEdgePointCount; ++c)
					icosahedronFacePoints[c][c] = e2[c].id;
				for (let c = 1; c < icosahedronEdgePointCount; ++c)
					icosahedronFacePoints[icosahedronEdgePointCount][c] = e3[c].id;

				for (let c = 2; c < icosahedronEdgePointCount; ++c)
					for (let d = 1; d < c; ++d) {
						let pnt = fourthVector(vj, e1[c].point, e3[d].point);
						vertexArray.push(pnt);
						icosahedronFacePoints[c][d] = vertexCount++;
					}

				for (let c = 1; c < icosahedronEdgePointCount; ++c)
					for (let d = 1; d <= c; ++d) {
						edgeArray.push([icosahedronFacePoints[c][d], icosahedronFacePoints[c][d - 1]]);
						edgeArray.push([icosahedronFacePoints[c][d], icosahedronFacePoints[c + 1][d]]);
						edgeArray.push([icosahedronFacePoints[c][d - 1], icosahedronFacePoints[c + 1][d]]);
					}
			}
		}
	}

	vertexArray.forEach(function (v) {
		let u = normalize(v);
		v[0] = u[0];
		v[1] = u[1];
		v[2] = u[2];
	});
}

function depth(a) {
	return a[0] * sinAngle - a[2] * cosAngle;
}

function map(a) {
	if (depth(a) < 0)
		return undefined;
	let x = a[0] * cosAngle + a[2] * sinAngle;
	let y = a[1];
	return [0.5 * (1 + x) * canvasSize, 0.5 * (1 + y) * canvasSize];
}

function draw() {
	angle += rotateAngle;
	while (angle >= fullAngle)
		angle -= fullAngle;
	sinAngle = Math.sin(angle);
	cosAngle = Math.cos(angle);

	let mappedVertexArray = [];
	vertexArray.forEach(function (v) {
		mappedVertexArray.push(map(v));
	})

	ctx.clearRect(0, 0, canvasSize, canvasSize);

	edgeArray.forEach(function (e) {
		let P1 = mappedVertexArray[e[0]];
		let P2 = mappedVertexArray[e[1]];
		if (P1 && P2) {
			ctx.beginPath();
			ctx.moveTo(P1[0], P1[1]);
			ctx.lineTo(P2[0], P2[1]);
			ctx.stroke();
		}
	})
}

build();
console.log(JSON.stringify({
	vertex: vertexArray,
	edge: edgeArray
}));
setInterval(draw, rotateInterval);