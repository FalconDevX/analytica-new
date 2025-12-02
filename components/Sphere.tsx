"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";

export default function Sphere() {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const materialRef = useRef<THREE.PointsMaterial | null>(null);
    const lineMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
    const textureRef = useRef<THREE.CanvasTexture | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        scene.background = null;
        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 3;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(theme === "dark" ? 0x000000 : 0xffffff, 0);
        renderer.domElement.style.background = "transparent";
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        mountRef.current.appendChild(renderer.domElement);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const N = 20000;
        const points = [];
        const offset = 2 / N;
        const increment = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < N; i++) {
            const y = i * offset - 1 + offset / 2;
            const r = Math.sqrt(1 - y * y);
            const phi = i * increment;

            const x = Math.cos(phi) * r;
            const z = Math.sin(phi) * r;

            points.push(x, y, z);
        }

        const basePositions = new Float32Array(points);

        const oscPhase = new Float32Array(N);
        for (let i = 0; i < N; i++) {
            oscPhase[i] = Math.random() * Math.PI * 2;
        }

        const introDurations = new Float32Array(N);
        const minIntroDuration = 0.8;
        const maxIntroDuration = 1.0;
        for (let i = 0; i < N; i++) {
            introDurations[i] = minIntroDuration + Math.random() * (maxIntroDuration - minIntroDuration);
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(points, 3)
        );

        const startPositions = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            startPositions[i * 3] = 0;
            startPositions[i * 3 + 1] = 0;
            startPositions[i * 3 + 2] = 0;
        }
        (geometry.attributes.position.array as Float32Array).set(startPositions);
        geometry.attributes.position.needsUpdate = true;

        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d')!;
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, theme === "dark" ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)');
        gradient.addColorStop(1, theme === "dark" ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        textureRef.current = texture;

        const material = new THREE.PointsMaterial({
            color: theme === "dark" ? "white" : "black",
            size: 0.01,
            map: texture,
            alphaMap: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        materialRef.current = material;

        const sphere = new THREE.Points(geometry, material);
        sphere.scale.setScalar(1.15);
        scene.add(sphere);

        const maxLineDistance = 0.07;
        const maxLineDistanceSq = maxLineDistance * maxLineDistance;
        const maxConnectionsPerPoint = 5;
        const maxSegments = 100000;
        const linePointsCount = 30000;

        const neighborPairs: number[] = [];
        const connectionsCount = new Uint16Array(N);

        const cellSize = maxLineDistance;
        const invCellSize = 1 / cellSize;
        const cellMap = new Map<string, number[]>();

        const getCellKey = (x: number, y: number, z: number) => {
            const ix = Math.floor(x * invCellSize);
            const iy = Math.floor(y * invCellSize);
            const iz = Math.floor(z * invCellSize);
            return `${ix},${iy},${iz}`;
        };

        const usableCount = Math.min(linePointsCount, N);
        for (let i = 0; i < usableCount; i++) {
            const bx = basePositions[i * 3];
            const by = basePositions[i * 3 + 1];
            const bz = basePositions[i * 3 + 2];
            const key = getCellKey(bx, by, bz);
            const arr = cellMap.get(key);
            if (arr) {
                arr.push(i);
            } else {
                cellMap.set(key, [i]);
            }
        }
        let segmentCount = 0;
        for (let i = 0; i < usableCount && segmentCount < maxSegments; i++) {
            if (connectionsCount[i] >= maxConnectionsPerPoint) continue;

            const bx = basePositions[i * 3];
            const by = basePositions[i * 3 + 1];
            const bz = basePositions[i * 3 + 2];

            const cx = Math.floor(bx * invCellSize);
            const cy = Math.floor(by * invCellSize);
            const cz = Math.floor(bz * invCellSize);

            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dz = -1; dz <= 1; dz++) {
                        const key = `${cx + dx},${cy + dy},${cz + dz}`;
                        const arr = cellMap.get(key);
                        if (!arr) continue;

                        for (const j of arr) {
                            if (j <= i) continue;
                            if (connectionsCount[i] >= maxConnectionsPerPoint) break;
                            if (connectionsCount[j] >= maxConnectionsPerPoint) continue;
                            if (segmentCount >= maxSegments) break;

                            const bx2 = basePositions[j * 3];
                            const by2 = basePositions[j * 3 + 1];
                            const bz2 = basePositions[j * 3 + 2];

                            const dxp = bx2 - bx;
                            const dyp = by2 - by;
                            const dzp = bz2 - bz;
                            const distSq = dxp * dxp + dyp * dyp + dzp * dzp;

                            if (distSq <= maxLineDistanceSq) {
                                neighborPairs.push(i, j);
                                connectionsCount[i]++;
                                connectionsCount[j]++;
                                segmentCount++;
                            }
                        }
                    }
                }
            }
        }

        let linePositions: Float32Array | null = null;
        let lineGeometry: THREE.BufferGeometry | null = null;
        let lineMaterial: THREE.LineBasicMaterial | null = null;
        let lineSegments: THREE.LineSegments | null = null;

        if (segmentCount > 0) {
            linePositions = new Float32Array(segmentCount * 2 * 3);
            lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute(
                "position",
                new THREE.BufferAttribute(linePositions, 3)
            );
            lineMaterial = new THREE.LineBasicMaterial({
                color: theme === "dark" ? 0xffffff : 0x000000,
                transparent: true,
                opacity: 0.02,        
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                linewidth: 0.1
            });
            lineMaterialRef.current = lineMaterial;
            lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
            sphere.add(lineSegments);
        }

        let isIntro = true;
        let introProgress = 0;

        const mouse = new THREE.Vector2();
        const mouseWorld = new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        let isHovering = false;

        const handleMouseEnter = () => {
            isHovering = true;
        };

        const handleMouseLeave = () => {
            isHovering = false;
            mouseWorld.set(999, 999, 999);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isHovering || !mountRef.current) return;

            const rect = mountRef.current.getBoundingClientRect();

            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const distance = -raycaster.ray.origin.z / raycaster.ray.direction.z;
            mouseWorld.copy(raycaster.ray.origin).add(
                raycaster.ray.direction.multiplyScalar(distance)
            );
        };

        if (mountRef.current) {
            mountRef.current.addEventListener("mouseenter", handleMouseEnter);
            mountRef.current.addEventListener("mouseleave", handleMouseLeave);
            mountRef.current.addEventListener("mousemove", handleMouseMove);
        }

        const handleResize = () => {
            if (!mountRef.current) return;
            const { clientWidth, clientHeight } = mountRef.current;

            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener("resize", handleResize);

        const oscAmplitude = 0.015;
        const oscSpeed = 1.5;

        const animate = () => {
            sphere.rotation.y += 0.002;

            if (isIntro) {
                introProgress += 0.015;

                const positions = geometry.attributes.position as THREE.BufferAttribute;

                let allDone = true;

                for (let i = 0; i < positions.count; i++) {
                    const baseX = basePositions[i * 3];
                    const baseY = basePositions[i * 3 + 1];
                    const baseZ = basePositions[i * 3 + 2];

                    const duration = introDurations[i];
                    const tPoint = Math.min(introProgress / duration, 1);

                    if (tPoint < 1) {
                        allDone = false;
                    }

                    positions.setXYZ(
                        i,
                        baseX * tPoint,
                        baseY * tPoint,
                        baseZ * tPoint
                    );
                }

                positions.needsUpdate = true;

                if (allDone) {
                    isIntro = false;
                }

                renderer.render(scene, camera);
                requestAnimationFrame(animate);
                return;
            }

            const positions = geometry.attributes.position as THREE.BufferAttribute;
            const strength = 0.06;
            const returnSpeed = 0.05;

            const worldMatrix = sphere.matrixWorld;

            const time = performance.now() * 0.001;

            if (!isHovering) {
                for (let i = 0; i < positions.count; i++) {
                    const baseX = basePositions[i * 3];
                    const baseY = basePositions[i * 3 + 1];
                    const baseZ = basePositions[i * 3 + 2];

                    const currentX = positions.getX(i);
                    const currentY = positions.getY(i);
                    const currentZ = positions.getZ(i);

                    const phase = oscPhase[i];

                    const osc = Math.sin(time * oscSpeed + phase) * oscAmplitude;

                    const len = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
                    const nx = baseX / len;
                    const ny = baseY / len;
                    const nz = baseZ / len;

                    const targetX = baseX + nx * osc;
                    const targetY = baseY + ny * osc;
                    const targetZ = baseZ + nz * osc;

                    positions.setXYZ(
                        i,
                        currentX + (targetX - currentX) * 0.08,
                        currentY + (targetY - currentY) * 0.08,
                        currentZ + (targetZ - currentZ) * 0.08
                    );
                }

                if (linePositions && lineGeometry && neighborPairs.length > 0) {
                    const linePosAttr = lineGeometry.attributes
                        .position as THREE.BufferAttribute;
                    const segCount = neighborPairs.length / 2;
                    for (let s = 0; s < segCount; s++) {
                        const i = neighborPairs[s * 2];
                        const j = neighborPairs[s * 2 + 1];

                        const x1 = positions.getX(i);
                        const y1 = positions.getY(i);
                        const z1 = positions.getZ(i);
                        const x2 = positions.getX(j);
                        const y2 = positions.getY(j);
                        const z2 = positions.getZ(j);

                        const idx = s * 6;
                        linePositions[idx] = x1;
                        linePositions[idx + 1] = y1;
                        linePositions[idx + 2] = z1;
                        linePositions[idx + 3] = x2;
                        linePositions[idx + 4] = y2;
                        linePositions[idx + 5] = z2;
                    }
                    linePosAttr.needsUpdate = true;
                }

                positions.needsUpdate = true;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
                return;
            }

            for (let i = 0; i < positions.count; i++) {
                const baseX = basePositions[i * 3];
                const baseY = basePositions[i * 3 + 1];
                const baseZ = basePositions[i * 3 + 2];

                const currentX = positions.getX(i);
                const currentY = positions.getY(i);
                const currentZ = positions.getZ(i);

                const phase = oscPhase[i];
                const osc = Math.sin(time * oscSpeed + phase) * oscAmplitude;
                const len = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
                const nx = baseX / len;
                const ny = baseY / len;
                const nz = baseZ / len;
                const oscTargetX = baseX + nx * osc;
                const oscTargetY = baseY + ny * osc;
                const oscTargetZ = baseZ + nz * osc;

                const pointWorld = new THREE.Vector3(currentX, currentY, currentZ);
                pointWorld.applyMatrix4(worldMatrix);

                const dx = mouseWorld.x - pointWorld.x;
                const dy = mouseWorld.y - pointWorld.y;
                const dz = mouseWorld.z - pointWorld.z;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                const influence = Math.exp(-dist * 4.5) * strength * 10.0;

                if (influence > 0.0005) {
                    const minDist = 0.25;
                    const damp = Math.max(dist / minDist, 1);

                    const MAX_DIST = 0.35;
                    let newX = currentX + (dx / damp) * influence;
                    let newY = currentY + (dy / damp) * influence;
                    let newZ = currentZ + (dz / damp) * influence;

                    const offX = newX - baseX;
                    const offY = newY - baseY;
                    const offZ = newZ - baseZ;
                    const offsetDist = Math.sqrt(offX * offX + offY * offY + offZ * offZ);

                    if (offsetDist > MAX_DIST) {
                        const scale = MAX_DIST / offsetDist;
                        newX = baseX + offX * scale;
                        newY = baseY + offY * scale;
                        newZ = baseZ + offZ * scale;
                    }

                    positions.setXYZ(i, newX, newY, newZ);
                } else {
                    positions.setXYZ(
                        i,
                        currentX + (oscTargetX - currentX) * returnSpeed,
                        currentY + (oscTargetY - currentY) * returnSpeed,
                        currentZ + (oscTargetZ - currentZ) * returnSpeed
                    );
                }
            }

            if (linePositions && lineGeometry && neighborPairs.length > 0) {
                const linePosAttr = lineGeometry.attributes
                    .position as THREE.BufferAttribute;
                const segCount = neighborPairs.length / 2;
                for (let s = 0; s < segCount; s++) {
                    const i = neighborPairs[s * 2];
                    const j = neighborPairs[s * 2 + 1];

                    const x1 = positions.getX(i);
                    const y1 = positions.getY(i);
                    const z1 = positions.getZ(i);
                    const x2 = positions.getX(j);
                    const y2 = positions.getY(j);
                    const z2 = positions.getZ(j);

                    const idx = s * 6;
                    linePositions[idx] = x1;
                    linePositions[idx + 1] = y1;
                    linePositions[idx + 2] = z1;
                    linePositions[idx + 3] = x2;
                    linePositions[idx + 4] = y2;
                    linePositions[idx + 5] = z2;
                }
                linePosAttr.needsUpdate = true;
            }

            positions.needsUpdate = true;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();
        return () => {
            if (mountRef.current) {
                mountRef.current.removeEventListener("mouseenter", handleMouseEnter);
                mountRef.current.removeEventListener("mouseleave", handleMouseLeave);
                mountRef.current.removeEventListener("mousemove", handleMouseMove);
                if (renderer.domElement.parentElement === mountRef.current) {
                    mountRef.current.removeChild(renderer.domElement);
                }
            }
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            geometry.dispose();
            if (materialRef.current) materialRef.current.dispose();
            if (lineGeometry) lineGeometry.dispose();
            if (lineMaterialRef.current) lineMaterialRef.current.dispose();
            if (textureRef.current) textureRef.current.dispose();
        };
    }, []);

    useEffect(() => {
        if (!materialRef.current) return;
        const isDark = theme === "dark";
        materialRef.current.color.set(isDark ? "white" : "black");
        materialRef.current.blending = isDark
            ? THREE.AdditiveBlending
            : THREE.NormalBlending;
        if (isDark) {
            if (textureRef.current) {
                materialRef.current.map = textureRef.current;
                materialRef.current.alphaMap = textureRef.current;
            }
            materialRef.current.opacity = 1.0;
            materialRef.current.transparent = true;
        } else {

            materialRef.current.map = null;
            materialRef.current.alphaMap = null;

            materialRef.current.opacity = 0.7;
            materialRef.current.transparent = true;
        }
        materialRef.current.needsUpdate = true;
        if (lineMaterialRef.current) {
            lineMaterialRef.current.color.set(isDark ? 0xffffff : 0x000000);
            lineMaterialRef.current.blending = isDark
                ? THREE.AdditiveBlending
                : THREE.NormalBlending;
            lineMaterialRef.current.needsUpdate = true;
        }
        if (textureRef.current) {
            const canvas = document.createElement("canvas");
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext("2d")!;
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

            gradient.addColorStop(0, isDark ? "rgba(255,255,255,1)" : "rgba(0,0,0,1)");
            gradient.addColorStop(1, isDark ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)");

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);

            textureRef.current.image = canvas;
            textureRef.current.needsUpdate = true;
        }
    }, [theme]);

    return (
        <div
            ref={mountRef}
            style={{
                width: "100%",
                height: "100vh",
                overflow: "hidden",
                position: "absolute",
                inset: 0,
                zIndex: 1,
            }}
        />
    );
}