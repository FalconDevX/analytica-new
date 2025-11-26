import { useEffect } from "react";
import VanillaTilt from "vanilla-tilt";

//hook do obsługi efektu tilt
export default function useTilt() {
    useEffect(() => {
        VanillaTilt.init(document.querySelector("[data-tilt]") as HTMLElement, {
            //maks kat obrotu
            max: 10,
            glare: true,
            "max-glare": 0.9,
        });
    }, []);
}