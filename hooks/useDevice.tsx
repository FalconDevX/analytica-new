"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

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
	if (typeof window === "undefined") return null
	const params = new URLSearchParams(window.location.search)
	const device = params.get("device")
	if (device === "mobile" || device === "desktop") return device
	return null
}

export function DeviceProvider({ children }: { children: ReactNode }) {
	const [forcedDevice, setForcedDevice] = useState<DeviceMode>(() => readForcedDevice())

	useEffect(() => {
		const next = readForcedDevice()
		setForcedDevice(next)

		const root = document.documentElement
		root.classList.toggle("device-mobile", next === "mobile")
		root.classList.toggle("device-desktop", next === "desktop")
	}, [])

	return (
		<DeviceContext.Provider value={{ forcedDevice, isForcedMobile: forcedDevice === "mobile" }}>
			{children}
		</DeviceContext.Provider>
	)
}

export function useDevice() {
	return useContext(DeviceContext)
}
