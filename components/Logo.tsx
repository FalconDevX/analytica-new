"use client";
import { motion } from "framer-motion";
import { HEAD_PATH, WIRE1_PATH, WIRE2_PATH, WIRE2_PATH_CIRCLE, WIRE3_PATH } from "./logoPaths";

const Logo = () => {
    return (
        <div className="scale-30 flex items-center justify-center w-full h-full mt-10 pl-[300px]">
            <motion.svg height='300' width='300' viewBox="0 0 1055 1438" className='head '
                initial={{ transform: "translate(0px, 0px) scale(0.95)", transformOrigin: "center" }}
                animate={{ transform: "translate(0px, 0px) scale(1)", transformOrigin: "center" }}
                transition={{ duration: 1, ease: "easeInOut" }}
            >
                <path d={HEAD_PATH} fill="white" />
            </motion.svg>

            <motion.svg
                height="300"
                width="300"
                viewBox="0 0 253 182"
                className="wire1"
                initial={{ x: -300, y: -100, scale: 0.15 }}
                animate={{ x: -285, y: -142, scale: 0.2 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            >
                <defs>
                    <filter id="filter0_d_240_33" x="99" y="0" width="154" height="154"
                        filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" />
                    <clipPath id="wire1-mask">
                        <rect x="0" y="0" width="300" height="500" />
                    </clipPath>
                </defs>

                <motion.g
                    clipPath="url(#wire1-mask)"
                    initial={{ x: -300 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <motion.g
                        filter="url(#filter0)"
                        style={{ transformOrigin: "left center" }}
                        animate={{
                            x: [0, 3, -2, 2, -1, 0],
                            y: [10, 20, 20, -1, 10, 10],
                            rotate: [0, 1.5, -1, 1, -0.8, 0],
                            scaleX: [1, 1.015, 0.985, 1.01, 0.99, 1],
                            scaleY: [1, 1.005, 0.995, 1.004, 0.996, 1],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <path d={WIRE1_PATH} fill="white" />
                        <rect
                            y="114.498"
                            width="123"
                            height="74.5838"
                            transform="rotate(-25.266 0 114.498)"
                            fill="white"
                        />
                    </motion.g>
                </motion.g>
            </motion.svg>

            <motion.svg
                height="300"
                width="300"
                viewBox="0 -20 362 506"
                className="wire2 absolute"
                initial={{ x: -130, y: -80, scale: 0.3 }}
                animate={{ x: -100, y: -100, scale: 0.4 }}
                transition={{ delay: 0.2, duration: 1, ease: "easeInOut" }}
            >
                <motion.g
                    style={{ transformOrigin: "left center" }}
                    animate={{
                        x: [0, 2, -1, 1.5, -1, 0],
                        y: [0, -12, 8, -10, 4, 0],
                        rotate: [0, 1.2, -0.8, 1, -0.6, 0],
                        scaleX: [1, 1.015, 0.985, 1.01, 0.99, 1],
                        scaleY: [1, 1.005, 0.995, 1.004, 0.996, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >

                    <path d={WIRE2_PATH} fill="white" />
                    <path d={WIRE2_PATH_CIRCLE} fill="white" />
                    <rect x="129.318" y="173.525" width="129.27" height="75.7515" transform="rotate(-43.832 129.318 173.525)" fill="white" />
                    <rect y="478.912" width="292.838" height="75.7515" transform="rotate(-69.3114 0 478.912)" fill="white" />
                </motion.g>

                <defs>
                    <filter id="filter0_d_240_32" x="207.868" y="0" width="154" height="154" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" />
                </defs>
            </motion.svg>

            <motion.svg
                height="300"
                width="300"
                viewBox="0 0 338 155"
                className="wire3 absolute"
                initial={{ x: -120, y: -100, scale: 0.15 }}
                animate={{ x: -70, y: -90, scale: 0.25 }}
                transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            >
                <defs>
                    <filter id="filter0_d_248_41" x="183.855" y="0.275391" width="154" height="154" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB" />
                </defs>

                <motion.g
                    clipPath="url(#wire2-mask)"
                    initial={{ x: -400 }}
                    animate={{ x: 0 }}
                    transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                >
                    <motion.g
                        filter="url(#filter0)"
                        style={{ transformOrigin: "left center" }}
                        animate={{
                            x: [0, 3, -2, 2.5, -1, 0],
                            y: [0, -15, 10, -12, 6, 0],
                            rotate: [0, 1.8, -1.2, 1.4, -0.8, 0],
                            scaleX: [1, 1.015, 0.985, 1.012, 0.988, 1],
                            scaleY: [1, 1.008, 0.992, 1.006, 0.994, 1],
                        }}
                        transition={{
                            duration: 7.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <path d={WIRE3_PATH} fill="white" />
                        <rect x="11.3607" width="199.156" height="75.7515" transform="rotate(8.62539 11.3607 0)" fill="white" />
                    </motion.g>
                </motion.g>
            </motion.svg>


        </div>

    )
}

export default Logo
