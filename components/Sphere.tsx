"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export default function Sphere() {
    const mountRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        //tworzenie sceny i kamery
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
        renderer.setClearColor(0x000000, 0);
        renderer.domElement.style.background = "transparent";
        renderer.setSize(
            mountRef.current.clientWidth,
            mountRef.current.clientHeight
        );
        mountRef.current.appendChild(renderer.domElement);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.04;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 0.6;
        controls.enablePan = false;
        controls.enableZoom = false;

        //punkty sfery fibo (elimnacja promieni)
        const N = 9000;
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

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(points, 3)
        );

        //wczytywanie tekstury
        const texture = new THREE.TextureLoader().load("/circle.png");

        const material = new THREE.PointsMaterial({
            color: "white",
            size: 0.01,
            map: texture,
            alphaMap: texture,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const sphere = new THREE.Points(geometry, material);
        sphere.scale.setScalar(1.15);
        scene.add(sphere);

        //interakcja z kursorem
        const mouse = new THREE.Vector2();
        const mouseWorld = new THREE.Vector3();
        const raycaster = new THREE.Raycaster();
        let isHovering = false;

        const handleMouseEnter = () => {
            isHovering = true;
        };

        const handleMouseLeave = () => {
            isHovering = false;
            //kursor poza scene 
            mouseWorld.set(999, 999, 999);
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (!isHovering || !mountRef.current) return;

            const rect = mountRef.current.getBoundingClientRect();

            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            //projekcia kursora na płaszczyznę z = 0
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

        //zmiana rozmiaru
        const handleResize = () => {
            if (!mountRef.current) return;
            const { clientWidth, clientHeight } = mountRef.current;

            camera.aspect = clientWidth / clientHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(clientWidth, clientHeight);
        };
        window.addEventListener("resize", handleResize);

        //animacja
        const animate = () => {
            const positions = geometry.attributes.position as THREE.BufferAttribute;
            const strength = 0.06;
            const returnSpeed = 0.05;

            if (!isHovering) {
                //brak kursora - reset do pozycji bazowych
                for (let i = 0; i < positions.count; i++) {
                    const baseX = basePositions[i * 3];
                    const baseY = basePositions[i * 3 + 1];
                    const baseZ = basePositions[i * 3 + 2];

                    const currentX = positions.getX(i);
                    const currentY = positions.getY(i);
                    const currentZ = positions.getZ(i);

                    positions.setXYZ(
                        i,
                        currentX + (baseX - currentX) * 0.05,
                        currentY + (baseY - currentY) * 0.05,
                        currentZ + (baseZ - currentZ) * 0.05
                    );
                }
                positions.needsUpdate = true;

                controls.update();
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
                return;
            }

            for (let i = 0; i < positions.count; i++) {
                const currentX = positions.getX(i);
                const currentY = positions.getY(i);
                const currentZ = positions.getZ(i);

                const baseX = basePositions[i * 3];
                const baseY = basePositions[i * 3 + 1];
                const baseZ = basePositions[i * 3 + 2];

                const dx = mouseWorld.x - currentX;
                const dy = mouseWorld.y - currentY;
                const dz = mouseWorld.z - currentZ;
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
                const influence = Math.exp(-dist * 4.5) * strength * 10.0;

                if (influence > 0.0005) {
                    const minDist = 0.25;
                    const damp = Math.max(dist / minDist, 1);

                    //limit maksymalnego odciągnięcia od powierzchni sfery
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
                        currentX + (baseX - currentX) * returnSpeed,
                        currentY + (baseY - currentY) * returnSpeed,
                        currentZ + (baseZ - currentZ) * returnSpeed
                    );
                }
            }
            positions.needsUpdate = true;

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        //czyszczenie po zakończeniu animacji
        return () => {
            controls.dispose();
            if (mountRef.current) {
                mountRef.current.removeEventListener("mouseenter", handleMouseEnter);
                mountRef.current.removeEventListener("mouseleave", handleMouseLeave);
                mountRef.current.removeEventListener("mousemove", handleMouseMove);
                mountRef.current.removeChild(renderer.domElement);
            }
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

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
