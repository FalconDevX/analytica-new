// Generates components/sections/projects/krakowMapData.ts from public/geojson/*.geojson.
// Projects lon/lat to SVG units once, simplifies outlines, and emits ready-to-render paths,
// so the GeoSearch demo needs no tile server, no Leaflet and no runtime fetches.
// Run: node scripts/build-krakow-map.mjs
import fs from "node:fs"
import path from "node:path"

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..")
const SRC = path.join(ROOT, "public", "geojson")
const OUT = path.join(ROOT, "components", "sections", "projects", "krakowMapData.ts")

const WIDTH = 1000
const DISTRICT_TOLERANCE = 0.35 // SVG units (~10 m)
const HOT_DISTRICT = "zwierzyniec"

const DISTRICTS = {
	stare_miasto: "Stare Miasto",
	grzegorzki: "Grzegórzki",
	pradnik_czerwony: "Prądnik Czerwony",
	"prądnik_biały": "Prądnik Biały",
	krowodrza: "Krowodrza",
	bronowice: "Bronowice",
	zwierzyniec: "Zwierzyniec",
	debniki: "Dębniki",
	lagiewniki_borek_falecki: "Łagiewniki",
	swoszowice: "Swoszowice",
	podgorze_duchackie: "Podgórze Duchackie",
	biezanow_prokocim: "Bieżanów-Prokocim",
	podgorze: "Podgórze",
	czyzyny: "Czyżyny",
	mistrzejowice: "Mistrzejowice",
	bienczyce: "Bieńczyce",
	wzgorza_krzeszlawickie: "Wzgórza Krzesławickie",
	nowa_huta: "Nowa Huta"
}
const PARCELS = ["plot1", "plot2"]

const read = (name) => {
	const json = JSON.parse(fs.readFileSync(path.join(SRC, `${name}.geojson`), "utf8"))
	return json.type === "FeatureCollection" ? json.features[0] : json
}

// Polygons as arrays of rings ([lon, lat][])
function polygonsOf(feature) {
	const g = feature.geometry
	if (g.type === "MultiPolygon") return g.coordinates
	if (g.type === "Polygon") return [g.coordinates]
	if (g.type === "LineString") return [[g.coordinates]]
	throw new Error(`Unsupported geometry ${g.type}`)
}

const districtFeatures = Object.keys(DISTRICTS).map((id) => ({ id, feature: read(id) }))
const parcelFeatures = PARCELS.map((id) => ({ id, feature: read(id) }))

let minLon = Infinity, maxLon = -Infinity, minLat = Infinity, maxLat = -Infinity
for (const { feature } of districtFeatures)
	for (const poly of polygonsOf(feature))
		for (const ring of poly)
			for (const [lon, lat] of ring) {
				minLon = Math.min(minLon, lon); maxLon = Math.max(maxLon, lon)
				minLat = Math.min(minLat, lat); maxLat = Math.max(maxLat, lat)
			}

// Local equirectangular projection — accurate enough at city scale.
const kx = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180)
const scale = WIDTH / ((maxLon - minLon) * kx)
const HEIGHT = Math.round((maxLat - minLat) * scale)
const project = ([lon, lat]) => [(lon - minLon) * kx * scale, (maxLat - lat) * scale]

function simplify(points, tolerance) {
	if (points.length <= 4 || tolerance <= 0) return points
	const sqTol = tolerance * tolerance
	const keep = new Uint8Array(points.length)
	keep[0] = keep[points.length - 1] = 1
	const stack = [[0, points.length - 1]]
	while (stack.length) {
		const [a, b] = stack.pop()
		let maxD = 0, idx = -1
		const [ax, ay] = points[a], [bx, by] = points[b]
		const dx = bx - ax, dy = by - ay, len = dx * dx + dy * dy
		for (let i = a + 1; i < b; i++) {
			const [px, py] = points[i]
			let t = len ? ((px - ax) * dx + (py - ay) * dy) / len : 0
			t = Math.max(0, Math.min(1, t))
			const ex = ax + t * dx - px, ey = ay + t * dy - py
			const d = ex * ex + ey * ey
			if (d > maxD) { maxD = d; idx = i }
		}
		if (maxD > sqTol) { keep[idx] = 1; stack.push([a, idx], [idx, b]) }
	}
	return points.filter((_, i) => keep[i])
}

const r = (v) => Math.round(v * 100) / 100

function toPath(feature, tolerance) {
	let d = ""
	let best = { area: -1, cx: 0, cy: 0 }
	const box = [Infinity, Infinity, -Infinity, -Infinity]
	for (const poly of polygonsOf(feature)) {
		for (const ring of poly) {
			const pts = simplify(ring.map(project), tolerance)
			if (pts.length < 3) continue
			d += "M" + pts.map(([x, y]) => `${r(x)} ${r(y)}`).join("L") + "Z"
			let area = 0, cx = 0, cy = 0
			for (let i = 0; i < pts.length; i++) {
				const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]
				const c = x1 * y2 - x2 * y1
				area += c; cx += (x1 + x2) * c; cy += (y1 + y2) * c
				box[0] = Math.min(box[0], x1); box[1] = Math.min(box[1], y1)
				box[2] = Math.max(box[2], x1); box[3] = Math.max(box[3], y1)
			}
			if (Math.abs(area) > best.area) best = { area: Math.abs(area), cx: cx / (3 * area), cy: cy / (3 * area) }
		}
	}
	return { d, label: [r(best.cx), r(best.cy)], box: box.map(r) }
}

const districts = districtFeatures.map(({ id, feature }) => {
	const { d, label, box } = toPath(feature, DISTRICT_TOLERANCE)
	return { id, name: DISTRICTS[id], d, label, box }
})
const parcels = parcelFeatures.map(({ id, feature }) => {
	const { d, label, box } = toPath(feature, 0)
	return { id, d, center: label, box }
})
const parcelBox = parcels.reduce(
	(b, p) => [Math.min(b[0], p.box[0]), Math.min(b[1], p.box[1]), Math.max(b[2], p.box[2]), Math.max(b[3], p.box[3])],
	[Infinity, Infinity, -Infinity, -Infinity]
)

const out = `// Generated by scripts/build-krakow-map.mjs from public/geojson — do not edit by hand.
// Coordinates are SVG units in a ${WIDTH}×${HEIGHT} space; boxes are [minX, minY, maxX, maxY].

export const MAP_WIDTH = ${WIDTH}
export const MAP_HEIGHT = ${HEIGHT}
export const HOT_DISTRICT = ${JSON.stringify(HOT_DISTRICT)}

export type MapBox = [number, number, number, number]

export const DISTRICTS: { id: string; name: string; d: string; label: [number, number]; box: MapBox }[] = ${JSON.stringify(districts)}

export const PARCELS: { id: string; d: string; center: [number, number]; box: MapBox }[] = ${JSON.stringify(parcels)}

export const PARCEL_BOX: MapBox = ${JSON.stringify(parcelBox)}
`
fs.writeFileSync(OUT, out)
console.log(`wrote ${path.relative(ROOT, OUT)} (${(out.length / 1024).toFixed(1)} KB), ${WIDTH}x${HEIGHT}`)
