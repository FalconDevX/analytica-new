"use client"

import { useEffect, useRef } from "react"

type Point = number

export default function StockChart() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const frameRef = useRef<number | null>(null)

	useEffect(() => {
		const canvas = canvasRef.current!
		const ctx = canvas.getContext("2d")!

		let W = 0,
			H = 0,
			cssW = 0,
			cssH = 0

		const resize = () => {
			const parent = canvas.parentElement!
			const dpr = window.devicePixelRatio || 1
			cssW = parent.clientWidth
			cssH = parent.clientHeight
			W = canvas.width = Math.round(cssW * dpr)
			H = canvas.height = Math.round(cssH * dpr)
			canvas.style.width = "100%"
			canvas.style.height = "100%"
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		}

		resize()
		window.addEventListener("resize", resize)

		const N = 120
		let prices: Point[] = Array.from({ length: N }, (_, i) => 550 + Math.sin(i * 0.18) * 20 + Math.random() * 10)
		let t = 0

		const stars = Array.from({ length: 180 }, () => ({
			x: Math.random(),
			y: Math.random(),
			r: Math.random() * 1.2 + 0.2,
			brightness: Math.random() * 0.6 + 0.2,
			twinkle: Math.random() * Math.PI * 2,
			twinkleSpeed: Math.random() * 0.03 + 0.005
		}))

		const gridRows = 9,
			gridCols = 14

		const draw = () => {
			t += 0.014

			if (Math.random() < 0.3) {
				const last = prices[prices.length - 1]
				const next = last + (Math.random() - 0.48) * 7 + Math.sin(t * 0.6) * 1.2
				prices.push(Math.max(490, Math.min(620, next)))
				prices = prices.slice(-N)
			}

			const pad = { l: 48, r: 110, t: 60, b: 60 }
			const w = cssW,
				h = cssH
			const cw = w - pad.l - pad.r
			const ch = h - pad.t - pad.b
			const min = Math.min(...prices) - 12
			const max = Math.max(...prices) + 12
			const xS = (i: number) => pad.l + (i / (prices.length - 1)) * cw
			const yS = (p: number) => pad.t + ch - ((p - min) / (max - min)) * ch

			ctx.fillStyle = "#020409"
			ctx.fillRect(0, 0, w, h)

			const bgGrad = ctx.createRadialGradient(w * 0.2, h * 0.8, 0, w * 0.2, h * 0.8, w * 0.7)
			bgGrad.addColorStop(0, "rgba(10, 20, 60, 0.6)")
			bgGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
			ctx.fillStyle = bgGrad
			ctx.fillRect(0, 0, w, h)

			stars.forEach((s) => {
				s.twinkle += s.twinkleSpeed
				const alpha = s.brightness * (0.5 + 0.5 * Math.sin(s.twinkle))
				ctx.beginPath()
				ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
				ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`
				ctx.fill()
			})

			ctx.save()
			ctx.strokeStyle = "rgba(255, 180, 80, 0.08)"
			ctx.lineWidth = 0.5
			ctx.setLineDash([3, 12])
			for (let i = 0; i <= gridRows; i++) {
				const y = pad.t + (i / gridRows) * ch
				ctx.beginPath()
				ctx.moveTo(pad.l, y)
				ctx.lineTo(w - pad.r, y)
				ctx.stroke()
			}
			for (let i = 0; i <= gridCols; i++) {
				const x = pad.l + (i / gridCols) * cw
				ctx.beginPath()
				ctx.moveTo(x, pad.t)
				ctx.lineTo(x, pad.t + ch)
				ctx.stroke()
			}
			ctx.setLineDash([])

			for (let r = 0; r <= gridRows; r++) {
				for (let c = 0; c <= gridCols; c++) {
					const gx = pad.l + (c / gridCols) * cw
					const gy = pad.t + (r / gridRows) * ch
					ctx.beginPath()
					ctx.arc(gx, gy, 1.2, 0, Math.PI * 2)
					ctx.fillStyle = "rgba(255, 140, 30, 0.22)"
					ctx.fill()
				}
			}
			ctx.restore()

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.lineTo(xS(prices.length - 1), pad.t + ch)
			ctx.lineTo(xS(0), pad.t + ch)
			ctx.closePath()
			const areaGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + ch)
			areaGrad.addColorStop(0, "rgba(255, 100, 0, 0.18)")
			areaGrad.addColorStop(0.5, "rgba(200, 50, 0, 0.08)")
			areaGrad.addColorStop(1, "rgba(100, 0, 0, 0)")
			ctx.fillStyle = areaGrad
			ctx.fill()

			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				const dropH = (Math.sin(i * 0.4 + t) * 0.3 + 0.7) * 40 + 15
				const dg = ctx.createLinearGradient(x, y, x, y + dropH)
				dg.addColorStop(0, "rgba(255, 130, 0, 0.75)")
				dg.addColorStop(0.5, "rgba(220, 40, 0, 0.3)")
				dg.addColorStop(1, "rgba(150, 0, 0, 0)")
				ctx.beginPath()
				ctx.moveTo(x, y)
				ctx.lineTo(x, y + dropH)
				ctx.strokeStyle = dg
				ctx.lineWidth = 1.2
				ctx.stroke()
			})

			prices.forEach((p, i) => {
				if (i % 4 !== 0) return
				const x = xS(i),
					y = yS(p)
				const dotGrad = ctx.createRadialGradient(x, y, 0, x, y, 5)
				dotGrad.addColorStop(0, "rgba(255, 200, 50, 0.9)")
				dotGrad.addColorStop(0.4, "rgba(255, 100, 0, 0.4)")
				dotGrad.addColorStop(1, "rgba(255, 50, 0, 0)")
				ctx.beginPath()
				ctx.arc(x, y, 5, 0, Math.PI * 2)
				ctx.fillStyle = dotGrad
				ctx.fill()
				ctx.beginPath()
				ctx.arc(x, y, 1.5, 0, Math.PI * 2)
				ctx.fillStyle = "rgba(255, 240, 180, 0.95)"
				ctx.fill()
			})

			ctx.lineJoin = "round"
			ctx.lineCap = "round"

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "rgba(255, 60, 0, 0.35)"
			ctx.lineWidth = 10
			ctx.shadowColor = "rgba(255, 80, 0, 0.6)"
			ctx.shadowBlur = 22
			ctx.stroke()
			ctx.shadowBlur = 0

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "rgba(255, 130, 0, 0.6)"
			ctx.lineWidth = 4
			ctx.shadowColor = "rgba(255, 150, 0, 0.5)"
			ctx.shadowBlur = 12
			ctx.stroke()
			ctx.shadowBlur = 0

			ctx.beginPath()
			prices.forEach((p, i) => {
				const x = xS(i),
					y = yS(p)
				i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
			})
			ctx.strokeStyle = "#ffb200"
			ctx.lineWidth = 1.8
			ctx.shadowColor = "rgba(255, 200, 50, 0.9)"
			ctx.shadowBlur = 6
			ctx.stroke()
			ctx.shadowBlur = 0

			const last = prices[prices.length - 1]
			const lx = xS(prices.length - 1),
				ly = yS(last)

			const pulse = 0.5 + 0.5 * Math.sin(t * 4)
			ctx.beginPath()
			ctx.arc(lx, ly, 7 + pulse * 4, 0, Math.PI * 2)
			ctx.strokeStyle = `rgba(255, 200, 50, ${0.15 + pulse * 0.2})`
			ctx.lineWidth = 1.5
			ctx.stroke()

			ctx.beginPath()
			ctx.arc(lx, ly, 4, 0, Math.PI * 2)
			ctx.fillStyle = "#ffe080"
			ctx.shadowColor = "#ffcc00"
			ctx.shadowBlur = 18
			ctx.fill()
			ctx.shadowBlur = 0

			ctx.beginPath()
			ctx.arc(lx, ly, 1.8, 0, Math.PI * 2)
			ctx.fillStyle = "#ffffff"
			ctx.fill()

			ctx.font = "italic 600 20px monospace"
			ctx.fillStyle = "#ffcc00"
			ctx.shadowColor = "rgba(255, 200, 0, 0.8)"
			ctx.shadowBlur = 12
			ctx.fillText(`$${last.toFixed(2)}`, lx + 14, ly - 8)
			ctx.shadowBlur = 0

			ctx.font = "11px monospace"
			ctx.fillStyle = "rgba(255, 160, 60, 0.55)"
			ctx.textAlign = "right"
			for (let i = 0; i <= 4; i++) {
				const val = min + (max - min) * (i / 4)
				const y = pad.t + ch - (i / 4) * ch
				ctx.fillText("$" + val.toFixed(0), pad.l - 6, y + 4)
			}
			ctx.textAlign = "left"

			frameRef.current = requestAnimationFrame(draw)
		}

		draw()

		return () => {
			if (frameRef.current) cancelAnimationFrame(frameRef.current)
			window.removeEventListener("resize", resize)
		}
	}, [])

	return (
		<div className="h-full w-full overflow-hidden rounded-2xl bg-black">
			<canvas ref={canvasRef} className="h-full w-full" />
		</div>
	)
}
