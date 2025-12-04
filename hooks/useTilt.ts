"use client";
import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

export default function useTilt() {
    useEffect(() => {
        const nodeList = document.querySelectorAll("[data-tilt]");

        const elements = Array.from(nodeList) as HTMLElement[];

        if (elements.length > 0) {
            VanillaTilt.init(elements, {
                max: 20,
                glare: false,
                "max-glare": 0.9,
            });
        }
    }, []);
}
