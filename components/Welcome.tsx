"use client";
import { useRive } from "@rive-app/react-canvas";
import Sphere from "./Sphere";

const Welcome = () => {
    const { RiveComponent } = useRive({
        src: "/analyticalogo.riv",
        stateMachines: "State Machine 1",
        autoplay: true,
    });

    return (
        <div className='w-full h-screen relative overflow-hidden bg-transparent'>
            <img 
                src="/background.png" 
                alt="Background"
                className="w-full h-full absolute inset-0 object-cover z-0 pointer-events-none"
            />

            <Sphere />

            {/* glow pod logo */}
            <div
                className="absolute inset-0 m-auto pointer-events-none z-20"
                style={{
                    width: "300px",
                    height: "300px",
                    borderRadius: "80%",
                    background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 190%)",
                    filter: "blur(20px)",
                }}
            />

            {/* Rive.app logo */}
            <div className="absolute inset-0 m-auto z-30 flex items-center justify-center pointer-events-none pr-9">
                <div className="w-[350px] h-[350px]">
                    {RiveComponent && <RiveComponent />}
                </div>
            </div>
        </div>
    )
}

export default Welcome;