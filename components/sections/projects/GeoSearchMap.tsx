"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet"
import type { Feature, FeatureCollection, GeoJsonObject, LineString, Polygon, Position } from "geojson"
import L from "leaflet"
import { useTheme } from "next-themes"
import "leaflet/dist/leaflet.css"

const DISTRICT_FILES = [
	"stare_miasto",
	"grzegorzki",
	"pradnik_czerwony",
	"prądnik_biały",
	"krowodrza",
	"bronowice",
	"zwierzyniec",
	"debniki",
	"lagiewniki_borek_falecki",
	"swoszowice",
	"podgorze_duchackie",
	"biezanow_prokocim",
	"podgorze",
	"czyzyny",
	"mistrzejowice",
	"bienczyce",
	"wzgorza_krzeszlawickie",
	"nowa_huta"
]

const PARCEL_FILES = ["plot1", "plot2"]

const HOT_DISTRICT = "zwierzyniec"
const KRAKOW_CENTER: [number, number] = [50.061, 19.937]
const OVERVIEW_ZOOM = 10.4

export type MapPhase = "overview" | "searching" | "district" | "parcel"

type DistrictData = { name: string; data: Feature }

function closeRing(coords: Position[]): Position[] {
	if (!coords.length) return coords
	const first = coords[0]
	const last = coords[coords.length - 1]
	if (first[0] === last[0] && first[1] === last[1]) return coords
	return [...coords, first]
}

function toPolygon(raw: Feature | FeatureCollection): Feature<Polygon> | null {
	const feature = raw.type === "FeatureCollection" ? raw.features[0] : raw
	if (!feature) return null
	const geom = feature.geometry
	if (geom.type === "Polygon") {
		return feature as Feature<Polygon>
	}
	if (geom.type === "LineString") {
		const ring = closeRing((geom as LineString).coordinates)
		return {
			type: "Feature",
			properties: feature.properties ?? {},
			geometry: { type: "Polygon", coordinates: [ring] }
		}
	}
	return null
}

type FlyProps = {
	districtBounds: L.LatLngBounds | null
	parcelBounds: L.LatLngBounds | null
	phase: MapPhase
}

function FlyController({ districtBounds, parcelBounds, phase }: FlyProps) {
	const map = useMap()
	const firstRun = useRef(true)

	useEffect(() => {
		if (firstRun.current) {
			firstRun.current = false
			return
		}
		if (phase === "parcel" && parcelBounds) {
			map.flyToBounds(parcelBounds, {
				paddingTopLeft: [30, 60],
				paddingBottomRight: [220, 60],
				duration: 1.6,
				easeLinearity: 0.25,
				maxZoom: 18
			})
		} else if (phase === "district" && districtBounds) {
			map.flyToBounds(districtBounds, {
				padding: [32, 32],
				duration: 1.4,
				easeLinearity: 0.25
			})
		} else {
			map.flyTo(KRAKOW_CENTER, OVERVIEW_ZOOM, {
				duration: 1.2,
				easeLinearity: 0.3
			})
		}
	}, [phase, districtBounds, parcelBounds, map])

	return null
}

type Props = {
	phase: MapPhase
}

export default function GeoSearchMap({ phase }: Props) {
	const [districts, setDistricts] = useState<DistrictData[]>([])
	const [parcels, setParcels] = useState<Feature<Polygon>[]>([])
	const [districtBounds, setDistrictBounds] = useState<L.LatLngBounds | null>(null)
	const { resolvedTheme } = useTheme()
	const isDark = resolvedTheme === "dark"

	const palette = isDark
		? {
				bg: "#07080b",
				tileBase: "dark_nolabels",
				tileLabels: "dark_only_labels",
				labelOpacity: 0.6,
				districtFill: "#3f3f46",
				districtStroke: "#52525b",
				districtFillOpacity: 0.28,
				activeStroke: "#fcd34d",
				parcelStroke: "#fde68a"
			}
		: {
				bg: "#f5f6f8",
				tileBase: "light_nolabels",
				tileLabels: "light_only_labels",
				labelOpacity: 0.75,
				districtFill: "#94a3b8",
				districtStroke: "#64748b",
				districtFillOpacity: 0.18,
				activeStroke: "#b45309",
				parcelStroke: "#b45309"
			}

	const parcelBounds = useMemo(() => {
		if (!parcels.length) return null
		const layer = L.geoJSON({
			type: "FeatureCollection",
			features: parcels
		} as GeoJsonObject)
		return layer.getBounds()
	}, [parcels])

	useEffect(() => {
		let cancelled = false
		;(async () => {
			const [loadedDistricts, loadedParcels] = await Promise.all([
				Promise.all(
					DISTRICT_FILES.map(async (name) => {
						try {
							const res = await fetch(`/geojson/${encodeURIComponent(name)}.geojson`)
							if (!res.ok) return null
							const data = (await res.json()) as Feature
							return { name, data }
						} catch {
							return null
						}
					})
				),
				Promise.all(
					PARCEL_FILES.map(async (name) => {
						try {
							const res = await fetch(`/geojson/${name}.geojson`)
							if (!res.ok) return null
							const raw = (await res.json()) as Feature | FeatureCollection
							return toPolygon(raw)
						} catch {
							return null
						}
					})
				)
			])

			if (cancelled) return

			const validDistricts = loadedDistricts.filter((v): v is DistrictData => v !== null)
			setDistricts(validDistricts)
			const hot = validDistricts.find((d) => d.name === HOT_DISTRICT)
			if (hot) {
				const layer = L.geoJSON(hot.data as GeoJsonObject)
				setDistrictBounds(layer.getBounds())
			}

			const validParcels = loadedParcels.filter((v): v is Feature<Polygon> => v !== null)
			setParcels(validParcels)
		})()
		return () => {
			cancelled = true
		}
	}, [])

	const districtHighlighted = phase === "district" || phase === "parcel"
	const scanning = phase === "searching"
	const showParcels = phase === "parcel"

	return (
		<MapContainer
			center={KRAKOW_CENTER}
			zoom={OVERVIEW_ZOOM}
			zoomControl={false}
			attributionControl={false}
			dragging={false}
			scrollWheelZoom={false}
			doubleClickZoom={false}
			touchZoom={false}
			boxZoom={false}
			keyboard={false}
			zoomSnap={0.25}
			className="absolute inset-0 h-full w-full"
			style={{ background: palette.bg }}
		>
			<TileLayer
				key={palette.tileBase}
				url={`https://{s}.basemaps.cartocdn.com/${palette.tileBase}/{z}/{x}/{y}{r}.png`}
				subdomains={["a", "b", "c", "d"]}
			/>
			<TileLayer
				key={palette.tileLabels}
				url={`https://{s}.basemaps.cartocdn.com/${palette.tileLabels}/{z}/{x}/{y}{r}.png`}
				subdomains={["a", "b", "c", "d"]}
				opacity={palette.labelOpacity}
			/>

			{districts.map((d) => {
				const isHot = d.name === HOT_DISTRICT
				const active = isHot && districtHighlighted
				const scan = isHot && scanning
				return (
					<GeoJSON
						key={`${d.name}-${isDark ? "d" : "l"}-${active ? "hot" : "idle"}-${scan ? "scan" : ""}`}
						data={d.data as GeoJsonObject}
						style={{
							fillColor: active ? "#f59e0b" : scan ? "#fbbf24" : palette.districtFill,
							fillOpacity: active ? (isDark ? 0.28 : 0.32) : scan ? 0.24 : palette.districtFillOpacity,
							color: active ? palette.activeStroke : palette.districtStroke,
							weight: active ? 2.4 : 0.9,
							opacity: 1,
							dashArray: scan ? "4 6" : undefined
						}}
					/>
				)
			})}

			{showParcels &&
				parcels.map((p, i) => (
					<GeoJSON
						key={`parcel-hot-${i}-${isDark ? "d" : "l"}`}
						data={p as GeoJsonObject}
						style={{
							fillColor: "#f59e0b",
							fillOpacity: isDark ? 0.55 : 0.65,
							color: palette.parcelStroke,
							weight: 2.6,
							opacity: 1
						}}
					/>
				))}

			<FlyController districtBounds={districtBounds} parcelBounds={parcelBounds} phase={phase} />
		</MapContainer>
	)
}