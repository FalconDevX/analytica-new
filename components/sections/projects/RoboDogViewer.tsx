"use client"

import { Suspense, useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { useGLTF, Environment, Center, OrbitControls } from "@react-three/drei"
import { EffectComposer, Bloom, Vignette, BrightnessContrast, ToneMapping } from "@react-three/postprocessing"
import { ToneMappingMode, BlendFunction } from "postprocessing"
import { ACESFilmicToneMapping, Vector3 } from "three"
import type { Object3D, Mesh, DirectionalLight } from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"

const MODEL_URL = "/robot_dog_unitree_go2.glb"

const IDLE_RESUME_MS = 2500
const AUTO_ROTATE_SPEED = 0.6

function RoboDogModel() {
	const { scene } = useGLTF(MODEL_URL)

	useEffect(() => {
		scene.traverse((obj: Object3D) => {
			const mesh = obj as Mesh
			if (mesh.isMesh) {
				mesh.castShadow = true
				mesh.receiveShadow = true
			}
		})
	}, [scene])

	return <primitive object={scene} />
}

useGLTF.preload(MODEL_URL)

function AutoResume({
	controlsRef,
	isInteracting
}: {
	controlsRef: React.RefObject<OrbitControlsImpl | null>
	isInteracting: boolean
}) {
	useFrame(() => {
		const controls = controlsRef.current
		if (!controls) return
		const targetSpeed = isInteracting ? 0 : AUTO_ROTATE_SPEED
		const current = controls.autoRotateSpeed ?? 0
		const next = current + (targetSpeed - current) * 0.05
		controls.autoRotateSpeed = Math.abs(next) < 0.001 ? 0 : next
		controls.autoRotate = !isInteracting
	})
	return null
}

function CameraFollowSun({
	lightRef,
	offset,
	target
}: {
	lightRef: React.RefObject<DirectionalLight | null>
	offset: [number, number, number]
	target: [number, number, number]
}) {
	const offsetVec = useRef(new Vector3(...offset))
	const worldPos = useRef(new Vector3())
	const right = useRef(new Vector3())
	const up = useRef(new Vector3())
	const forward = useRef(new Vector3())

	useFrame(({ camera }) => {
		const light = lightRef.current
		if (!light) return

		camera.getWorldDirection(forward.current)
		right.current.crossVectors(forward.current, camera.up).normalize()
		up.current.crossVectors(right.current, forward.current).normalize()

		worldPos.current
			.set(target[0], target[1], target[2])
			.addScaledVector(right.current, offsetVec.current.x)
			.addScaledVector(up.current, offsetVec.current.y)
			.addScaledVector(forward.current, -offsetVec.current.z)

		light.position.copy(worldPos.current)
		light.target.position.set(target[0], target[1], target[2])
		light.target.updateMatrixWorld()
	})
	return null
}

export default function RoboDogViewer() {
	const controlsRef = useRef<OrbitControlsImpl | null>(null)
	const sunRef = useRef<DirectionalLight | null>(null)
	const [isInteracting, setIsInteracting] = useState(false)
	const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const clearIdleTimer = () => {
		if (idleTimerRef.current) {
			clearTimeout(idleTimerRef.current)
			idleTimerRef.current = null
		}
	}

	const handleStart = () => {
		clearIdleTimer()
		setIsInteracting(true)
	}

	const handleEnd = () => {
		clearIdleTimer()
		idleTimerRef.current = setTimeout(() => setIsInteracting(false), IDLE_RESUME_MS)
	}

	useEffect(() => () => clearIdleTimer(), [])

	return (
		<Canvas
			shadows
			dpr={[1, 2]}
			camera={{ position: [0.57, 0.34, 0.68], fov: 42 }}
			gl={{
				antialias: true,
				alpha: true,
				toneMapping: ACESFilmicToneMapping,
				toneMappingExposure: 1.0
			}}
			style={{ background: "transparent" }}
		>
			<ambientLight intensity={0.15} />

			<directionalLight
				ref={sunRef}
				position={[4, 5, 3]}
				intensity={2.2}
				color="#d8e6ff"
				castShadow
				shadow-mapSize-width={2048}
				shadow-mapSize-height={2048}
				shadow-bias={-0.0001}
				shadow-camera-near={0.1}
				shadow-camera-far={20}
				shadow-camera-left={-4}
				shadow-camera-right={4}
				shadow-camera-top={4}
				shadow-camera-bottom={-4}
			/>

			<CameraFollowSun lightRef={sunRef} offset={[2.5, 3.5, 2]} target={[0, -0.3, 0]} />

			<directionalLight position={[-3.5, 2.5, 2]} intensity={0.35} color="#9bb8ff" />

			<directionalLight position={[-1.5, 2.5, -3.5]} intensity={1.6} color="#e6efff" />

			<Suspense fallback={null}>
				<Center disableY={false} position={[0, -0.3, 0]}>
					<RoboDogModel />
				</Center>
				<Environment preset="night" environmentIntensity={0.4} />
			</Suspense>

			<EffectComposer multisampling={4}>
				<Bloom intensity={0.45} luminanceThreshold={0.75} luminanceSmoothing={0.25} mipmapBlur />
				<BrightnessContrast brightness={0.04} contrast={0.12} />
				<ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
				<Vignette offset={0.3} darkness={0.35} blendFunction={BlendFunction.NORMAL} />
			</EffectComposer>

			<OrbitControls
				ref={controlsRef}
				target={[0, -0.3, 0]}
				enablePan={false}
				enableZoom={false}
				enableDamping
				dampingFactor={0.1}
				autoRotate
				autoRotateSpeed={AUTO_ROTATE_SPEED}
				minPolarAngle={Math.PI / 3.2}
				maxPolarAngle={Math.PI / 1.9}
				onStart={handleStart}
				onEnd={handleEnd}
			/>

			<AutoResume controlsRef={controlsRef} isInteracting={isInteracting} />
		</Canvas>
	)
}
