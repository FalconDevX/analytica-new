"use client";

import { ReactNode, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface RevealProps {
    children: ReactNode | ((visible: boolean) => ReactNode);
    delay?: number;
}

export default function Reveal({ children, delay = 0 }: RevealProps) {
    const ref = useRef(null);

    const isInView = useInView(ref, { 
        once: true,
        amount: 0.2,
        margin: "10% 0px -10% 0px"
    });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
        >
            {typeof children === "function" ? children(isInView) : children}
        </motion.div>
    );
}
