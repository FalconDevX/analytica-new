"use client"

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react"

type DeviceMode = "mobile" | "desktop" | null

type DeviceContextValue = {
	forcedDevice: DeviceMode
	isForcedMobile: boolean
}

const DeviceContext = createContext<DeviceContextValue>({
	forcedDevice: null,
	isForcedMobile: false
})

function readForcedDevice(): DeviceMode {
	const device = new URLSearchParams(window.location.search).get("device")
	if (device === "mobile" || device === "desktop") return device
	return null
}

const subscribe = () => () => {}

export function DeviceProvider({ children }: { children: ReactNode }) {
	// null on the server and during hydration, then the ?device= value — no hydration mismatch.
	const forcedDevice = useSyncExternalStore(subscribe, readForcedDevice, () => null)

	useEffect(() => {
		const root = document.documentElement
		root.classList.toggle("device-mobile", forcedDevice === "mobile")
		root.classList.toggle("device-desktop", forcedDevice === "desktop")
	}, [forcedDevice])

	return (
		<DeviceContext.Provider value={{ forcedDevice, isForcedMobile: forcedDevice === "mobile" }}>
			{children}
		</DeviceContext.Provider>
	)
}

export function useDevice() {
	return useContext(DeviceContext)
}
