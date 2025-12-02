"use client";
import { useRive } from "@rive-app/react-canvas";
import Sphere from "./Sphere";
import { useTheme } from "next-themes";
import LogoRiveLight from "./LogoRiveLight";
import LogoRiveDark from "./LogoRiveDark";

const Welcome = () => {
    const { theme } = useTheme();
    return (
        <div className='w-full h-screen relative overflow-hidden bg-transparent'>
            <img 
                src="/background.png" 
                alt="Background"
                className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none hidden dark:block"
            />
            <img 
                src="/background-white.png" 
                alt="Background"
                className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none dark:hidden"
            />

            <Sphere />

            {/* glow pod logo */}
            <div
                className="absolute inset-0 m-auto pointer-events-none z-20 hidden dark:block"
                style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "80%",
                    background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 190%)",
                    filter: "blur(20px)",
                }}
            />

            <div
                className="absolute inset-0 m-auto pointer-events-none z-20 block dark:hidden"
                style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "80%",
                    background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 190%)",
                    filter: "blur(20px)",
                }}
            />

            {/* Rive.app logo */}
            <div className="absolute inset-0 m-auto z-30 flex items-center justify-center pointer-events-none pr-9">
                <div className="w-[350px] h-[350px]">
                    {theme === "light" ? <LogoRiveDark /> : <LogoRiveLight />}
                </div>
            </div>
        </div>
    )
}

export default Welcome;